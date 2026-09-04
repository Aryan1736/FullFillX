package com.aryan.fulfillx.service.impl;

import com.aryan.fulfillx.algorithm.model.OptimizationResult;
import com.aryan.fulfillx.algorithm.model.WarehouseCandidate;
import com.aryan.fulfillx.dto.request.AllocationExecutionRequest;
import com.aryan.fulfillx.dto.response.AllocationResponse;
import com.aryan.fulfillx.dto.response.OptimizationResponseDto;
import com.aryan.fulfillx.entity.Allocation;
import com.aryan.fulfillx.entity.AllocationItem;
import com.aryan.fulfillx.entity.CustomerOrder;
import com.aryan.fulfillx.entity.Inventory;
import com.aryan.fulfillx.entity.OrderStatus;
import com.aryan.fulfillx.entity.Warehouse;
import com.aryan.fulfillx.exception.BadRequestException;
import com.aryan.fulfillx.exception.InsufficientInventoryException;
import com.aryan.fulfillx.exception.OrderAlreadyAllocatedException;
import com.aryan.fulfillx.exception.ResourceNotFoundException;
import com.aryan.fulfillx.mapper.AllocationMapper;
import com.aryan.fulfillx.mapper.AllocationSnapshotMapper;
import com.aryan.fulfillx.mapper.OptimizationMapper;
import com.aryan.fulfillx.repository.AllocationRepository;
import com.aryan.fulfillx.repository.CustomerOrderRepository;
import com.aryan.fulfillx.repository.InventoryRepository;
import com.aryan.fulfillx.repository.WarehouseRepository;
import com.aryan.fulfillx.service.AllocationExecutionService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AllocationExecutionServiceImpl implements AllocationExecutionService {

    private final AllocationRepository allocationRepository;
    private final InventoryRepository inventoryRepository;
    private final WarehouseRepository warehouseRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final AllocationMapper allocationMapper;
    private final AllocationSnapshotMapper allocationSnapshotMapper;
    private final OptimizationMapper optimizationMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public AllocationResponse execute(AllocationExecutionRequest request) {
        Objects.requireNonNull(request, "request must not be null");
        if (request.getOrderId() == null) {
            throw new BadRequestException("Order ID must not be null");
        }

        OptimizationResponseDto optimizationResultDto = request.resolveOptimizationResult();
        if (optimizationResultDto == null) {
            throw new BadRequestException("Optimization result must not be null");
        }

        OptimizationResult optimizationResult = optimizationMapper.toResult(optimizationResultDto);
        return execute(request.getOrderId(), optimizationResult);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public AllocationResponse execute(UUID orderId, OptimizationResult optimizationResult) {
        Objects.requireNonNull(orderId, "orderId must not be null");
        Objects.requireNonNull(optimizationResult, "optimizationResult must not be null");

        CustomerOrder order = findCustomerOrderOrThrow(orderId);
        if (order.getStatus() == OrderStatus.ALLOCATED || allocationRepository.existsByOrder_Id(orderId)) {
            throw new OrderAlreadyAllocatedException(orderId);
        }
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException(
                    String.format("Cannot execute allocation for order %s with status %s", orderId, order.getStatus()));
        }

        List<AllocationLine> allocationLines = flattenAllocationLines(optimizationResult);
        if (allocationLines.isEmpty()) {
            throw new BadRequestException("Optimization result contains no allocation items to execute");
        }

        Map<InventoryKey, Integer> quantitiesByInventoryKey = aggregateQuantities(allocationLines);
        validateAllocationQuantities(quantitiesByInventoryKey);

        Map<InventoryKey, Inventory> inventories = loadInventories(quantitiesByInventoryKey);
        validateInventoryAvailability(quantitiesByInventoryKey, inventories);
        applyInventoryReservations(quantitiesByInventoryKey, inventories);

        Allocation allocation = buildAllocation(order, optimizationResult, quantitiesByInventoryKey, inventories);
        updateWarehouseLoads(allocationLines);

        Allocation savedAllocation;
        try {
            savedAllocation = allocationRepository.saveAndFlush(allocation);
            order.setStatus(OrderStatus.ALLOCATED);
            customerOrderRepository.saveAndFlush(order);
        } catch (DataIntegrityViolationException ex) {
            log.warn(
                    "event=allocation_execution_conflict orderId={} message={}",
                    orderId,
                    ex.getMessage());
            throw new OrderAlreadyAllocatedException(orderId);
        }
        log.info(
                "event=order_status_updated orderId={} status={}",
                orderId,
                OrderStatus.ALLOCATED);

        log.info(
                "event=allocation_persisted allocationId={} orderId={} itemCount={} optimizationScore={} strategy={}",
                savedAllocation.getId(),
                orderId,
                savedAllocation.getAllocationItems().size(),
                savedAllocation.getOptimizationScore(),
                optimizationResult.getStrategyName());
        return allocationMapper.toResponse(savedAllocation);
    }

    private List<AllocationLine> flattenAllocationLines(OptimizationResult optimizationResult) {
        List<AllocationLine> allocationLines = new ArrayList<>();
        for (WarehouseCandidate candidate : optimizationResult.getWarehouseCandidates()) {
            candidate.getAllocatedQuantitiesByProductId().forEach((productId, quantity) -> {
                if (quantity > 0) {
                    allocationLines.add(new AllocationLine(candidate.getWarehouseId(), productId, quantity));
                }
            });
        }
        return allocationLines;
    }

    private Map<InventoryKey, Integer> aggregateQuantities(List<AllocationLine> allocationLines) {
        Map<InventoryKey, Integer> quantitiesByInventoryKey = new HashMap<>();
        for (AllocationLine line : allocationLines) {
            InventoryKey key = new InventoryKey(line.warehouseId(), line.productId());
            quantitiesByInventoryKey.merge(key, line.quantity(), Integer::sum);
        }
        return quantitiesByInventoryKey;
    }

    private void validateAllocationQuantities(Map<InventoryKey, Integer> quantitiesByInventoryKey) {
        for (Map.Entry<InventoryKey, Integer> entry : quantitiesByInventoryKey.entrySet()) {
            Integer quantity = entry.getValue();
            if (quantity == null || quantity <= 0) {
                InventoryKey key = entry.getKey();
                throw new BadRequestException(String.format(
                        "Allocation quantity must be positive for warehouse %s and product %s",
                        key.warehouseId(),
                        key.productId()));
            }
        }
    }

    private Map<InventoryKey, Inventory> loadInventories(Map<InventoryKey, Integer> quantitiesByInventoryKey) {
        Map<InventoryKey, Inventory> inventories = new HashMap<>();
        for (InventoryKey key : quantitiesByInventoryKey.keySet()) {
            Inventory inventory = inventoryRepository
                    .findByWarehouse_IdAndProduct_Id(key.warehouseId(), key.productId())
                    .orElseThrow(() -> new InsufficientInventoryException(key.warehouseId(), key.productId()));
            inventories.put(key, inventory);
        }
        return inventories;
    }

    private void validateInventoryAvailability(
            Map<InventoryKey, Integer> quantitiesByInventoryKey, Map<InventoryKey, Inventory> inventories) {
        for (Map.Entry<InventoryKey, Integer> entry : quantitiesByInventoryKey.entrySet()) {
            Inventory inventory = inventories.get(entry.getKey());
            inventory.validateAvailableForReservation(entry.getValue());
        }
    }

    private void applyInventoryReservations(
            Map<InventoryKey, Integer> quantitiesByInventoryKey, Map<InventoryKey, Inventory> inventories) {
        for (Map.Entry<InventoryKey, Integer> entry : quantitiesByInventoryKey.entrySet()) {
            Inventory inventory = inventories.get(entry.getKey());
            int quantity = entry.getValue();
            inventory.reserve(quantity);
            log.info(
                    "event=inventory_reserved inventoryId={} warehouseId={} productId={} quantity={} availableQuantity={} reservedQuantity={}",
                    inventory.getId(),
                    inventory.getWarehouse().getId(),
                    inventory.getProduct().getId(),
                    quantity,
                    inventory.getAvailableQuantity(),
                    inventory.getReservedQuantity());
        }
    }

    private Allocation buildAllocation(
            CustomerOrder order,
            OptimizationResult optimizationResult,
            Map<InventoryKey, Integer> quantitiesByInventoryKey,
            Map<InventoryKey, Inventory> inventories) {
        Allocation allocation = Allocation.builder()
                .order(order)
                .optimizationScore(optimizationResult.getOptimizationScore())
                .shippingCost(optimizationResult.getTotalShippingCost())
                .estimatedDeliveryHours(optimizationResult.getEstimatedDeliveryHours())
                .strategyName(optimizationResult.getStrategyName())
                .scoreBreakdown(allocationSnapshotMapper.toPlanScoreBreakdownSnapshot(
                        optimizationResult.getScoreBreakdown()))
                .reasoning(allocationSnapshotMapper.toReasoningSnapshots(optimizationResult.getReasoning()))
                .warehouseSnapshots(allocationSnapshotMapper.toWarehouseSnapshots(
                        optimizationResult.getWarehouseCandidates()))
                .build();

        for (Map.Entry<InventoryKey, Integer> entry : quantitiesByInventoryKey.entrySet()) {
            Inventory inventory = inventories.get(entry.getKey());
            AllocationItem allocationItem = AllocationItem.builder()
                    .allocation(allocation)
                    .warehouse(inventory.getWarehouse())
                    .product(inventory.getProduct())
                    .quantity(entry.getValue())
                    .build();
            allocation.getAllocationItems().add(allocationItem);
        }
        return allocation;
    }

    private void updateWarehouseLoads(List<AllocationLine> allocationLines) {
        Map<UUID, Integer> loadIncreaseByWarehouse = new HashMap<>();
        for (AllocationLine line : allocationLines) {
            loadIncreaseByWarehouse.merge(line.warehouseId(), line.quantity(), Integer::sum);
        }

        for (Map.Entry<UUID, Integer> entry : loadIncreaseByWarehouse.entrySet()) {
            Warehouse warehouse = warehouseRepository
                    .findById(entry.getKey())
                    .orElseThrow(() -> new ResourceNotFoundException("Warehouse", entry.getKey()));
            warehouse.increaseLoad(entry.getValue());
        }
    }

    private CustomerOrder findCustomerOrderOrThrow(UUID orderId) {
        return customerOrderRepository
                .findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerOrder", orderId));
    }

    private record AllocationLine(UUID warehouseId, UUID productId, int quantity) {}

    private record InventoryKey(UUID warehouseId, UUID productId) {}
}
