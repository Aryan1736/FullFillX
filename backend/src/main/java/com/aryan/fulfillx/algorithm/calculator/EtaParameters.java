package com.aryan.fulfillx.algorithm.calculator;

/**
 * Configuration for {@link DefaultEtaCalculator}.
 */
public final class EtaParameters {

    private final double averageSpeedKilometersPerHour;

    /**
     * Creates ETA parameters.
     *
     * @param averageSpeedKilometersPerHour average delivery speed used to estimate travel time
     */
    public EtaParameters(double averageSpeedKilometersPerHour) {
        if (averageSpeedKilometersPerHour <= 0.0) {
            throw new IllegalArgumentException("averageSpeedKilometersPerHour must be positive");
        }
        this.averageSpeedKilometersPerHour = averageSpeedKilometersPerHour;
    }

    /**
     * Returns default ETA parameters.
     *
     * @return default ETA configuration
     */
    public static EtaParameters defaults() {
        return new EtaParameters(60.0);
    }

    public double getAverageSpeedKilometersPerHour() {
        return averageSpeedKilometersPerHour;
    }
}
