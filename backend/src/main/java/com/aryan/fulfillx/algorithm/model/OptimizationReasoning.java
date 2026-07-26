package com.aryan.fulfillx.algorithm.model;

import java.util.Objects;
import java.util.UUID;

/**
 * Human-readable explanation for an optimization decision.
 *
 * <p>Each entry captures why a warehouse, product allocation, or plan was selected, rejected, or
 * filtered. Optional identifiers allow UIs to correlate messages with specific entities.
 */
public final class OptimizationReasoning {

    private final ReasoningDecision decision;
    private final UUID warehouseId;
    private final String warehouseName;
    private final UUID productId;
    private final String message;

    /**
     * Creates an optimization reasoning entry.
     *
     * @param decision classification of the decision outcome
     * @param warehouseId warehouse involved in the decision; may be {@code null} for plan-level messages
     * @param warehouseName human-readable warehouse name; may be {@code null}
     * @param productId product involved in the decision; may be {@code null} for warehouse- or plan-level messages
     * @param message explanation of the decision
     */
    public OptimizationReasoning(
            ReasoningDecision decision,
            UUID warehouseId,
            String warehouseName,
            UUID productId,
            String message) {
        this.decision = Objects.requireNonNull(decision, "decision must not be null");
        this.warehouseId = warehouseId;
        this.warehouseName = warehouseName;
        this.productId = productId;
        this.message = Objects.requireNonNull(message, "message must not be null");
    }

    public ReasoningDecision getDecision() {
        return decision;
    }

    public UUID getWarehouseId() {
        return warehouseId;
    }

    public String getWarehouseName() {
        return warehouseName;
    }

    public UUID getProductId() {
        return productId;
    }

    public String getMessage() {
        return message;
    }
}
