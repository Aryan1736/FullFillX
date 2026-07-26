package com.aryan.fulfillx.algorithm.model;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Outcome of an optimization run.
 *
 * <p>Aggregates ranked warehouse candidates and roll-up metrics that can be persisted on an
 * {@code Allocation} without exposing algorithm internals to the service layer.
 */
public final class OptimizationResult {

    private final String strategyName;
    private final List<WarehouseCandidate> warehouseCandidates;
    private final BigDecimal optimizationScore;
    private final BigDecimal totalShippingCost;
    private final int estimatedDeliveryHours;

    /**
     * Creates an optimization result.
     *
     * @param strategyName name of the strategy that produced this result
     * @param warehouseCandidates ranked warehouse proposals; may be empty when no feasible allocation exists
     * @param optimizationScore aggregate optimization score for the selected fulfillment plan
     * @param totalShippingCost total shipping cost across all selected warehouse legs
     * @param estimatedDeliveryHours longest estimated delivery time across selected warehouse legs
     */
    public OptimizationResult(
            String strategyName,
            List<WarehouseCandidate> warehouseCandidates,
            BigDecimal optimizationScore,
            BigDecimal totalShippingCost,
            int estimatedDeliveryHours) {
        this.strategyName = Objects.requireNonNull(strategyName, "strategyName must not be null");
        this.warehouseCandidates = List.copyOf(
                Objects.requireNonNull(warehouseCandidates, "warehouseCandidates must not be null"));
        this.optimizationScore = Objects.requireNonNull(optimizationScore, "optimizationScore must not be null");
        this.totalShippingCost = Objects.requireNonNull(totalShippingCost, "totalShippingCost must not be null");
        this.estimatedDeliveryHours = estimatedDeliveryHours;
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
}
