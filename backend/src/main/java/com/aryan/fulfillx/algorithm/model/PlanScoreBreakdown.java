package com.aryan.fulfillx.algorithm.model;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Decomposed optimization score for an entire fulfillment plan.
 *
 * <p>Captures plan-level scoring dimensions such as aggregate shipping cost, delivery time, load,
 * and split-shipment penalties. Distinct from {@link ScoreBreakdown}, which describes a single
 * warehouse leg.
 */
public final class PlanScoreBreakdown {

    private final BigDecimal shippingCostScore;
    private final BigDecimal etaScore;
    private final BigDecimal warehouseLoadScore;
    private final BigDecimal splitShipmentPenalty;
    private final BigDecimal totalScore;

    /**
     * Creates a plan-level score breakdown.
     *
     * @param shippingCostScore weighted aggregate shipping cost score
     * @param etaScore weighted longest delivery time score
     * @param warehouseLoadScore weighted aggregate warehouse load score
     * @param splitShipmentPenalty penalty applied for using multiple warehouses
     * @param totalScore aggregated plan score used for ranking
     */
    public PlanScoreBreakdown(
            BigDecimal shippingCostScore,
            BigDecimal etaScore,
            BigDecimal warehouseLoadScore,
            BigDecimal splitShipmentPenalty,
            BigDecimal totalScore) {
        this.shippingCostScore = Objects.requireNonNull(shippingCostScore, "shippingCostScore must not be null");
        this.etaScore = Objects.requireNonNull(etaScore, "etaScore must not be null");
        this.warehouseLoadScore = Objects.requireNonNull(warehouseLoadScore, "warehouseLoadScore must not be null");
        this.splitShipmentPenalty = Objects.requireNonNull(splitShipmentPenalty, "splitShipmentPenalty must not be null");
        this.totalScore = Objects.requireNonNull(totalScore, "totalScore must not be null");
    }

    public BigDecimal getShippingCostScore() {
        return shippingCostScore;
    }

    public BigDecimal getEtaScore() {
        return etaScore;
    }

    public BigDecimal getWarehouseLoadScore() {
        return warehouseLoadScore;
    }

    public BigDecimal getSplitShipmentPenalty() {
        return splitShipmentPenalty;
    }

    public BigDecimal getTotalScore() {
        return totalScore;
    }
}
