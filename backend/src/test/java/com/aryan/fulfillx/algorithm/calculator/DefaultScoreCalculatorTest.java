package com.aryan.fulfillx.algorithm.calculator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.aryan.fulfillx.algorithm.model.PlanScoreBreakdown;
import com.aryan.fulfillx.algorithm.model.ScoreBreakdown;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("ScoreCalculator (Default)")
class DefaultScoreCalculatorTest {

    private DefaultScoreCalculator calculator;
    private ScoreWeights weights;

    @BeforeEach
    void setUp() {
        weights = new ScoreWeights(
                BigDecimal.valueOf(2),
                BigDecimal.valueOf(3),
                BigDecimal.valueOf(4),
                BigDecimal.valueOf(50));
        calculator = new DefaultScoreCalculator(weights);
    }

    @Test
    @DisplayName("scores warehouse leg using weighted shipping, eta, and load")
    void scoreWarehouseLeg_normalCase_returnsWeightedSum() {
        BigDecimal score = calculator.scoreWarehouseLeg(
                BigDecimal.valueOf(10), 5, BigDecimal.valueOf(0.5));

        assertEquals(new BigDecimal("37.0000"), score);
    }

    @Test
    @DisplayName("single-warehouse plan has no split-shipment penalty")
    void scorePlan_singleWarehouse_hasNoSplitPenalty() {
        BigDecimal score = calculator.scorePlan(
                BigDecimal.valueOf(10), 5, BigDecimal.valueOf(0.5), 1);

        assertEquals(new BigDecimal("37.0000"), score);
    }

    @Test
    @DisplayName("multi-warehouse plan applies split-shipment penalty")
    void scorePlan_splitShipment_appliesSplitPenalty() {
        BigDecimal score = calculator.scorePlan(
                BigDecimal.valueOf(10), 5, BigDecimal.valueOf(0.5), 3);

        assertEquals(new BigDecimal("137.0000"), score);
    }

    @Test
    @DisplayName("plan breakdown exposes all weighted components")
    void scorePlanBreakdown_normalCase_returnsDecomposedScores() {
        PlanScoreBreakdown breakdown = calculator.scorePlanBreakdown(
                BigDecimal.valueOf(10), 5, BigDecimal.valueOf(0.5), 2);

        assertEquals(new BigDecimal("20.0000"), breakdown.getShippingCostScore());
        assertEquals(new BigDecimal("15.0000"), breakdown.getEtaScore());
        assertEquals(new BigDecimal("2.0000"), breakdown.getWarehouseLoadScore());
        assertEquals(new BigDecimal("50"), breakdown.getSplitShipmentPenalty());
        assertEquals(new BigDecimal("87.0000"), breakdown.getTotalScore());
    }

    @Test
    @DisplayName("warehouse breakdown includes distance and inventory components")
    void scoreWarehouseBreakdown_normalCase_returnsDecomposedScores() {
        ScoreBreakdown breakdown = calculator.scoreWarehouseBreakdown(
                12.5, BigDecimal.valueOf(10), 5, BigDecimal.valueOf(0.5), BigDecimal.valueOf(0.25));

        assertEquals(new BigDecimal("37.5000"), breakdown.getDistanceScore());
        assertEquals(new BigDecimal("20.0000"), breakdown.getShippingCostScore());
        assertEquals(new BigDecimal("0.2500"), breakdown.getInventoryScore());
        assertEquals(new BigDecimal("2.0000"), breakdown.getWarehouseLoadScore());
        assertEquals(new BigDecimal("37.0000"), breakdown.getTotalScore());
    }

    @Test
    @DisplayName("returns configured weights")
    void getWeights_returnsConfiguredWeights() {
        assertEquals(weights, calculator.getWeights());
    }

    @Test
    @DisplayName("rejects null shipping cost on warehouse leg scoring")
    void scoreWarehouseLeg_nullShippingCost_throwsNullPointerException() {
        assertThrows(
                NullPointerException.class,
                () -> calculator.scoreWarehouseLeg(null, 5, BigDecimal.ONE));
    }

    @Test
    @DisplayName("rejects null load penalty on warehouse leg scoring")
    void scoreWarehouseLeg_nullLoadPenalty_throwsNullPointerException() {
        assertThrows(
                NullPointerException.class,
                () -> calculator.scoreWarehouseLeg(BigDecimal.ONE, 5, null));
    }

    @Test
    @DisplayName("rejects null inputs on plan scoring")
    void scorePlan_nullInputs_throwsNullPointerException() {
        assertThrows(
                NullPointerException.class,
                () -> calculator.scorePlan(null, 5, BigDecimal.ONE, 1));
        assertThrows(
                NullPointerException.class,
                () -> calculator.scorePlan(BigDecimal.ONE, 5, null, 1));
    }

    @Test
    @DisplayName("rejects null inputs on warehouse breakdown")
    void scoreWarehouseBreakdown_nullInputs_throwsNullPointerException() {
        assertThrows(
                NullPointerException.class,
                () -> calculator.scoreWarehouseBreakdown(1.0, null, 5, BigDecimal.ONE, BigDecimal.ONE));
        assertThrows(
                NullPointerException.class,
                () -> calculator.scoreWarehouseBreakdown(1.0, BigDecimal.ONE, 5, null, BigDecimal.ONE));
        assertThrows(
                NullPointerException.class,
                () -> calculator.scoreWarehouseBreakdown(1.0, BigDecimal.ONE, 5, BigDecimal.ONE, null));
    }

    @Test
    @DisplayName("constructor rejects null weights")
    void constructor_nullWeights_throwsNullPointerException() {
        NullPointerException exception =
                assertThrows(NullPointerException.class, () -> new DefaultScoreCalculator(null));

        assertNotNull(exception.getMessage());
    }
}
