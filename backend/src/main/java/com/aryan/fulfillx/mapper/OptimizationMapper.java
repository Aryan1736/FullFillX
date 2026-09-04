package com.aryan.fulfillx.mapper;

import com.aryan.fulfillx.algorithm.model.OptimizationReasoning;
import com.aryan.fulfillx.algorithm.model.OptimizationRequest;
import com.aryan.fulfillx.algorithm.model.OptimizationResult;
import com.aryan.fulfillx.algorithm.model.PlanScoreBreakdown;
import com.aryan.fulfillx.algorithm.model.ScoreBreakdown;
import com.aryan.fulfillx.algorithm.model.WarehouseCandidate;
import com.aryan.fulfillx.dto.request.OptimizationOrderLineDto;
import com.aryan.fulfillx.dto.request.OptimizationRequestDto;
import com.aryan.fulfillx.dto.request.OptimizationWarehouseAvailabilityDto;
import com.aryan.fulfillx.dto.request.OptimizationWeightsDto;
import com.aryan.fulfillx.dto.response.OptimizationReasoningDto;
import com.aryan.fulfillx.dto.response.OptimizationResponseDto;
import com.aryan.fulfillx.dto.response.PlanScoreBreakdownDto;
import com.aryan.fulfillx.dto.response.ScoreBreakdownDto;
import com.aryan.fulfillx.dto.response.WarehouseCandidateDto;
import com.aryan.fulfillx.algorithm.model.ReasoningDecision;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OptimizationMapper {

    OptimizationRequest toRequest(OptimizationRequestDto dto);

    OptimizationResponseDto toResponse(OptimizationResult result);

    OptimizationRequest.OrderLine toOrderLine(OptimizationOrderLineDto dto);

    OptimizationRequest.WarehouseAvailability toWarehouseAvailability(OptimizationWarehouseAvailabilityDto dto);

    OptimizationRequest.OptimizationWeights toOptimizationWeights(OptimizationWeightsDto dto);

    WarehouseCandidateDto toWarehouseCandidateDto(WarehouseCandidate candidate);

    ScoreBreakdownDto toScoreBreakdownDto(ScoreBreakdown scoreBreakdown);

    PlanScoreBreakdownDto toPlanScoreBreakdownDto(PlanScoreBreakdown scoreBreakdown);

    OptimizationReasoningDto toOptimizationReasoningDto(OptimizationReasoning reasoning);

    default OptimizationResult toResult(OptimizationResponseDto dto) {
        if (dto == null) {
            return null;
        }
        String strategyName = dto.getStrategyName() != null ? dto.getStrategyName() : "WEIGHTED_GREEDY";
        List<WarehouseCandidate> candidates = dto.getWarehouseCandidates() != null
                ? dto.getWarehouseCandidates().stream().map(this::toWarehouseCandidate).toList()
                : List.of();
        BigDecimal optimizationScore = dto.getOptimizationScore() != null ? dto.getOptimizationScore() : BigDecimal.ZERO;
        BigDecimal totalShippingCost = dto.getTotalShippingCost() != null ? dto.getTotalShippingCost() : BigDecimal.ZERO;
        int estimatedDeliveryHours = dto.getEstimatedDeliveryHours() != null ? dto.getEstimatedDeliveryHours() : 0;
        PlanScoreBreakdown scoreBreakdown = toPlanScoreBreakdown(dto.getScoreBreakdown());
        List<OptimizationReasoning> reasoning = dto.getReasoning() != null
                ? dto.getReasoning().stream().map(this::toOptimizationReasoning).toList()
                : List.of();
        List<UUID> selectedWarehouses = dto.getSelectedWarehouses() != null
                ? dto.getSelectedWarehouses()
                : candidates.stream().map(WarehouseCandidate::getWarehouseId).distinct().toList();
        return new OptimizationResult(
                strategyName,
                candidates,
                optimizationScore,
                totalShippingCost,
                estimatedDeliveryHours,
                scoreBreakdown,
                reasoning,
                selectedWarehouses,
                dto.getEstimatedSavings());
    }

    default WarehouseCandidate toWarehouseCandidate(WarehouseCandidateDto dto) {
        if (dto == null) {
            return null;
        }
        UUID warehouseId = dto.getWarehouseId();
        String warehouseName = dto.getWarehouseName() != null ? dto.getWarehouseName() : "Warehouse";
        Map<UUID, Integer> allocatedQuantities = dto.getAllocatedQuantitiesByProductId() != null
                ? dto.getAllocatedQuantitiesByProductId()
                : Map.of();
        BigDecimal shippingCost = dto.getShippingCost() != null ? dto.getShippingCost() : BigDecimal.ZERO;
        int estimatedDeliveryHours = dto.getEstimatedDeliveryHours() != null ? dto.getEstimatedDeliveryHours() : 0;
        ScoreBreakdown scoreBreakdown = toScoreBreakdown(dto.getScoreBreakdown());
        return new WarehouseCandidate(
                warehouseId,
                warehouseName,
                allocatedQuantities,
                shippingCost,
                estimatedDeliveryHours,
                scoreBreakdown);
    }

    default ScoreBreakdown toScoreBreakdown(ScoreBreakdownDto dto) {
        if (dto == null) {
            return new ScoreBreakdown(
                    BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
        }
        return new ScoreBreakdown(
                dto.getDistanceScore() != null ? dto.getDistanceScore() : BigDecimal.ZERO,
                dto.getShippingCostScore() != null ? dto.getShippingCostScore() : BigDecimal.ZERO,
                dto.getInventoryScore() != null ? dto.getInventoryScore() : BigDecimal.ZERO,
                dto.getWarehouseLoadScore() != null ? dto.getWarehouseLoadScore() : BigDecimal.ZERO,
                dto.getTotalScore() != null ? dto.getTotalScore() : BigDecimal.ZERO);
    }

    default PlanScoreBreakdown toPlanScoreBreakdown(PlanScoreBreakdownDto dto) {
        if (dto == null) {
            return new PlanScoreBreakdown(
                    BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
        }
        return new PlanScoreBreakdown(
                dto.getShippingCostScore() != null ? dto.getShippingCostScore() : BigDecimal.ZERO,
                dto.getEtaScore() != null ? dto.getEtaScore() : BigDecimal.ZERO,
                dto.getWarehouseLoadScore() != null ? dto.getWarehouseLoadScore() : BigDecimal.ZERO,
                dto.getSplitShipmentPenalty() != null ? dto.getSplitShipmentPenalty() : BigDecimal.ZERO,
                dto.getTotalScore() != null ? dto.getTotalScore() : BigDecimal.ZERO);
    }

    default OptimizationReasoning toOptimizationReasoning(OptimizationReasoningDto dto) {
        if (dto == null) {
            return null;
        }
        return new OptimizationReasoning(
                dto.getDecision() != null ? dto.getDecision() : ReasoningDecision.INFO,
                dto.getWarehouseId(),
                dto.getWarehouseName(),
                dto.getProductId(),
                dto.getMessage() != null ? dto.getMessage() : "");
    }
}
