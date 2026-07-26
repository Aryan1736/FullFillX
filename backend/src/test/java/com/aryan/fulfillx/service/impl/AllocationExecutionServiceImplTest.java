package com.aryan.fulfillx.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.aryan.fulfillx.algorithm.model.OptimizationResult;
import com.aryan.fulfillx.algorithm.model.PlanScoreBreakdown;
import com.aryan.fulfillx.algorithm.model.ScoreBreakdown;
import com.aryan.fulfillx.algorithm.model.WarehouseCandidate;
import com.aryan.fulfillx.dto.response.AllocationResponse;
import com.aryan.fulfillx.entity.Allocation;
import com.aryan.fulfillx.entity.CustomerOrder;
import com.aryan.fulfillx.entity.Inventory;
import com.aryan.fulfillx.entity.Product;
import com.aryan.fulfillx.entity.Warehouse;
import com.aryan.fulfillx.exception.BadRequestException;
import com.aryan.fulfillx.exception.InsufficientInventoryException;
import com.aryan.fulfillx.exception.ResourceNotFoundException;
import com.aryan.fulfillx.mapper.AllocationMapper;
import com.aryan.fulfillx.mapper.AllocationSnapshotMapper;
import com.aryan.fulfillx.repository.AllocationRepository;
import com.aryan.fulfillx.repository.CustomerOrderRepository;
import com.aryan.fulfillx.repository.InventoryRepository;
import com.aryan.fulfillx.repository.WarehouseRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@DisplayName("AllocationExecutionService")
class AllocationExecutionServiceImplTest {

    private static final UUID ORDER_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID WAREHOUSE_NEAR_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private static final UUID WAREHOUSE_FAR_ID = UUID.fromString("33333333-3333-3333-3333-333333333333");
    private static final UUID PRODUCT_A_ID = UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private static final UUID PRODUCT_B_ID = UUID.fromString("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");

    @Mock
    private AllocationRepository allocationRepository;

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private WarehouseRepository warehouseRepository;

    @Mock
    private CustomerOrderRepository customerOrderRepository;

    @Mock
    private AllocationMapper allocationMapper;

    @Mock
    private AllocationSnapshotMapper allocationSnapshotMapper;

    @InjectMocks
    private AllocationExecutionServiceImpl service;

    private CustomerOrder order;
    private Warehouse nearWarehouse;
    private Warehouse farWarehouse;
    private Product productA;
    private Product productB;

    @BeforeEach
    void setUp() {
        order = CustomerOrder.builder().id(ORDER_ID).totalItems(5).build();
        nearWarehouse = Warehouse.builder()
                .id(WAREHOUSE_NEAR_ID)
                .name("Near Warehouse")
                .currentLoad(10)
                .build();
        farWarehouse = Warehouse.builder()
                .id(WAREHOUSE_FAR_ID)
                .name("Far Warehouse")
                .currentLoad(5)
                .build();
        productA = Product.builder().id(PRODUCT_A_ID).name("Product A").build();
        productB = Product.builder().id(PRODUCT_B_ID).name("Product B").build();
    }

