package com.aryan.fulfillx.algorithm.calculator;

/**
 * Estimates delivery time for a warehouse fulfillment leg.
 *
 * <p>ETA estimates feed both customer-facing allocation results and strategy scoring. Graph-based
 * strategies may derive ETA from cumulative edge travel time rather than a single origin-to-
 * destination calculation.
 */
public interface EtaCalculator {

    /**
     * Calculates estimated delivery time for a fulfillment leg.
     *
     * @param distanceKilometers distance between warehouse and destination in kilometers
     * @return estimated delivery time in whole hours
     */
    int calculateEtaHours(double distanceKilometers);
}
