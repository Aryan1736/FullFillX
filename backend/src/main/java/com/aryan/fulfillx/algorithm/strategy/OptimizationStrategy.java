package com.aryan.fulfillx.algorithm.strategy;

import com.aryan.fulfillx.algorithm.model.OptimizationRequest;
import com.aryan.fulfillx.algorithm.model.OptimizationResult;

/**
 * Contract for warehouse selection algorithms used by the optimization engine.
 *
 * <p>Each implementation encapsulates a distinct optimization approach, such as weighted greedy
 * selection, graph shortest-path methods (for example Dijkstra over a warehouse network), or
 * min-cost flow formulations for multi-warehouse fulfillment. Strategies must remain free of
 * Spring and persistence concerns so they can be unit tested in isolation.
 */
public interface OptimizationStrategy {

    /**
     * Selects warehouse fulfillment options for the given request.
     *
     * @param request immutable optimization input; must not be {@code null}
     * @return the optimization outcome produced by this strategy; must not be {@code null}
     */
    OptimizationResult optimize(OptimizationRequest request);
}
