package com.aryan.fulfillx.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.aryan.fulfillx.algorithm.model.OptimizationResult;
import com.aryan.fulfillx.algorithm.model.PlanScoreBreakdown;
import com.aryan.fulfillx.algorithm.model.ScoreBreakdown;
import com.aryan.fulfillx.algorithm.model.WarehouseCandidate;
import com.aryan.fulfillx.dto.response.AllocationResponse;
import com.aryan.fulfillx.entity.Allocation;
import com.aryan.fulfillx.entity.Customer;
import com.aryan.fulfillx.entity.CustomerOrder;
import com.aryan.fulfillx.entity.Inventory;
import com.aryan.fulfillx.entity.OrderItem;
import com.aryan.fulfillx.entity.OrderStatus;
import com.aryan.fulfillx.entity.Product;
import com.aryan.fulfillx.entity.Warehouse;
import com.aryan.fulfillx.exception.OrderAlreadyAllocatedException;
import com.aryan.fulfillx.repository.AllocationRepository;
import com.aryan.fulfillx.repository.CustomerOrderRepository;
import com.aryan.fulfillx.repository.CustomerRepository;
import com.aryan.fulfillx.repository.InventoryRepository;
import com.aryan.fulfillx.repository.ProductRepository;
import com.aryan.fulfillx.repository.WarehouseRepository;
import com.aryan.fulfillx.service.AllocationExecutionService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;

@SpringBootTest
@DisplayName("Allocation Concurrency & Uniqueness Integration Tests")
class AllocationConcurrencyIntegrationTest {

    @Autowired
    private AllocationExecutionService allocationExecutionService;

    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private CustomerOrderRepository customerOrderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    private Customer customer;
    private Product product;
    private Warehouse warehouse;
    private Inventory inventory;

    @BeforeEach
    void setUp() {
        customer = customerRepository.save(Customer.builder()
                .name("Concurrency Test Customer")
                .city("Mumbai")
                .latitude(19.0760)
                .longitude(72.8777)
                .build());

        product = productRepository.save(Product.builder()
                .name("Concurrency Test Product " + UUID.randomUUID())
                .category("Electronics")
                .weight(new BigDecimal("0.500"))
                .build());

        warehouse = warehouseRepository.save(Warehouse.builder()
                .name("Concurrency Test Warehouse " + UUID.randomUUID())
                .city("Mumbai")
                .latitude(19.0760)
                .longitude(72.8777)
                .capacity(10000)
                .currentLoad(10)
                .active(true)
                .build());

        inventory = inventoryRepository.save(Inventory.builder()
                .warehouse(warehouse)
                .product(product)
                .availableQuantity(50)
                .reservedQuantity(0)
                .build());
    }

    @AfterEach
    void tearDown() {
        // Clean up created entities safely
        allocationRepository.deleteAll();
        customerOrderRepository.deleteAll();
        inventoryRepository.deleteAll();
        warehouseRepository.deleteAll();
        productRepository.deleteAll();
        customerRepository.deleteAll();
    }

    @Test
    @DisplayName("A. Sequential duplicate execution rejects second attempt with OrderAlreadyAllocatedException")
    void execute_sequentialDuplicateAttempt_returnsConflict() {
        CustomerOrder order = createPendingOrder(5);
        OptimizationResult optimizationResult = buildOptimizationResult(warehouse.getId(), product.getId(), 5);

        // 1. First execution succeeds
        AllocationResponse firstResponse = allocationExecutionService.execute(order.getId(), optimizationResult);
        assertNotNull(firstResponse);
        assertEquals(order.getId(), firstResponse.getOrderId());

        CustomerOrder updatedOrder = customerOrderRepository.findById(order.getId()).orElseThrow();
        assertEquals(OrderStatus.ALLOCATED, updatedOrder.getStatus());
        assertTrue(allocationRepository.existsByOrder_Id(order.getId()));

        // 2. Second execution attempt must fail with OrderAlreadyAllocatedException
        OrderAlreadyAllocatedException exception = assertThrows(
                OrderAlreadyAllocatedException.class,
                () -> allocationExecutionService.execute(order.getId(), optimizationResult));
        assertTrue(exception.getMessage().contains(order.getId().toString()));

        // 3. Exactly one allocation row exists in the database
        assertEquals(1, allocationRepository.count());
    }

    @Test
    @DisplayName("B. Database uniqueness constraint prevents direct duplicate allocation rows for same order")
    void directPersistence_duplicateAllocationForSameOrder_throwsDataIntegrityViolationException() {
        CustomerOrder order = createPendingOrder(3);

        Allocation allocation1 = Allocation.builder()
                .order(order)
                .optimizationScore(new BigDecimal("95.0000"))
                .shippingCost(new BigDecimal("20.00"))
                .estimatedDeliveryHours(24)
                .strategyName("WEIGHTED_GREEDY")
                .build();
        allocationRepository.saveAndFlush(allocation1);

        Allocation allocation2 = Allocation.builder()
                .order(order)
                .optimizationScore(new BigDecimal("88.0000"))
                .shippingCost(new BigDecimal("25.00"))
                .estimatedDeliveryHours(48)
                .strategyName("WEIGHTED_GREEDY")
                .build();

        // Must violate uk_allocations_order_id unique constraint
        assertThrows(
                DataIntegrityViolationException.class,
                () -> allocationRepository.saveAndFlush(allocation2));
    }

