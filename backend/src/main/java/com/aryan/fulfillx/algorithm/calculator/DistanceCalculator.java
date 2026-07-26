package com.aryan.fulfillx.algorithm.calculator;

/**
 * Computes geographic distance between two coordinate pairs.
 *
 * <p>Implementations may use haversine, road-network, or graph-edge distance depending on the
 * active {@link com.aryan.fulfillx.algorithm.strategy.OptimizationStrategy}. Graph-based strategies
 * such as Dijkstra can reuse the same contract to score warehouse-to-customer legs consistently.
 */
public interface DistanceCalculator {

    /**
     * Calculates the distance between an origin and a destination.
     *
     * @param originLatitude origin latitude in decimal degrees
     * @param originLongitude origin longitude in decimal degrees
     * @param destinationLatitude destination latitude in decimal degrees
     * @param destinationLongitude destination longitude in decimal degrees
     * @return distance in kilometers
     */
    double calculateDistance(
            double originLatitude,
            double originLongitude,
            double destinationLatitude,
            double destinationLongitude);
}
