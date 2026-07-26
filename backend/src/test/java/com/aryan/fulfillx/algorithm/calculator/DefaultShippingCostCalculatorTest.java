package com.aryan.fulfillx.algorithm.calculator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

@DisplayName("ShippingCostCalculator (Default)")
class DefaultShippingCostCalculatorTest {

    private DefaultShippingCostCalculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new DefaultShippingCostCalculator(new ShippingCostParameters(
                BigDecimal.valueOf(5),
                BigDecimal.valueOf(0.5),
                BigDecimal.valueOf(2),
                BigDecimal.ONE));
    }

    @Test
    @DisplayName("calculates base + distance + weight components")
    void calculateShippingCost_normalCase_returnsCombinedCost() {
        BigDecimal cost = calculator.calculateShippingCost(10.0, 3);

        assertEquals(new BigDecimal("16.0000"), cost);
    }

    @Test
    @DisplayName("zero distance and zero items returns base cost only")
    void calculateShippingCost_zeroDistanceAndItems_returnsBaseCost() {
        BigDecimal cost = calculator.calculateShippingCost(0.0, 0);

        assertEquals(new BigDecimal("5.0000"), cost);
    }

    @Test
    @DisplayName("default constructor uses built-in parameters")
    void defaultConstructor_usesDefaultParameters() {
        DefaultShippingCostCalculator defaultCalculator = new DefaultShippingCostCalculator();

        BigDecimal cost = defaultCalculator.calculateShippingCost(0.0, 0);

        assertEquals(new BigDecimal("5.0000"), cost);
    }

    @Test
    @DisplayName("rejects negative distance")
    void calculateShippingCost_negativeDistance_throwsIllegalArgumentException() {
        IllegalArgumentException exception =
                assertThrows(IllegalArgumentException.class, () -> calculator.calculateShippingCost(-1.0, 1));

        assertEquals("distanceKilometers must not be negative", exception.getMessage());
    }

    @ParameterizedTest
    @ValueSource(ints = {-1, -100})
    @DisplayName("rejects negative item count")
    void calculateShippingCost_negativeItemCount_throwsIllegalArgumentException(int itemCount) {
        IllegalArgumentException exception =
                assertThrows(IllegalArgumentException.class, () -> calculator.calculateShippingCost(1.0, itemCount));

        assertEquals("itemCount must not be negative", exception.getMessage());
    }

    @Test
    @DisplayName("constructor rejects null parameters")
    void constructor_nullParameters_throwsNullPointerException() {
        assertThrows(NullPointerException.class, () -> new DefaultShippingCostCalculator(null));
    }

    @Test
    @DisplayName("scales cost linearly with item count")
    void calculateShippingCost_moreItems_increasesWeightCost() {
        BigDecimal singleItemCost = calculator.calculateShippingCost(0.0, 1);
        BigDecimal tripleItemCost = calculator.calculateShippingCost(0.0, 3);

        assertEquals(new BigDecimal("7.0000"), singleItemCost);
        assertEquals(new BigDecimal("11.0000"), tripleItemCost);
    }
}
