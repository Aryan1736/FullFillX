package com.aryan.fulfillx.algorithm.model;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

/**
 * A warehouse evaluated by an optimization strategy.
 *
 * <p>Contains the per-warehouse allocation proposal together with the metrics and score
 * decomposition used to rank it against alternatives.
 */
public final class WarehouseCandidate {

    private final UUID warehouseId;
    private final String warehouseName;
    private final Map<UUID, Integer> allocatedQuantitiesByProductId;
    private final BigDecimal shippingCost;
    private final int estimatedDeliveryHours;
    private final ScoreBreakdown scoreBreakdown;

    /**
     * Creates a warehouse candidate produced by an optimization strategy.
     *
     * @param warehouseId identifier of the source warehouse
     * @param warehouseName human-readable warehouse name
     * @param allocatedQuantitiesByProductId product quantities proposed from this warehouse
     * @param shippingCost estimated shipping cost for this warehouse leg
     * @param estimatedDeliveryHours estimated delivery time in hours for this warehouse leg
     * @param scoreBreakdown decomposed optimization score for this candidate
     */
    public WarehouseCandidate(
            UUID warehouseId,
            String warehouseName,
            Map<UUID, Integer> allocatedQuantitiesByProductId,
            BigDecimal shippingCost,
            int estimatedDeliveryHours,
            ScoreBreakdown scoreBreakdown) {
        this.warehouseId = Objects.requireNonNull(warehouseId, "warehouseId must not be null");
        this.warehouseName = Objects.requireNonNull(warehouseName, "warehouseName must not be null");
        this.allocatedQuantitiesByProductId = Map.copyOf(
                Objects.requireNonNull(allocatedQuantitiesByProductId, "allocatedQuantitiesByProductId must not be null"));
        this.shippingCost = Objects.requireNonNull(shippingCost, "shippingCost must not be null");
        this.estimatedDeliveryHours = estimatedDeliveryHours;
        this.scoreBreakdown = Objects.requireNonNull(scoreBreakdown, "scoreBreakdown must not be null");
    }

    public UUID getWarehouseId() {
        return warehouseId;
    }

    public String getWarehouseName() {
        return warehouseName;
    }

    public Map<UUID, Integer> getAllocatedQuantitiesByProductId() {
        return Collections.unmodifiableMap(allocatedQuantitiesByProductId);
    }

    public BigDecimal getShippingCost() {
        return shippingCost;
    }

    public int getEstimatedDeliveryHours() {
        return estimatedDeliveryHours;
    }

    public ScoreBreakdown getScoreBreakdown() {
        return scoreBreakdown;
    }
}
