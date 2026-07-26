package com.aryan.fulfillx.algorithm.model;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * Outcome of an optimization run.
 *
 * <p>Aggregates ranked warehouse candidates, plan-level score decomposition, reasoning messages,
 * and roll-up metrics that can be persisted on an {@code Allocation} without exposing algorithm
 * internals to the service layer.
 */
public final class OptimizationResult {

    private final String strategyName;
    private final List<WarehouseCandidate> warehouseCandidates;
    private final BigDecimal optimizationScore;
    private final BigDecimal totalShippingCost;
    private final int estimatedDeliveryHours;
    private final PlanScoreBreakdown scoreBreakdown;
    private final List<OptimizationReasoning> reasoning;
    private final List<UUID> selectedWarehouses;
    private final BigDecimal estimatedSavings;

    /**
     * Creates an optimization result.
     *
     * @param strategyName name of the strategy that produced this result
     * @param warehouseCandidates ranked warehouse proposals; may be empty when no feasible allocation exists
     * @param optimizationScore aggregate optimization score for the selected fulfillment plan
     * @param totalShippingCost total shipping cost across all selected warehouse legs
     * @param estimatedDeliveryHours longest estimated delivery time across selected warehouse legs
     * @param scoreBreakdown decomposed plan score for the selected fulfillment plan
     * @param reasoning ordered explanations for allocation decisions
     * @param selectedWarehouses identifiers of warehouses included in the selected plan
     * @param estimatedSavings estimated savings versus the worst evaluated plan; may be {@code null}
     */
    public OptimizationResult(
            String strategyName,
            List<WarehouseCandidate> warehouseCandidates,
            BigDecimal optimizationScore,
            BigDecimal totalShippingCost,
            int estimatedDeliveryHours,
            PlanScoreBreakdown scoreBreakdown,
            List<OptimizationReasoning> reasoning,
            List<UUID> selectedWarehouses,
            BigDecimal estimatedSavings) {
        this.strategyName = Objects.requireNonNull(strategyName, "strategyName must not be null");
        this.warehouseCandidates = List.copyOf(
                Objects.requireNonNull(warehouseCandidates, "warehouseCandidates must not be null"));
        this.optimizationScore = Objects.requireNonNull(optimizationScore, "optimizationScore must not be null");
        this.totalShippingCost = Objects.requireNonNull(totalShippingCost, "totalShippingCost must not be null");
        this.estimatedDeliveryHours = estimatedDeliveryHours;
        this.scoreBreakdown = Objects.requireNonNull(scoreBreakdown, "scoreBreakdown must not be null");
        this.reasoning = List.copyOf(Objects.requireNonNull(reasoning, "reasoning must not be null"));
        this.selectedWarehouses = List.copyOf(
                Objects.requireNonNull(selectedWarehouses, "selectedWarehouses must not be null"));
        this.estimatedSavings = estimatedSavings;
    }

    public String getStrategyName() {
        return strategyName;
    }

    public List<WarehouseCandidate> getWarehouseCandidates() {
        return Collections.unmodifiableList(warehouseCandidates);
    }

    public BigDecimal getOptimizationScore() {
        return optimizationScore;
    }

    public BigDecimal getTotalShippingCost() {
        return totalShippingCost;
    }

    public int getEstimatedDeliveryHours() {
        return estimatedDeliveryHours;
    }

    public PlanScoreBreakdown getScoreBreakdown() {
        return scoreBreakdown;
    }

    public List<OptimizationReasoning> getReasoning() {
        return Collections.unmodifiableList(reasoning);
    }

    public List<UUID> getSelectedWarehouses() {
        return Collections.unmodifiableList(selectedWarehouses);
    }

    public BigDecimal getEstimatedSavings() {
        return estimatedSavings;
    }
}
