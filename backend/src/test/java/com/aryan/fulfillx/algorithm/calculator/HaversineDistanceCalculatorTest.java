package com.aryan.fulfillx.algorithm.calculator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("DistanceCalculator (Haversine)")
class HaversineDistanceCalculatorTest {

    private HaversineDistanceCalculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new HaversineDistanceCalculator();
    }

    @Test
    @DisplayName("returns zero when origin and destination are identical")
    void calculateDistance_sameCoordinates_returnsZero() {
        double distance = calculator.calculateDistance(40.7128, -74.0060, 40.7128, -74.0060);

        assertEquals(0.0, distance, 0.001);
    }

    @Test
    @DisplayName("computes known great-circle distance between NYC and Los Angeles")
    void calculateDistance_nycToLosAngeles_returnsExpectedDistance() {
        double distance = calculator.calculateDistance(40.7128, -74.0060, 34.0522, -118.2437);

        assertEquals(3936.0, distance, 50.0);
    }

    @Test
    @DisplayName("distance is symmetric regardless of direction")
    void calculateDistance_isSymmetric() {
        double forward = calculator.calculateDistance(51.5074, -0.1278, 48.8566, 2.3522);
        double reverse = calculator.calculateDistance(48.8566, 2.3522, 51.5074, -0.1278);

        assertEquals(forward, reverse, 0.001);
    }

    @Test
    @DisplayName("short distance between nearby coordinates is positive")
    void calculateDistance_nearbyPoints_returnsSmallPositiveDistance() {
        double distance = calculator.calculateDistance(0.0, 0.0, 0.0, 0.1);

        assertTrue(distance > 0.0);
        assertTrue(distance < 20.0);
    }

    @Test
    @DisplayName("crosses equator and prime meridian without error")
    void calculateDistance_crossesEquatorAndMeridian_returnsPositiveDistance() {
        double distance = calculator.calculateDistance(-1.0, -1.0, 1.0, 1.0);

        assertTrue(distance > 0.0);
    }
}
