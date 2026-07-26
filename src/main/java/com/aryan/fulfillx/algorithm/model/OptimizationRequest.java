package com.aryan.fulfillx.algorithm.model;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

/**
 * Immutable input for warehouse optimization algorithms.
 *
 * <p>Contains only plain Java types so strategies can run without Spring or JPA. Service-layer
 * adapters are responsible for mapping domain entities into this model before invoking the engine.
 */
public final class OptimizationRequest {

    private final UUID orderId;
    private final double destinationLatitude;
    private final double destinationLongitude;
    private final List<OrderLine> orderLines;
    private final List<WarehouseAvailability> warehouseAvailabilities;
    private final OptimizationWeights optimizationWeights;

    /**
     * Creates an optimization request.
     *
     * @param orderId identifier of the customer order being fulfilled
     * @param destinationLatitude customer delivery latitude in decimal degrees
     * @param destinationLongitude customer delivery longitude in decimal degrees
     * @param orderLines products and quantities requested by the customer
     * @param warehouseAvailabilities candidate warehouses with stock and capacity snapshots
     * @param optimizationWeights relative weights applied by weighted scoring strategies
     */
    public OptimizationRequest(
            UUID orderId,
            double destinationLatitude,
            double destinationLongitude,
            List<OrderLine> orderLines,
            List<WarehouseAvailability> warehouseAvailabilities,
            OptimizationWeights optimizationWeights) {
        this.orderId = Objects.requireNonNull(orderId, "orderId must not be null");
        this.destinationLatitude = destinationLatitude;
        this.destinationLongitude = destinationLongitude;
        this.orderLines = List.copyOf(Objects.requireNonNull(orderLines, "orderLines must not be null"));
        this.warehouseAvailabilities = List.copyOf(
                Objects.requireNonNull(warehouseAvailabilities, "warehouseAvailabilities must not be null"));
        this.optimizationWeights = Objects.requireNonNull(optimizationWeights, "optimizationWeights must not be null");
    }

    public UUID getOrderId() {
        return orderId;
    }

    public double getDestinationLatitude() {
        return destinationLatitude;
    }

    public double getDestinationLongitude() {
        return destinationLongitude;
    }

    public List<OrderLine> getOrderLines() {
        return Collections.unmodifiableList(orderLines);
    }

    public List<WarehouseAvailability> getWarehouseAvailabilities() {
        return Collections.unmodifiableList(warehouseAvailabilities);
    }

    public OptimizationWeights getOptimizationWeights() {
        return optimizationWeights;
    }

    /**
     * A single product line on the customer order.
     *
     * @param productId product identifier
     * @param quantity requested quantity; must be positive when validated by callers
     */
    public record OrderLine(UUID productId, int quantity) {

        public OrderLine {
            Objects.requireNonNull(productId, "productId must not be null");
        }
    }

    /**
     * Snapshot of warehouse state available to optimization strategies.
     *
     * @param warehouseId warehouse identifier
     * @param warehouseName human-readable warehouse name
     * @param latitude warehouse latitude in decimal degrees
     * @param longitude warehouse longitude in decimal degrees
     * @param capacity maximum warehouse capacity
     * @param currentLoad current warehouse load
     * @param availableStockByProductId available inventory keyed by product identifier
     */
    public record WarehouseAvailability(
            UUID warehouseId,
            String warehouseName,
            double latitude,
            double longitude,
            int capacity,
            int currentLoad,
            Map<UUID, Integer> availableStockByProductId) {

        public WarehouseAvailability {
            Objects.requireNonNull(warehouseId, "warehouseId must not be null");
            Objects.requireNonNull(warehouseName, "warehouseName must not be null");
            availableStockByProductId = Map.copyOf(
                    Objects.requireNonNull(availableStockByProductId, "availableStockByProductId must not be null"));
        }
    }

    /**
     * Relative weights used by scoring strategies such as {@code WeightedGreedyStrategy}.
     *
     * <p>Graph-based strategies may ignore some weights or map them onto edge costs when building
     * a network for Dijkstra or min-cost flow solvers.
     *
     * @param distanceWeight weight applied to proximity scoring
     * @param shippingCostWeight weight applied to shipping cost scoring
     * @param inventoryWeight weight applied to stock availability scoring
     * @param warehouseLoadWeight weight applied to warehouse utilization scoring
     */
    public record OptimizationWeights(
            BigDecimal distanceWeight,
            BigDecimal shippingCostWeight,
            BigDecimal inventoryWeight,
            BigDecimal warehouseLoadWeight) {

        public OptimizationWeights {
            Objects.requireNonNull(distanceWeight, "distanceWeight must not be null");
            Objects.requireNonNull(shippingCostWeight, "shippingCostWeight must not be null");
            Objects.requireNonNull(inventoryWeight, "inventoryWeight must not be null");
            Objects.requireNonNull(warehouseLoadWeight, "warehouseLoadWeight must not be null");
        }
    }
}
