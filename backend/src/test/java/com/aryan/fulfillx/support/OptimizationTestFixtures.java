package com.aryan.fulfillx.support;

import com.aryan.fulfillx.algorithm.calculator.DefaultEtaCalculator;
import com.aryan.fulfillx.algorithm.calculator.DefaultScoreCalculator;
import com.aryan.fulfillx.algorithm.calculator.DefaultShippingCostCalculator;
import com.aryan.fulfillx.algorithm.calculator.HaversineDistanceCalculator;
import com.aryan.fulfillx.algorithm.calculator.ScoreWeights;
import com.aryan.fulfillx.algorithm.model.OptimizationRequest;
import com.aryan.fulfillx.algorithm.model.OptimizationRequest.OrderLine;
import com.aryan.fulfillx.algorithm.model.OptimizationRequest.WarehouseAvailability;
import com.aryan.fulfillx.algorithm.strategy.WeightedGreedyStrategy;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public final class OptimizationTestFixtures {

    public static final UUID ORDER_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    public static final UUID PRODUCT_A = UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    public static final UUID PRODUCT_B = UUID.fromString("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
    public static final UUID WAREHOUSE_NEAR = UUID.fromString("22222222-2222-2222-2222-222222222222");
    public static final UUID WAREHOUSE_FAR = UUID.fromString("33333333-3333-3333-3333-333333333333");
    public static final UUID WAREHOUSE_EMPTY = UUID.fromString("44444444-4444-4444-4444-444444444444");

    public static final double DESTINATION_LAT = 40.7128;
    public static final double DESTINATION_LON = -74.0060;

    private OptimizationTestFixtures() {}

    public static ScoreWeights defaultScoreWeights() {
        return new ScoreWeights(
                BigDecimal.ONE,
                BigDecimal.ONE,
                BigDecimal.ONE,
                BigDecimal.valueOf(100));
    }

    public static OptimizationRequest.OptimizationWeights defaultOptimizationWeights() {
        return new OptimizationRequest.OptimizationWeights(
                BigDecimal.ONE,
                BigDecimal.ONE,
                BigDecimal.ONE,
                BigDecimal.ONE);
    }

    public static WeightedGreedyStrategy weightedGreedyStrategy() {
        return new WeightedGreedyStrategy(
                new HaversineDistanceCalculator(),
                new DefaultShippingCostCalculator(),
                new DefaultEtaCalculator(),
                new DefaultScoreCalculator(defaultScoreWeights()));
    }

    public static WarehouseAvailability nearWarehouse(Map<UUID, Integer> stock) {
        return warehouse(WAREHOUSE_NEAR, "Near Warehouse", 40.7580, -73.9855, 100, 10, stock);
    }

    public static WarehouseAvailability farWarehouse(Map<UUID, Integer> stock) {
        return warehouse(WAREHOUSE_FAR, "Far Warehouse", 34.0522, -118.2437, 100, 10, stock);
    }

    public static WarehouseAvailability emptyWarehouse() {
        return warehouse(WAREHOUSE_EMPTY, "Empty Warehouse", 41.0, -75.0, 100, 0, Map.of());
    }

    public static WarehouseAvailability warehouse(
            UUID warehouseId,
            String name,
            double latitude,
            double longitude,
            int capacity,
            int currentLoad,
            Map<UUID, Integer> stock) {
        return new WarehouseAvailability(
                warehouseId, name, latitude, longitude, capacity, currentLoad, stock);
    }

    public static OptimizationRequest request(List<OrderLine> orderLines, List<WarehouseAvailability> warehouses) {
        return new OptimizationRequest(
                ORDER_ID,
                DESTINATION_LAT,
                DESTINATION_LON,
                orderLines,
                warehouses,
                defaultOptimizationWeights());
    }
}
