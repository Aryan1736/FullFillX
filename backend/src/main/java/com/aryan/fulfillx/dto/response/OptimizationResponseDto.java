package com.aryan.fulfillx.dto.response;

import java.math.BigDecimal;
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
public class OptimizationResponseDto {

    private String strategyName;
    private List<WarehouseCandidateDto> warehouseCandidates;
    private BigDecimal optimizationScore;
    private BigDecimal totalShippingCost;
    private Integer estimatedDeliveryHours;
    private PlanScoreBreakdownDto scoreBreakdown;
    private List<OptimizationReasoningDto> reasoning;
    private List<UUID> selectedWarehouses;
    private BigDecimal estimatedSavings;
}
