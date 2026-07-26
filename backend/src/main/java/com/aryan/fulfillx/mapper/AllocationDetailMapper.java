package com.aryan.fulfillx.mapper;

import com.aryan.fulfillx.dto.response.AllocatedProductDetailResponse;
import com.aryan.fulfillx.dto.response.AllocatedWarehouseDetailResponse;
import com.aryan.fulfillx.dto.response.AllocationDetailResponse;
import com.aryan.fulfillx.dto.response.OptimizationReasoningDto;
import com.aryan.fulfillx.dto.response.PlanScoreBreakdownDto;
import com.aryan.fulfillx.dto.response.ScoreBreakdownDto;
import com.aryan.fulfillx.entity.Allocation;
import com.aryan.fulfillx.entity.AllocationItem;
import com.aryan.fulfillx.entity.snapshot.AllocationPlanScoreBreakdown;
import com.aryan.fulfillx.entity.snapshot.AllocationReasoningEntry;
import com.aryan.fulfillx.entity.snapshot.AllocationScoreBreakdown;
import com.aryan.fulfillx.entity.snapshot.AllocationWarehouseSnapshot;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AllocationDetailMapper {

    private final WarehouseMapper warehouseMapper;
    private final ProductMapper productMapper;

    public AllocationDetailResponse toDetailResponse(Allocation allocation) {
        Map<UUID, AllocatedWarehouseDetailResponse> warehousesById = buildWarehouseDetails(allocation);
        List<AllocatedProductDetailResponse> products = aggregateProducts(allocation.getAllocationItems());

        return AllocationDetailResponse.builder()
                .id(allocation.getId())
                .orderId(allocation.getOrder().getId())
                .strategyName(allocation.getStrategyName())
                .score(allocation.getOptimizationScore())
                .scoreBreakdown(toPlanScoreBreakdownDto(allocation.getScoreBreakdown()))
                .shippingCost(allocation.getShippingCost())
                .eta(allocation.getEstimatedDeliveryHours())
                .reasoning(toReasoningDtos(allocation.getReasoning()))
                .warehouses(new ArrayList<>(warehousesById.values()))
                .products(products)
                .createdAt(allocation.getCreatedAt())
                .updatedAt(allocation.getUpdatedAt())
                .build();
    }

    private Map<UUID, AllocatedWarehouseDetailResponse> buildWarehouseDetails(Allocation allocation) {
        Map<UUID, AllocatedWarehouseDetailResponse> warehousesById = new LinkedHashMap<>();

        if (allocation.getWarehouseSnapshots() != null) {
            for (AllocationWarehouseSnapshot snapshot : allocation.getWarehouseSnapshots()) {
                warehousesById.put(
                        snapshot.getWarehouseId(),
                        AllocatedWarehouseDetailResponse.builder()
                                .shippingCost(snapshot.getShippingCost())
                                .eta(snapshot.getEstimatedDeliveryHours())
                                .scoreBreakdown(toScoreBreakdownDto(snapshot.getScoreBreakdown()))
                                .products(new ArrayList<>())
                                .build());
            }
        }

        for (AllocationItem item : allocation.getAllocationItems()) {
            UUID warehouseId = item.getWarehouse().getId();
            AllocatedWarehouseDetailResponse warehouseDetail = warehousesById.computeIfAbsent(
                    warehouseId,
                    ignored -> AllocatedWarehouseDetailResponse.builder()
                            .products(new ArrayList<>())
                            .build());
            warehouseDetail.setWarehouse(warehouseMapper.toResponse(item.getWarehouse()));
            warehouseDetail.getProducts().add(AllocatedProductDetailResponse.builder()
                    .product(productMapper.toResponse(item.getProduct()))
                    .quantity(item.getQuantity())
                    .build());
        }

        return warehousesById;
    }

    private List<AllocatedProductDetailResponse> aggregateProducts(List<AllocationItem> allocationItems) {
        Map<UUID, AllocatedProductDetailResponse> productsById = new LinkedHashMap<>();

        for (AllocationItem item : allocationItems) {
            UUID productId = item.getProduct().getId();
            AllocatedProductDetailResponse existing = productsById.get(productId);
            if (existing == null) {
                productsById.put(
                        productId,
                        AllocatedProductDetailResponse.builder()
                                .product(productMapper.toResponse(item.getProduct()))
                                .quantity(item.getQuantity())
                                .build());
                continue;
            }
            existing.setQuantity(existing.getQuantity() + item.getQuantity());
        }

        return new ArrayList<>(productsById.values());
    }

    private PlanScoreBreakdownDto toPlanScoreBreakdownDto(AllocationPlanScoreBreakdown scoreBreakdown) {
        if (scoreBreakdown == null) {
            return null;
        }
        return PlanScoreBreakdownDto.builder()
                .shippingCostScore(scoreBreakdown.getShippingCostScore())
                .etaScore(scoreBreakdown.getEtaScore())
                .warehouseLoadScore(scoreBreakdown.getWarehouseLoadScore())
                .splitShipmentPenalty(scoreBreakdown.getSplitShipmentPenalty())
                .totalScore(scoreBreakdown.getTotalScore())
                .build();
    }

    private ScoreBreakdownDto toScoreBreakdownDto(AllocationScoreBreakdown scoreBreakdown) {
        if (scoreBreakdown == null) {
            return null;
        }
        return ScoreBreakdownDto.builder()
                .distanceScore(scoreBreakdown.getDistanceScore())
                .shippingCostScore(scoreBreakdown.getShippingCostScore())
                .inventoryScore(scoreBreakdown.getInventoryScore())
                .warehouseLoadScore(scoreBreakdown.getWarehouseLoadScore())
                .totalScore(scoreBreakdown.getTotalScore())
                .build();
    }

    private List<OptimizationReasoningDto> toReasoningDtos(List<AllocationReasoningEntry> reasoning) {
        if (reasoning == null) {
            return List.of();
        }
        return reasoning.stream()
                .map(entry -> OptimizationReasoningDto.builder()
                        .decision(entry.getDecision())
                        .warehouseId(entry.getWarehouseId())
                        .warehouseName(entry.getWarehouseName())
                        .productId(entry.getProductId())
                        .message(entry.getMessage())
                        .build())
                .toList();
    }
}
