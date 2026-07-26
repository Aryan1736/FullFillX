package com.aryan.fulfillx.algorithm.calculator;

import java.util.Objects;

/**
 * Default ETA calculator used by greedy optimization strategies.
 *
 * <p>Estimates delivery time from distance and a configurable average speed.
 */
public final class DefaultEtaCalculator implements EtaCalculator {

    private final EtaParameters parameters;

    /**
     * Creates an ETA calculator with the given parameters.
     *
     * @param parameters ETA configuration
     */
    public DefaultEtaCalculator(EtaParameters parameters) {
        this.parameters = Objects.requireNonNull(parameters, "parameters must not be null");
    }

    /**
     * Creates an ETA calculator using {@link EtaParameters#defaults()}.
     */
    public DefaultEtaCalculator() {
        this(EtaParameters.defaults());
    }

    @Override
    public int calculateEtaHours(double distanceKilometers) {
        if (distanceKilometers < 0.0) {
            throw new IllegalArgumentException("distanceKilometers must not be negative");
        }
        if (distanceKilometers == 0.0) {
            return 0;
        }

        return (int) Math.ceil(distanceKilometers / parameters.getAverageSpeedKilometersPerHour());
    }
}
