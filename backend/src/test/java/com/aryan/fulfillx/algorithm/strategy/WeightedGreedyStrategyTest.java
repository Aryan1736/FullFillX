package com.aryan.fulfillx.algorithm.strategy;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.aryan.fulfillx.algorithm.calculator.DefaultEtaCalculator;
import com.aryan.fulfillx.algorithm.calculator.DefaultScoreCalculator;
import com.aryan.fulfillx.algorithm.calculator.DefaultShippingCostCalculator;
import com.aryan.fulfillx.algorithm.calculator.DistanceCalculator;
import com.aryan.fulfillx.algorithm.calculator.EtaCalculator;
import com.aryan.fulfillx.algorithm.calculator.HaversineDistanceCalculator;
import com.aryan.fulfillx.algorithm.calculator.ScoreCalculator;
import com.aryan.fulfillx.algorithm.calculator.ShippingCostCalculator;
import com.aryan.fulfillx.algorithm.model.OptimizationReasoning;
import com.aryan.fulfillx.algorithm.model.OptimizationRequest;
import com.aryan.fulfillx.algorithm.model.OptimizationRequest.OrderLine;
import com.aryan.fulfillx.algorithm.model.OptimizationRequest.WarehouseAvailability;
import com.aryan.fulfillx.algorithm.model.OptimizationResult;
import com.aryan.fulfillx.algorithm.model.ReasoningDecision;
import com.aryan.fulfillx.support.OptimizationTestFixtures;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("WeightedGreedyStrategy")
class WeightedGreedyStrategyTest {

    private WeightedGreedyStrategy strategy;

    @BeforeEach
    void setUp() {
        strategy = OptimizationTestFixtures.weightedGreedyStrategy();
    }

    @Test
    @DisplayName("selects single warehouse when it can fulfill the entire order")
    void optimize_singleWarehouseFulfillment_selectsOneWarehouse() {
        WarehouseAvailability nearWarehouse =
                OptimizationTestFixtures.nearWarehouse(Map.of(OptimizationTestFixtures.PRODUCT_A, 10));
        OptimizationRequest request = OptimizationTestFixtures.request(
                List.of(new OrderLine(OptimizationTestFixtures.PRODUCT_A, 5)),
                List.of(nearWarehouse));

        OptimizationResult result = strategy.optimize(request);

        assertEquals("WEIGHTED_GREEDY", result.getStrategyName());
        assertEquals(1, result.getWarehouseCandidates().size());
        assertEquals(OptimizationTestFixtures.WAREHOUSE_NEAR, result.getSelectedWarehouses().getFirst());
        assertEquals(5, result.getWarehouseCandidates().getFirst()
                .getAllocatedQuantitiesByProductId()
                .get(OptimizationTestFixtures.PRODUCT_A));
        assertTrue(result.getOptimizationScore().compareTo(BigDecimal.ZERO) > 0);
        assertNull(result.getEstimatedSavings());
    }