    @Test
    @DisplayName("C. Concurrent execution: exactly one transaction succeeds, the other is cleanly rolled back")
    void execute_concurrentExecutionAttempts_exactlyOneSucceedsAndOneFails() throws Exception {
        CustomerOrder order = createPendingOrder(5);
        OptimizationResult optimizationResult = buildOptimizationResult(warehouse.getId(), product.getId(), 5);

        ExecutorService executor = Executors.newFixedThreadPool(2);
        CountDownLatch readyLatch = new CountDownLatch(2);
        CountDownLatch startLatch = new CountDownLatch(1);

        Callable<AllocationResponse> task = () -> {
            readyLatch.countDown();
            if (!startLatch.await(5, TimeUnit.SECONDS)) {
                throw new IllegalStateException("Timed out waiting for startLatch");
            }
            return allocationExecutionService.execute(order.getId(), optimizationResult);
        };

        Future<AllocationResponse> future1 = executor.submit(task);
        Future<AllocationResponse> future2 = executor.submit(task);

        // Wait until both threads are ready, then release them simultaneously
        assertTrue(readyLatch.await(5, TimeUnit.SECONDS));
        startLatch.countDown();

        int successCount = 0;
        int conflictCount = 0;

        try {
            AllocationResponse response = future1.get(10, TimeUnit.SECONDS);
            assertNotNull(response);
            successCount++;
        } catch (ExecutionException e) {
            Throwable cause = e.getCause();
            if (cause instanceof OrderAlreadyAllocatedException) {
                conflictCount++;
            } else {
                throw e;
            }
        }

        try {
            AllocationResponse response = future2.get(10, TimeUnit.SECONDS);
            assertNotNull(response);
            successCount++;
        } catch (ExecutionException e) {
            Throwable cause = e.getCause();
            if (cause instanceof OrderAlreadyAllocatedException) {
                conflictCount++;
            } else {
                throw e;
            }
        }

        executor.shutdown();
        assertTrue(executor.awaitTermination(5, TimeUnit.SECONDS));

        // Exactly one should succeed and exactly one should receive conflict
        assertEquals(1, successCount, "Exactly one concurrent execution must succeed");
        assertEquals(1, conflictCount, "Exactly one concurrent execution must receive conflict");

        // Exactly one allocation row exists in the database
        assertEquals(1, allocationRepository.count(), "Exactly one allocation record should exist");

        // Order status is ALLOCATED
        CustomerOrder finalOrder = customerOrderRepository.findById(order.getId()).orElseThrow();
        assertEquals(OrderStatus.ALLOCATED, finalOrder.getStatus());

        // Inventory is changed exactly once (available: 50 - 5 = 45, reserved: 0 + 5 = 5)
        Inventory finalInventory = inventoryRepository.findById(inventory.getId()).orElseThrow();
        assertEquals(45, finalInventory.getAvailableQuantity(), "Available inventory must be deducted exactly once");
        assertEquals(5, finalInventory.getReservedQuantity(), "Reserved inventory must be incremented exactly once");

        // Warehouse load is changed exactly once (currentLoad: 10 + 5 = 15)
        Warehouse finalWarehouse = warehouseRepository.findById(warehouse.getId()).orElseThrow();
        assertEquals(15, finalWarehouse.getCurrentLoad(), "Warehouse load must be incremented exactly once");
    }

    private CustomerOrder createPendingOrder(int quantity) {
        CustomerOrder order = CustomerOrder.builder()
                .customer(customer)
                .status(OrderStatus.PENDING)
                .totalItems(quantity)
                .orderItems(new ArrayList<>())
                .build();

        OrderItem item = OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(quantity)
                .build();
        order.getOrderItems().add(item);

        return customerOrderRepository.saveAndFlush(order);
    }

    private OptimizationResult buildOptimizationResult(UUID warehouseId, UUID productId, int quantity) {
        ScoreBreakdown scoreBreakdown = new ScoreBreakdown(
                BigDecimal.ONE,
                BigDecimal.ONE,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ONE);
        WarehouseCandidate candidate = new WarehouseCandidate(
                warehouseId,
                "Concurrency Test Warehouse",
                Map.of(productId, quantity),
                BigDecimal.TEN,
                24,
                scoreBreakdown);
        PlanScoreBreakdown planScoreBreakdown = new PlanScoreBreakdown(
                BigDecimal.ONE,
                BigDecimal.ONE,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ONE);
        return new OptimizationResult(
                "WEIGHTED_GREEDY",
                List.of(candidate),
                BigDecimal.valueOf(10.0),
                BigDecimal.valueOf(25.0),
                24,
                planScoreBreakdown,
                List.of(),
                List.of(warehouseId),
                null);
    }
}
