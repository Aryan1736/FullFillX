package com.aryan.fulfillx.algorithm.calculator;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

/**
 * Default shipping cost calculator used by greedy optimization strategies.
 *
 * <p>Applies {@link ShippingCostParameters} using {@code baseCost + (distance × costPerKm) +
 * (totalWeight × costPerKg)}.
 */
public final class DefaultShippingCostCalculator implements ShippingCostCalculator {

    private static final int COST_SCALE = 4;

    private final ShippingCostParameters parameters;

    /**
     * Creates a shipping cost calculator with the given parameters.
     *
     * @param parameters shipping cost configuration
     */
    public DefaultShippingCostCalculator(ShippingCostParameters parameters) {
        this.parameters = Objects.requireNonNull(parameters, "parameters must not be null");
    }

    /**
     * Creates a shipping cost calculator using {@link ShippingCostParameters#defaults()}.
     */
    public DefaultShippingCostCalculator() {
        this(ShippingCostParameters.defaults());
    }

    @Override
    public BigDecimal calculateShippingCost(double distanceKilometers, int itemCount) {
        if (distanceKilometers < 0.0) {
            throw new IllegalArgumentException("distanceKilometers must not be negative");
        }
        if (itemCount < 0) {
            throw new IllegalArgumentException("itemCount must not be negative");
        }

        BigDecimal distanceCost = BigDecimal.valueOf(distanceKilometers)
                .multiply(parameters.getCostPerKm());
        BigDecimal totalWeight = parameters.getWeightPerItem().multiply(BigDecimal.valueOf(itemCount));
        BigDecimal weightCost = totalWeight.multiply(parameters.getCostPerKg());

        return parameters.getBaseCost()
                .add(distanceCost)
                .add(weightCost)
                .setScale(COST_SCALE, RoundingMode.HALF_UP);
    }
}
