package com.aryan.fulfillx.algorithm.calculator;

/**
 * Computes great-circle distance between two coordinate pairs using the Haversine formula.
 */
public final class HaversineDistanceCalculator implements DistanceCalculator {

    private static final double EARTH_RADIUS_KILOMETERS = 6371.0;

    @Override
    public double calculateDistance(
            double originLatitude,
            double originLongitude,
            double destinationLatitude,
            double destinationLongitude) {
        double originLatitudeRadians = Math.toRadians(originLatitude);
        double destinationLatitudeRadians = Math.toRadians(destinationLatitude);
        double deltaLatitudeRadians = Math.toRadians(destinationLatitude - originLatitude);
        double deltaLongitudeRadians = Math.toRadians(destinationLongitude - originLongitude);

        double haversine =
                Math.sin(deltaLatitudeRadians / 2.0) * Math.sin(deltaLatitudeRadians / 2.0)
                        + Math.cos(originLatitudeRadians)
                                * Math.cos(destinationLatitudeRadians)
                                * Math.sin(deltaLongitudeRadians / 2.0)
                                * Math.sin(deltaLongitudeRadians / 2.0);

        double centralAngle = 2.0 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1.0 - haversine));
        return EARTH_RADIUS_KILOMETERS * centralAngle;
    }
}
