package com.aryan.fulfillx.algorithm.model;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Decomposed optimization score for a warehouse candidate.
 *
 * <p>Each component captures one scoring dimension so callers can explain why a warehouse was
 * preferred or rejected. Future strategies can extend the breakdown with additional dimensions
 * without changing the core allocation contract.
 */
public final class ScoreBreakdown {

    private final BigDecimal distanceScore;
    private final BigDecimal shippingCostScore;
    private final BigDecimal inventoryScore;
    private final BigDecimal warehouseLoadScore;
    private final BigDecimal totalScore;

    /**
     * Creates a score breakdown for a warehouse candidate.
     *
     * @param distanceScore weighted score derived from geographic proximity
     * @param shippingCostScore weighted score derived from shipping cost
     * @param inventoryScore weighted score derived from stock availability
     * @param warehouseLoadScore weighted score derived from warehouse capacity utilization
     * @param totalScore aggregated score used for ranking candidates
     */
    public ScoreBreakdown(
            BigDecimal distanceScore,
            BigDecimal shippingCostScore,
            BigDecimal inventoryScore,
            BigDecimal warehouseLoadScore,
            BigDecimal totalScore) {
        this.distanceScore = Objects.requireNonNull(distanceScore, "distanceScore must not be null");
        this.shippingCostScore = Objects.requireNonNull(shippingCostScore, "shippingCostScore must not be null");
        this.inventoryScore = Objects.requireNonNull(inventoryScore, "inventoryScore must not be null");
        this.warehouseLoadScore = Objects.requireNonNull(warehouseLoadScore, "warehouseLoadScore must not be null");
        this.totalScore = Objects.requireNonNull(totalScore, "totalScore must not be null");
    }

    public BigDecimal getDistanceScore() {
        return distanceScore;
    }

    public BigDecimal getShippingCostScore() {
        return shippingCostScore;
    }

    public BigDecimal getInventoryScore() {
        return inventoryScore;
    }

    public BigDecimal getWarehouseLoadScore() {
        return warehouseLoadScore;
    }

    public BigDecimal getTotalScore() {
        return totalScore;
    }
}
