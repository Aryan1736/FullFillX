package com.aryan.fulfillx.service.impl;

import com.aryan.fulfillx.constant.InventoryConstants;
import com.aryan.fulfillx.dto.response.AnalyticsResponseDto;
import com.aryan.fulfillx.dto.response.InventoryStatusItemDto;
import com.aryan.fulfillx.dto.response.InventoryStatusResponseDto;
import com.aryan.fulfillx.dto.response.ShippingCostAnalysisResponseDto;
import com.aryan.fulfillx.dto.response.WarehouseUtilizationItemDto;
import com.aryan.fulfillx.dto.response.WarehouseUtilizationResponseDto;
import com.aryan.fulfillx.entity.Inventory;
import com.aryan.fulfillx.entity.Warehouse;
import com.aryan.fulfillx.repository.AllocationRepository;
import com.aryan.fulfillx.repository.CustomerOrderRepository;
import com.aryan.fulfillx.repository.InventoryRepository;
import com.aryan.fulfillx.repository.ProductRepository;
import com.aryan.fulfillx.repository.WarehouseRepository;
import com.aryan.fulfillx.service.AnalyticsService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsServiceImpl implements AnalyticsService {

    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final AllocationRepository allocationRepository;

    @Override
    @Transactional(readOnly = true)
    public AnalyticsResponseDto getAnalytics() {
        log.debug("Fetching analytics summary");

        return AnalyticsResponseDto.builder()
                .totalOrders(customerOrderRepository.count())
                .totalWarehouses(warehouseRepository.count())
                .totalProducts(productRepository.count())
                .inventoryUtilization(round(inventoryRepository.findInventoryUtilizationPercentage(), 2))
                .warehouseUtilization(round(warehouseRepository.findAverageUtilizationPercentage(), 2))
                .averageShippingCost(allocationRepository.findAverageShippingCost())
                .averageETA(round(allocationRepository.findAverageEstimatedDeliveryHours(), 2))
                .totalSplitShipments(allocationRepository.countSplitShipments())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public WarehouseUtilizationResponseDto getWarehouseUtilization() {
        log.debug("Fetching warehouse utilization");

        List<WarehouseUtilizationItemDto> warehouses = warehouseRepository.findAll().stream()
                .map(this::toWarehouseUtilizationItem)
                .toList();

        double averageUtilization = warehouses.stream()
                .mapToDouble(WarehouseUtilizationItemDto::getUtilizationPercentage)
                .average()
                .orElse(0.0);

        return WarehouseUtilizationResponseDto.builder()
                .averageUtilizationPercentage(round(averageUtilization, 2))
                .warehouses(warehouses)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryStatusResponseDto getInventoryStatus() {
        log.debug("Fetching inventory status");

        List<Inventory> inventories = inventoryRepository.findAllWithWarehouseAndProduct();

        long totalAvailable = 0;
        long totalReserved = 0;
        long outOfStockCount = 0;
        long lowStockCount = 0;

        List<InventoryStatusItemDto> items = inventories.stream()
                .map(inventory -> {
                    int available = inventory.getAvailableQuantity();
                    int reserved = inventory.getReservedQuantity();
                    int total = available + reserved;
                    String status = resolveInventoryStatus(available);

                    return InventoryStatusItemDto.builder()
                            .warehouseId(inventory.getWarehouse().getId())
                            .warehouseName(inventory.getWarehouse().getName())
                            .productId(inventory.getProduct().getId())
                            .productName(inventory.getProduct().getName())
                            .availableQuantity(available)
                            .reservedQuantity(reserved)
                            .totalQuantity(total)
                            .status(status)
                            .build();
                })
                .toList();

        for (Inventory inventory : inventories) {
            int available = inventory.getAvailableQuantity();
            int reserved = inventory.getReservedQuantity();
            totalAvailable += available;
            totalReserved += reserved;

            if (available == 0) {
                outOfStockCount++;
            } else if (available < InventoryConstants.LOW_STOCK_THRESHOLD) {
                lowStockCount++;
            }
        }

        return InventoryStatusResponseDto.builder()
                .totalAvailableQuantity(totalAvailable)
                .totalReservedQuantity(totalReserved)
                .totalQuantity(totalAvailable + totalReserved)
                .inventoryRecordCount((long) inventories.size())
                .outOfStockCount(outOfStockCount)
                .lowStockCount(lowStockCount)
                .items(items)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ShippingCostAnalysisResponseDto getShippingCostAnalysis() {
        log.debug("Fetching shipping cost analysis");

        return ShippingCostAnalysisResponseDto.builder()
                .totalAllocations(allocationRepository.count())
                .averageShippingCost(allocationRepository.findAverageShippingCost())
                .minimumShippingCost(allocationRepository.findMinimumShippingCost())
                .maximumShippingCost(allocationRepository.findMaximumShippingCost())
                .totalShippingCost(allocationRepository.findTotalShippingCost())
                .averageEstimatedDeliveryHours(allocationRepository.findAverageEstimatedDeliveryHours())
                .build();
    }

    private WarehouseUtilizationItemDto toWarehouseUtilizationItem(Warehouse warehouse) {
        double utilization = warehouse.getCapacity() == 0
                ? 0.0
                : (warehouse.getCurrentLoad() * 100.0) / warehouse.getCapacity();

        return WarehouseUtilizationItemDto.builder()
                .warehouseId(warehouse.getId())
                .warehouseName(warehouse.getName())
                .city(warehouse.getCity())
                .capacity(warehouse.getCapacity())
                .currentLoad(warehouse.getCurrentLoad())
                .utilizationPercentage(round(utilization, 2))
                .build();
    }

    private String resolveInventoryStatus(int availableQuantity) {
        if (availableQuantity == 0) {
            return "OUT_OF_STOCK";
        }
        if (availableQuantity < InventoryConstants.LOW_STOCK_THRESHOLD) {
            return "LOW_STOCK";
        }
        return "IN_STOCK";
    }

    private double round(double value, int scale) {
        return BigDecimal.valueOf(value)
                .setScale(scale, RoundingMode.HALF_UP)
                .doubleValue();
    }
}
