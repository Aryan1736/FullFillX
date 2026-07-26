package com.aryan.fulfillx.algorithm.model;

/**
 * Classification for an optimization reasoning entry.
 *
 * <p>Strategies append {@link OptimizationReasoning} messages with one of these decisions so
 * callers can filter or render explanations consistently across algorithms.
 */
public enum ReasoningDecision {

    /** A warehouse, plan, or allocation leg was chosen for fulfillment. */
    SELECTED,

    /** A warehouse, plan, or allocation leg was evaluated but not chosen. */
    REJECTED,

    /** A warehouse or plan was excluded before scoring because it was infeasible. */
    FILTERED,

    /** Informational context that does not represent a selection outcome. */
    INFO
}
