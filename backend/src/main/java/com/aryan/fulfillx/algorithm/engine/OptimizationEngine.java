package com.aryan.fulfillx.algorithm.engine;

import com.aryan.fulfillx.algorithm.model.OptimizationRequest;
import com.aryan.fulfillx.algorithm.model.OptimizationResult;
import com.aryan.fulfillx.algorithm.strategy.OptimizationStrategy;
import java.util.Objects;

/**
 * Entry point for warehouse optimization algorithms.
 *
 * <p>Delegates execution to a pluggable {@link OptimizationStrategy}, keeping algorithm selection
 * outside the engine itself. Service-layer code can construct the engine with a concrete strategy
 * such as {@code WeightedGreedyStrategy} today and swap in graph-based strategies such as Dijkstra
 * or min-cost flow later without changing callers.
 */
public final class OptimizationEngine {

    private final OptimizationStrategy optimizationStrategy;

    /**
     * Creates an optimization engine backed by the given strategy.
     *
     * @param optimizationStrategy strategy that performs warehouse selection
     */
    public OptimizationEngine(OptimizationStrategy optimizationStrategy) {
        this.optimizationStrategy = Objects.requireNonNull(optimizationStrategy, "optimizationStrategy must not be null");
    }

    /**
     * Runs warehouse optimization for the given request.
     *
     * @param request immutable optimization input; must not be {@code null}
     * @return optimization outcome produced by the configured strategy
     */
    public OptimizationResult optimize(OptimizationRequest request) {
        Objects.requireNonNull(request, "request must not be null");
        return optimizationStrategy.optimize(request);
    }

    public OptimizationStrategy getOptimizationStrategy() {
        return optimizationStrategy;
    }
}