    @Test
    @DisplayName("requires split shipment when no single warehouse has enough stock")
    void optimize_splitShipmentRequired_usesMultipleWarehouses() {
        WarehouseAvailability nearPartial = OptimizationTestFixtures.nearWarehouse(
                Map.of(OptimizationTestFixtures.PRODUCT_A, 6));
        WarehouseAvailability farPartial = OptimizationTestFixtures.farWarehouse(
                Map.of(OptimizationTestFixtures.PRODUCT_A, 6));
        OptimizationRequest request = OptimizationTestFixtures.request(
                List.of(new OrderLine(OptimizationTestFixtures.PRODUCT_A, 10)),
                List.of(nearPartial, farPartial));

        OptimizationResult result = strategy.optimize(request);

        assertEquals(2, result.getSelectedWarehouses().size());
        assertEquals(2, result.getWarehouseCandidates().size());

        int totalAllocated = result.getWarehouseCandidates().stream()
                .mapToInt(candidate -> candidate.getAllocatedQuantitiesByProductId()
                        .getOrDefault(OptimizationTestFixtures.PRODUCT_A, 0))
                .sum();
        assertEquals(10, totalAllocated);
        assertNotNull(result.getScoreBreakdown().getSplitShipmentPenalty());
        assertTrue(result.getScoreBreakdown().getSplitShipmentPenalty().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("returns empty result when collective inventory is insufficient")
    void optimize_insufficientInventory_returnsEmptyResult() {
        WarehouseAvailability nearWarehouse =
                OptimizationTestFixtures.nearWarehouse(Map.of(OptimizationTestFixtures.PRODUCT_A, 3));
        WarehouseAvailability farWarehouse =
                OptimizationTestFixtures.farWarehouse(Map.of(OptimizationTestFixtures.PRODUCT_A, 4));
        OptimizationRequest request = OptimizationTestFixtures.request(
                List.of(new OrderLine(OptimizationTestFixtures.PRODUCT_A, 10)),
                List.of(nearWarehouse, farWarehouse));

        OptimizationResult result = strategy.optimize(request);

        assertTrue(result.getWarehouseCandidates().isEmpty());
        assertTrue(result.getSelectedWarehouses().isEmpty());
        assertEquals(BigDecimal.ZERO, result.getOptimizationScore());
        assertTrue(result.getReasoning().stream()
                .anyMatch(reason -> reason.getMessage().contains("collective inventory")));
    }

    @Test
    @DisplayName("returns empty result when no warehouse has relevant stock")
    void optimize_emptyWarehouseInventory_returnsEmptyResult() {
        OptimizationRequest request = OptimizationTestFixtures.request(
                List.of(new OrderLine(OptimizationTestFixtures.PRODUCT_A, 1)),
                List.of(OptimizationTestFixtures.emptyWarehouse()));

        OptimizationResult result = strategy.optimize(request);

        assertTrue(result.getWarehouseCandidates().isEmpty());
        assertTrue(result.getReasoning().stream()
                .anyMatch(reason -> reason.getMessage().contains("No warehouses can fulfill")));
    }

    @Test
    @DisplayName("filters warehouses that cannot fulfill any requested product")
    void optimize_irrelevantWarehouseStock_filtersWarehouse() {
        WarehouseAvailability irrelevantStock = OptimizationTestFixtures.warehouse(
                UUID.randomUUID(),
                "Irrelevant Warehouse",
                40.0,
                -74.0,
                100,
                0,
                Map.of(OptimizationTestFixtures.PRODUCT_B, 20));
        WarehouseAvailability usableWarehouse = OptimizationTestFixtures.nearWarehouse(
                Map.of(OptimizationTestFixtures.PRODUCT_A, 5));
        OptimizationRequest request = OptimizationTestFixtures.request(
                List.of(new OrderLine(OptimizationTestFixtures.PRODUCT_A, 2)),
                List.of(irrelevantStock, usableWarehouse));

        OptimizationResult result = strategy.optimize(request);

        assertEquals(1, result.getWarehouseCandidates().size());
        assertTrue(result.getReasoning().stream()
                .anyMatch(reason -> reason.getDecision() == ReasoningDecision.FILTERED
                        && reason.getMessage().contains("no requested product")));
    }

    @Test
    @DisplayName("prefers closer warehouse when it can fulfill the entire order")
    void optimize_twoSingleWarehouseCandidates_prefersCloserWarehouse() {
        WarehouseAvailability nearWarehouse = OptimizationTestFixtures.nearWarehouse(
                Map.of(OptimizationTestFixtures.PRODUCT_A, 10));
        WarehouseAvailability farWarehouse = OptimizationTestFixtures.farWarehouse(
                Map.of(OptimizationTestFixtures.PRODUCT_A, 10));
        OptimizationRequest request = OptimizationTestFixtures.request(
                List.of(new OrderLine(OptimizationTestFixtures.PRODUCT_A, 3)),
                List.of(nearWarehouse, farWarehouse));

        OptimizationResult result = strategy.optimize(request);

        assertEquals(1, result.getSelectedWarehouses().size());
        assertEquals(OptimizationTestFixtures.WAREHOUSE_NEAR, result.getSelectedWarehouses().getFirst());
        assertNotNull(result.getEstimatedSavings());
        assertTrue(result.getEstimatedSavings().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("fulfills multi-product orders from a single warehouse")
    void optimize_multiProductOrder_allocatesAllLines() {
        WarehouseAvailability warehouse = OptimizationTestFixtures.nearWarehouse(Map.of(
                OptimizationTestFixtures.PRODUCT_A, 5,
                OptimizationTestFixtures.PRODUCT_B, 5));
        OptimizationRequest request = OptimizationTestFixtures.request(
                List.of(
                        new OrderLine(OptimizationTestFixtures.PRODUCT_A, 2),
                        new OrderLine(OptimizationTestFixtures.PRODUCT_B, 3)),
                List.of(warehouse));

        OptimizationResult result = strategy.optimize(request);

        Map<UUID, Integer> allocations = result.getWarehouseCandidates().getFirst()
                .getAllocatedQuantitiesByProductId();
        assertEquals(2, allocations.get(OptimizationTestFixtures.PRODUCT_A));
        assertEquals(3, allocations.get(OptimizationTestFixtures.PRODUCT_B));
    }

    @Test
    @DisplayName("handles zero-capacity warehouse using default load penalty")
    void optimize_zeroCapacityWarehouse_stillProducesPlan() {
        WarehouseAvailability zeroCapacityWarehouse = OptimizationTestFixtures.warehouse(
                OptimizationTestFixtures.WAREHOUSE_NEAR,
                "Zero Capacity",
                40.7580,
                -73.9855,
                0,
                0,
                Map.of(OptimizationTestFixtures.PRODUCT_A, 5));
        OptimizationRequest request = OptimizationTestFixtures.request(
                List.of(new OrderLine(OptimizationTestFixtures.PRODUCT_A, 2)),
                List.of(zeroCapacityWarehouse));

        OptimizationResult result = strategy.optimize(request);

        assertEquals(1, result.getWarehouseCandidates().size());
        assertTrue(result.getOptimizationScore().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("rejects null optimization request")
    void optimize_nullRequest_throwsNullPointerException() {
        assertThrows(NullPointerException.class, () -> strategy.optimize(null));
    }

    @Test
    @DisplayName("constructor rejects null dependencies")
    void constructor_nullDependencies_throwNullPointerException() {
        DistanceCalculator distanceCalculator = new HaversineDistanceCalculator();
        ShippingCostCalculator shippingCostCalculator = new DefaultShippingCostCalculator();
        EtaCalculator etaCalculator = new DefaultEtaCalculator();
        ScoreCalculator scoreCalculator = new DefaultScoreCalculator(OptimizationTestFixtures.defaultScoreWeights());

        assertThrows(
                NullPointerException.class,
                () -> new WeightedGreedyStrategy(null, shippingCostCalculator, etaCalculator, scoreCalculator));
        assertThrows(
                NullPointerException.class,
                () -> new WeightedGreedyStrategy(distanceCalculator, null, etaCalculator, scoreCalculator));
        assertThrows(
                NullPointerException.class,
                () -> new WeightedGreedyStrategy(distanceCalculator, shippingCostCalculator, null, scoreCalculator));
        assertThrows(
                NullPointerException.class,
                () -> new WeightedGreedyStrategy(distanceCalculator, shippingCostCalculator, etaCalculator, null));
    }

    @Test
    @DisplayName("exposes injected calculator dependencies")
    void getters_returnInjectedCalculators() {
        assertNotNull(strategy.getDistanceCalculator());
        assertNotNull(strategy.getShippingCostCalculator());
        assertNotNull(strategy.getEtaCalculator());
        assertNotNull(strategy.getScoreCalculator());
    }

    @Test
    @DisplayName("records selected and rejected reasoning for split allocation legs")
    void optimize_splitShipment_recordsReasoningDecisions() {
        WarehouseAvailability nearPartial = OptimizationTestFixtures.nearWarehouse(
                Map.of(OptimizationTestFixtures.PRODUCT_A, 4));
        WarehouseAvailability farPartial = OptimizationTestFixtures.farWarehouse(
                Map.of(OptimizationTestFixtures.PRODUCT_A, 4));
        OptimizationRequest request = OptimizationTestFixtures.request(
                List.of(new OrderLine(OptimizationTestFixtures.PRODUCT_A, 6)),
                List.of(nearPartial, farPartial));

        OptimizationResult result = strategy.optimize(request);

        assertTrue(result.getReasoning().stream()
                .anyMatch(reason -> reason.getDecision() == ReasoningDecision.SELECTED));
        assertTrue(result.getReasoning().stream()
                .anyMatch(reason -> reason.getDecision() == ReasoningDecision.REJECTED
                        || reason.getDecision() == ReasoningDecision.INFO));
    }

    @Test
    @DisplayName("uses score calculator output when ranking candidate plans")
    void optimize_usesScoreCalculatorForPlanRanking() {
        ScoreCalculator scoreCalculator = mock(ScoreCalculator.class);
        when(scoreCalculator.scorePlanBreakdown(any(), anyInt(), any(), anyInt()))
                .thenReturn(new com.aryan.fulfillx.algorithm.model.PlanScoreBreakdown(
                        BigDecimal.ONE,
                        BigDecimal.ONE,
                        BigDecimal.ONE,
                        BigDecimal.ZERO,
                        BigDecimal.valueOf(10)))
                .thenReturn(new com.aryan.fulfillx.algorithm.model.PlanScoreBreakdown(
                        BigDecimal.ONE,
                        BigDecimal.ONE,
                        BigDecimal.ONE,
                        BigDecimal.ZERO,
                        BigDecimal.valueOf(5)));
        when(scoreCalculator.scoreWarehouseLeg(any(), anyInt(), any()))
                .thenReturn(BigDecimal.ONE);
        when(scoreCalculator.scoreWarehouseBreakdown(anyDouble(), any(), anyInt(), any(), any()))
                .thenReturn(new com.aryan.fulfillx.algorithm.model.ScoreBreakdown(
                        BigDecimal.ONE,
                        BigDecimal.ONE,
                        BigDecimal.ZERO,
                        BigDecimal.ZERO,
                        BigDecimal.ONE));

        WeightedGreedyStrategy mockedStrategy = new WeightedGreedyStrategy(
                new HaversineDistanceCalculator(),
                new DefaultShippingCostCalculator(),
                new DefaultEtaCalculator(),
                scoreCalculator);

        WarehouseAvailability nearWarehouse = OptimizationTestFixtures.nearWarehouse(
                Map.of(OptimizationTestFixtures.PRODUCT_A, 10));
        WarehouseAvailability farWarehouse = OptimizationTestFixtures.farWarehouse(
                Map.of(OptimizationTestFixtures.PRODUCT_A, 10));
        OptimizationRequest request = OptimizationTestFixtures.request(
                List.of(new OrderLine(OptimizationTestFixtures.PRODUCT_A, 2)),
                List.of(nearWarehouse, farWarehouse));

        OptimizationResult result = mockedStrategy.optimize(request);

        assertEquals(new BigDecimal("5"), result.getOptimizationScore());
        assertTrue(result.getReasoning().stream()
                .map(OptimizationReasoning::getMessage)
                .anyMatch(message -> message.contains("Selected fulfillment plan")));
    }
}
