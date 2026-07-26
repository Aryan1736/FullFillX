package com.aryan.fulfillx.algorithm.calculator;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Central configuration for optimization scoring weights.
 *
 * <p>All weighted scoring strategies should read weights from this type so penalty factors can be
 * tuned from a single place.
 */
public final class ScoreWeights {

    private final BigDecimal shippingWeight;
    private final BigDecimal etaWeight;
    private final BigDecimal loadWeight;
    private final BigDecimal splitShipmentPenalty;

    /**
     * Creates score weights for weighted optimization strategies.
     *
     * @param shippingWeight multiplier applied to shipping cost
     * @param etaWeight multiplier applied to delivery time estimates
     * @param loadWeight multiplier applied to warehouse load penalties
     * @param splitShipmentPenalty penalty applied for each additional warehouse in a split shipment
     */
    public ScoreWeights(
            BigDecimal shippingWeight,
            BigDecimal etaWeight,
            BigDecimal loadWeight,
            BigDecimal splitShipmentPenalty) {
        this.shippingWeight = Objects.requireNonNull(shippingWeight, "shippingWeight must not be null");
        this.etaWeight = Objects.requireNonNull(etaWeight, "etaWeight must not be null");
        this.loadWeight = Objects.requireNonNull(loadWeight, "loadWeight must not be null");
        this.splitShipmentPenalty = Objects.requireNonNull(splitShipmentPenalty, "splitShipmentPenalty must not be null");
    }

    public BigDecimal getShippingWeight() {
        return shippingWeight;
    }

    public BigDecimal getEtaWeight() {
        return etaWeight;
    }

    public BigDecimal getLoadWeight() {
        return loadWeight;
    }

    public BigDecimal getSplitShipmentPenalty() {
        return splitShipmentPenalty;
    }
}
