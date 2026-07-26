package com.aryan.fulfillx.algorithm.calculator;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Configuration for {@link DefaultShippingCostCalculator}.
 *
 * <p>Shipping cost is computed as {@code baseCost + (distance × costPerKm) + (totalWeight ×
 * costPerKg)}. Because {@link ShippingCostCalculator} receives item counts rather than product
 * weights, {@code weightPerItem} is used to derive total shipment weight.
 */
public final class ShippingCostParameters {

    private final BigDecimal baseCost;
    private final BigDecimal costPerKm;
    private final BigDecimal costPerKg;
    private final BigDecimal weightPerItem;

    /**
     * Creates shipping cost parameters.
     *
     * @param baseCost fixed cost applied to every shipment leg
     * @param costPerKm variable cost per kilometer traveled
     * @param costPerKg variable cost per kilogram shipped
     * @param weightPerItem assumed weight of each shipped item when deriving total weight
     */
    public ShippingCostParameters(
            BigDecimal baseCost,
            BigDecimal costPerKm,
            BigDecimal costPerKg,
            BigDecimal weightPerItem) {
        this.baseCost = Objects.requireNonNull(baseCost, "baseCost must not be null");
        this.costPerKm = Objects.requireNonNull(costPerKm, "costPerKm must not be null");
        this.costPerKg = Objects.requireNonNull(costPerKg, "costPerKg must not be null");
        this.weightPerItem = Objects.requireNonNull(weightPerItem, "weightPerItem must not be null");
    }

    /**
     * Returns default shipping cost parameters.
     *
     * @return default shipping cost configuration
     */
    public static ShippingCostParameters defaults() {
        return new ShippingCostParameters(
                BigDecimal.valueOf(5),
                BigDecimal.valueOf(0.5),
                BigDecimal.valueOf(2),
                BigDecimal.ONE);
    }

    public BigDecimal getBaseCost() {
        return baseCost;
    }

    public BigDecimal getCostPerKm() {
        return costPerKm;
    }

    public BigDecimal getCostPerKg() {
        return costPerKg;
    }

    public BigDecimal getWeightPerItem() {
        return weightPerItem;
    }
}
