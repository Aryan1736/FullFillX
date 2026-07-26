package com.aryan.fulfillx.algorithm.calculator;

import java.math.BigDecimal;

/**
 * Estimates monetary shipping cost for a warehouse fulfillment leg.
 *
 * <p>Cost models may vary by strategy. Weighted greedy strategies typically score individual
 * warehouse legs, while min-cost flow strategies may aggregate edge costs across a fulfillment
 * network before producing a total shipment cost.
 */
public interface ShippingCostCalculator {

    /**
     * Calculates shipping cost for a fulfillment leg.
     *
     * @param distanceKilometers distance between warehouse and destination in kilometers
     * @param itemCount total number of items shipped on this leg
     * @return shipping cost in the application's monetary unit
     */
    BigDecimal calculateShippingCost(double distanceKilometers, int itemCount);
}