    @Test
    @DisplayName("executes single-warehouse allocation and reserves inventory")
    void execute_singleWarehouse_success() {
        OptimizationResult optimizationResult = optimizationResult(
                candidate(WAREHOUSE_NEAR_ID, "Near Warehouse", Map.of(PRODUCT_A_ID, 3)));
        Inventory inventory = inventory(nearWarehouse, productA, 10, 0);

        when(customerOrderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(inventoryRepository.findByWarehouse_IdAndProduct_Id(WAREHOUSE_NEAR_ID, PRODUCT_A_ID))
                .thenReturn(Optional.of(inventory));
        when(warehouseRepository.findById(WAREHOUSE_NEAR_ID)).thenReturn(Optional.of(nearWarehouse));
        when(allocationSnapshotMapper.toPlanScoreBreakdownSnapshot(any())).thenReturn(null);
        when(allocationSnapshotMapper.toReasoningSnapshots(any())).thenReturn(List.of());
        when(allocationSnapshotMapper.toWarehouseSnapshots(any())).thenReturn(List.of());
        when(allocationRepository.save(any())).thenAnswer(invocation -> {
            Allocation allocation = invocation.getArgument(0);
            allocation.setId(UUID.randomUUID());
            return allocation;
        });
        when(allocationMapper.toResponse(any())).thenReturn(
                AllocationResponse.builder().orderId(ORDER_ID).build());

        AllocationResponse response = service.execute(ORDER_ID, optimizationResult);

        assertNotNull(response);
        assertEquals(7, inventory.getAvailableQuantity());
        assertEquals(3, inventory.getReservedQuantity());
        assertEquals(13, nearWarehouse.getCurrentLoad());

        ArgumentCaptor<Allocation> allocationCaptor = ArgumentCaptor.forClass(Allocation.class);
        verify(allocationRepository).save(allocationCaptor.capture());
        Allocation savedAllocation = allocationCaptor.getValue();
        assertEquals(ORDER_ID, savedAllocation.getOrder().getId());
        assertEquals(1, savedAllocation.getAllocationItems().size());
        assertEquals(3, savedAllocation.getAllocationItems().getFirst().getQuantity());
    }

    @Test
    @DisplayName("executes split-shipment allocation across multiple warehouses")
    void execute_splitShipment_success() {
        OptimizationResult optimizationResult = optimizationResult(
                candidate(WAREHOUSE_NEAR_ID, "Near Warehouse", Map.of(PRODUCT_A_ID, 4)),
                candidate(WAREHOUSE_FAR_ID, "Far Warehouse", Map.of(PRODUCT_A_ID, 2)));
        Inventory nearInventory = inventory(nearWarehouse, productA, 10, 0);
        Inventory farInventory = inventory(farWarehouse, productA, 10, 0);

        when(customerOrderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(inventoryRepository.findByWarehouse_IdAndProduct_Id(WAREHOUSE_NEAR_ID, PRODUCT_A_ID))
                .thenReturn(Optional.of(nearInventory));
        when(inventoryRepository.findByWarehouse_IdAndProduct_Id(WAREHOUSE_FAR_ID, PRODUCT_A_ID))
                .thenReturn(Optional.of(farInventory));
        when(warehouseRepository.findById(WAREHOUSE_NEAR_ID)).thenReturn(Optional.of(nearWarehouse));
        when(warehouseRepository.findById(WAREHOUSE_FAR_ID)).thenReturn(Optional.of(farWarehouse));
        when(allocationSnapshotMapper.toPlanScoreBreakdownSnapshot(any())).thenReturn(null);
        when(allocationSnapshotMapper.toReasoningSnapshots(any())).thenReturn(List.of());
        when(allocationSnapshotMapper.toWarehouseSnapshots(any())).thenReturn(List.of());
        when(allocationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(allocationMapper.toResponse(any())).thenReturn(AllocationResponse.builder().build());

        service.execute(ORDER_ID, optimizationResult);

        assertEquals(6, nearInventory.getAvailableQuantity());
        assertEquals(4, nearInventory.getReservedQuantity());
        assertEquals(8, farInventory.getAvailableQuantity());
        assertEquals(2, farInventory.getReservedQuantity());
        assertEquals(14, nearWarehouse.getCurrentLoad());
        assertEquals(7, farWarehouse.getCurrentLoad());
    }

    @Test
    @DisplayName("throws when customer order does not exist")
    void execute_invalidOrder_notFound() {
        when(customerOrderRepository.findById(ORDER_ID)).thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.execute(ORDER_ID, optimizationResult(
                        candidate(WAREHOUSE_NEAR_ID, "Near Warehouse", Map.of(PRODUCT_A_ID, 1)))));
    }

    @Test
    @DisplayName("throws when optimization result has no allocation items")
    void execute_emptyOptimizationResult_badRequest() {
        OptimizationResult emptyResult = new OptimizationResult(
                "WEIGHTED_GREEDY",
                List.of(),
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                0,
                planScoreBreakdown(),
                List.of(),
                List.of(),
                null);

        when(customerOrderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));

        BadRequestException exception = assertThrows(
                BadRequestException.class, () -> service.execute(ORDER_ID, emptyResult));

        assertEquals("Optimization result contains no allocation items to execute", exception.getMessage());
        verify(allocationRepository, never()).save(any());
    }

    @Test
    @DisplayName("throws when inventory record is missing")
    void execute_missingInventoryRecord_insufficientInventory() {
        OptimizationResult optimizationResult = optimizationResult(
                candidate(WAREHOUSE_NEAR_ID, "Near Warehouse", Map.of(PRODUCT_A_ID, 2)));

        when(customerOrderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(inventoryRepository.findByWarehouse_IdAndProduct_Id(WAREHOUSE_NEAR_ID, PRODUCT_A_ID))
                .thenReturn(Optional.empty());

        assertThrows(
                InsufficientInventoryException.class,
                () -> service.execute(ORDER_ID, optimizationResult));
        verify(allocationRepository, never()).save(any());
    }

    @Test
    @DisplayName("throws when available inventory is insufficient")
    void execute_insufficientInventory_conflict() {
        OptimizationResult optimizationResult = optimizationResult(
                candidate(WAREHOUSE_NEAR_ID, "Near Warehouse", Map.of(PRODUCT_A_ID, 5)));
        Inventory inventory = inventory(nearWarehouse, productA, 2, 0);

        when(customerOrderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(inventoryRepository.findByWarehouse_IdAndProduct_Id(WAREHOUSE_NEAR_ID, PRODUCT_A_ID))
                .thenReturn(Optional.of(inventory));

        InsufficientInventoryException exception = assertThrows(
                InsufficientInventoryException.class,
                () -> service.execute(ORDER_ID, optimizationResult));

        assertEquals(
                String.format(
                        "Insufficient inventory at warehouse %s for product %s: requested 5, available 2",
                        WAREHOUSE_NEAR_ID,
                        PRODUCT_A_ID),
                exception.getMessage());
        verify(allocationRepository, never()).save(any());
    }

    @Test
    @DisplayName("throws when warehouse record is missing during load update")
    void execute_missingWarehouse_notFound() {
        OptimizationResult optimizationResult = optimizationResult(
                candidate(WAREHOUSE_NEAR_ID, "Near Warehouse", Map.of(PRODUCT_A_ID, 2)));
        Inventory inventory = inventory(nearWarehouse, productA, 10, 0);

        when(customerOrderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(inventoryRepository.findByWarehouse_IdAndProduct_Id(WAREHOUSE_NEAR_ID, PRODUCT_A_ID))
                .thenReturn(Optional.of(inventory));
        when(warehouseRepository.findById(WAREHOUSE_NEAR_ID)).thenReturn(Optional.empty());
        when(allocationSnapshotMapper.toPlanScoreBreakdownSnapshot(any())).thenReturn(null);
        when(allocationSnapshotMapper.toReasoningSnapshots(any())).thenReturn(List.of());
        when(allocationSnapshotMapper.toWarehouseSnapshots(any())).thenReturn(List.of());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.execute(ORDER_ID, optimizationResult));
        verify(allocationRepository, never()).save(any());
    }

    @Test
    @DisplayName("aggregates duplicate allocation lines for the same warehouse and product")
    void execute_duplicateLines_aggregatesQuantities() {
        OptimizationResult optimizationResult = optimizationResult(
                candidate(WAREHOUSE_NEAR_ID, "Near Warehouse", Map.of(PRODUCT_A_ID, 2, PRODUCT_B_ID, 1)),
                candidate(WAREHOUSE_NEAR_ID, "Near Warehouse", Map.of(PRODUCT_A_ID, 1)));
        Inventory inventoryA = inventory(nearWarehouse, productA, 10, 0);
        Inventory inventoryB = inventory(nearWarehouse, productB, 10, 0);

        when(customerOrderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(inventoryRepository.findByWarehouse_IdAndProduct_Id(WAREHOUSE_NEAR_ID, PRODUCT_A_ID))
                .thenReturn(Optional.of(inventoryA));
        when(inventoryRepository.findByWarehouse_IdAndProduct_Id(WAREHOUSE_NEAR_ID, PRODUCT_B_ID))
                .thenReturn(Optional.of(inventoryB));
        when(warehouseRepository.findById(WAREHOUSE_NEAR_ID)).thenReturn(Optional.of(nearWarehouse));
        when(allocationSnapshotMapper.toPlanScoreBreakdownSnapshot(any())).thenReturn(null);
        when(allocationSnapshotMapper.toReasoningSnapshots(any())).thenReturn(List.of());
        when(allocationSnapshotMapper.toWarehouseSnapshots(any())).thenReturn(List.of());
        when(allocationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(allocationMapper.toResponse(any())).thenReturn(AllocationResponse.builder().build());

        service.execute(ORDER_ID, optimizationResult);

        assertEquals(7, inventoryA.getAvailableQuantity());
        assertEquals(3, inventoryA.getReservedQuantity());
        assertEquals(9, inventoryB.getAvailableQuantity());
        assertEquals(1, inventoryB.getReservedQuantity());
    }

    @Test
    @DisplayName("rejects null order id")
    void execute_nullOrderId_throwsNullPointerException() {
        assertThrows(
                NullPointerException.class,
                () -> service.execute(null, optimizationResult(
                        candidate(WAREHOUSE_NEAR_ID, "Near Warehouse", Map.of(PRODUCT_A_ID, 1)))));
    }

    @Test
    @DisplayName("rejects null optimization result")
    void execute_nullOptimizationResult_throwsNullPointerException() {
        assertThrows(NullPointerException.class, () -> service.execute(ORDER_ID, null));
    }

    private OptimizationResult optimizationResult(WarehouseCandidate... candidates) {
        return new OptimizationResult(
                "WEIGHTED_GREEDY",
                List.of(candidates),
                BigDecimal.valueOf(12.5),
                BigDecimal.valueOf(25.0),
                24,
                planScoreBreakdown(),
                List.of(),
                List.of(candidates[0].getWarehouseId()),
                null);
    }

    private WarehouseCandidate candidate(UUID warehouseId, String warehouseName, Map<UUID, Integer> allocations) {
        ScoreBreakdown scoreBreakdown = new ScoreBreakdown(
                BigDecimal.ONE,
                BigDecimal.ONE,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ONE);
        return new WarehouseCandidate(
                warehouseId, warehouseName, allocations, BigDecimal.TEN, 24, scoreBreakdown);
    }

    private PlanScoreBreakdown planScoreBreakdown() {
        return new PlanScoreBreakdown(
                BigDecimal.ONE,
                BigDecimal.ONE,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ONE);
    }

    private Inventory inventory(Warehouse warehouse, Product product, int available, int reserved) {
        return Inventory.builder()
                .id(UUID.randomUUID())
                .warehouse(warehouse)
                .product(product)
                .availableQuantity(available)
                .reservedQuantity(reserved)
                .build();
    }
}
