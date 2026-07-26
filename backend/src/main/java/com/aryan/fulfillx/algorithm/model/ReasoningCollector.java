package com.aryan.fulfillx.algorithm.model;

import com.aryan.fulfillx.algorithm.model.OptimizationRequest.WarehouseAvailability;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * Mutable accumulator for optimization reasoning messages.
 *
 * <p>Strategies use this helper to record allocation decisions without coupling reasoning format
 * to a specific algorithm implementation.
 */
public final class ReasoningCollector {

    private final List<OptimizationReasoning> reasoning = new ArrayList<>();

    /**
     * Records a custom reasoning entry.
     *
     * @param entry reasoning message to append
     * @return this collector for chaining
     */
    public ReasoningCollector add(OptimizationReasoning entry) {
        reasoning.add(Objects.requireNonNull(entry, "entry must not be null"));
        return this;
    }

    /**
     * Records that a warehouse was filtered out before candidate scoring.
     *
     * @param warehouse warehouse that was excluded
     * @param message explanation for the exclusion
     * @return this collector for chaining
     */
    public ReasoningCollector addFiltered(WarehouseAvailability warehouse, String message) {
        return add(new OptimizationReasoning(
                ReasoningDecision.FILTERED,
                warehouse.warehouseId(),
                warehouse.warehouseName(),
                null,
                message));
    }

    /**
     * Records that a warehouse allocation was selected.
     *
     * @param warehouseId selected warehouse identifier
     * @param warehouseName selected warehouse name
     * @param productId product being allocated; may be {@code null} for plan-level selections
     * @param message explanation for the selection
     * @return this collector for chaining
     */
    public ReasoningCollector addSelected(UUID warehouseId, String warehouseName, UUID productId, String message) {
        return add(new OptimizationReasoning(ReasoningDecision.SELECTED, warehouseId, warehouseName, productId, message));
    }

    /**
     * Records that a warehouse allocation was rejected.
     *
     * @param warehouseId rejected warehouse identifier
     * @param warehouseName rejected warehouse name
     * @param productId product under evaluation; may be {@code null} for plan-level rejections
     * @param message explanation for the rejection
     * @return this collector for chaining
     */
    public ReasoningCollector addRejected(UUID warehouseId, String warehouseName, UUID productId, String message) {
        return add(new OptimizationReasoning(ReasoningDecision.REJECTED, warehouseId, warehouseName, productId, message));
    }

    /**
     * Records an informational optimization message.
     *
     * @param message contextual explanation
     * @return this collector for chaining
     */
    public ReasoningCollector addInfo(String message) {
        return add(new OptimizationReasoning(ReasoningDecision.INFO, null, null, null, message));
    }

    /**
     * Returns an immutable snapshot of collected reasoning messages.
     *
     * @return collected reasoning entries
     */
    public List<OptimizationReasoning> toList() {
        return List.copyOf(reasoning);
    }
}
