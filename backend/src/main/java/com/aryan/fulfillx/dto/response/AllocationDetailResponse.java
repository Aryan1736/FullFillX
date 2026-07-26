package com.aryan.fulfillx.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllocationDetailResponse {

    private UUID id;
    private UUID orderId;
    private String strategyName;
    private BigDecimal score;
    private PlanScoreBreakdownDto scoreBreakdown;
    private BigDecimal shippingCost;
    private Integer eta;
    private List<OptimizationReasoningDto> reasoning;
    private List<AllocatedWarehouseDetailResponse> warehouses;
    private List<AllocatedProductDetailResponse> products;
    private Instant createdAt;
    private Instant updatedAt;
}
