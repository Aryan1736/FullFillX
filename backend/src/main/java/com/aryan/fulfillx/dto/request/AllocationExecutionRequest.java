package com.aryan.fulfillx.dto.request;

import com.aryan.fulfillx.config.OpenApiExamples;
import com.aryan.fulfillx.dto.response.OptimizationReasoningDto;
import com.aryan.fulfillx.dto.response.OptimizationResponseDto;
import com.aryan.fulfillx.dto.response.PlanScoreBreakdownDto;
import com.aryan.fulfillx.dto.response.WarehouseCandidateDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
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
@Schema(name = "AllocationExecutionRequest", description = "Payload for executing an optimized fulfillment allocation")
public class AllocationExecutionRequest {

    @Schema(description = "Customer order ID", example = OpenApiExamples.ORDER_ID)
    @NotNull(message = "{allocation.orderId.required}")
    private UUID orderId;

    @Schema(description = "Optimization result to execute")
    @Valid
    private OptimizationResponseDto optimizationResult;

    @Schema(description = "Optimization strategy name", example = "WEIGHTED_GREEDY")
    private String strategyName;

    @Schema(description = "Warehouse candidates with allocated quantities")
    @Valid
    private List<WarehouseCandidateDto> warehouseCandidates;

    @Schema(description = "Aggregate optimization score", example = "87.5000")
    private BigDecimal optimizationScore;

    @Schema(description = "Total shipping cost across all fulfillment legs", example = "245.75")
    private BigDecimal totalShippingCost;

    @Schema(description = "Longest estimated delivery time in hours", example = "36")
    private Integer estimatedDeliveryHours;

    @Schema(description = "Decomposed plan score")
    @Valid
    private PlanScoreBreakdownDto scoreBreakdown;

    @Schema(description = "Decision explanations")
    @Valid
    private List<OptimizationReasoningDto> reasoning;

    @Schema(description = "Selected warehouse IDs")
    private List<UUID> selectedWarehouses;

    @Schema(description = "Estimated savings versus worst evaluated plan", example = "45.00")
    private BigDecimal estimatedSavings;

    public OptimizationResponseDto resolveOptimizationResult() {
        if (optimizationResult != null) {
            return optimizationResult;
        }
        if (warehouseCandidates == null || warehouseCandidates.isEmpty()) {
            return null;
        }
        return OptimizationResponseDto.builder()
                .strategyName(strategyName != null ? strategyName : "WEIGHTED_GREEDY")
                .warehouseCandidates(warehouseCandidates)
                .optimizationScore(optimizationScore != null ? optimizationScore : BigDecimal.ZERO)
                .totalShippingCost(totalShippingCost != null ? totalShippingCost : BigDecimal.ZERO)
                .estimatedDeliveryHours(estimatedDeliveryHours != null ? estimatedDeliveryHours : 0)
                .scoreBreakdown(scoreBreakdown)
                .reasoning(reasoning != null ? reasoning : List.of())
                .selectedWarehouses(selectedWarehouses != null ? selectedWarehouses : List.of())
                .estimatedSavings(estimatedSavings)
                .build();
    }
}
