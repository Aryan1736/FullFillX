package com.aryan.fulfillx.algorithm.calculator;

import com.aryan.fulfillx.algorithm.model.ScoreBreakdown;
import java.math.BigDecimal;

/**
 * Computes weighted optimization scores for warehouse candidates and allocation plans.
 *
 * <p>Strategies delegate scoring to implementations such as {@link DefaultScoreCalculator} so
 * weighting rules stay centralized and can be swapped without changing selection logic.
 */
public interface ScoreCalculator {

    /**
     * Scores a single warehouse fulfillment leg.
     *
     * @param shippingCost estimated shipping cost for the leg
     * @param etaHours estimated delivery time in hours
     * @param loadPenalty warehouse load penalty for the leg
     * @return weighted leg score; lower is better
     */
    BigDecimal scoreWarehouseLeg(BigDecimal shippingCost, int etaHours, BigDecimal loadPenalty);

    /**
     * Scores an entire allocation plan.
     *
     * @param totalShippingCost aggregate shipping cost across all warehouse legs
     * @param maxEtaHours longest delivery time among warehouse legs
     * @param totalLoadPenalty aggregate warehouse load penalty across all legs
     * @param warehouseCount number of warehouses used by the plan
     * @return weighted plan score including split-shipment penalties; lower is better
     */
    BigDecimal scorePlan(
            BigDecimal totalShippingCost,
            int maxEtaHours,
            BigDecimal totalLoadPenalty,
            int warehouseCount);

    /**
     * Builds a decomposed score breakdown for a warehouse candidate.
     *
     * @param distanceKilometers geographic distance between warehouse and destination
     * @param shippingCost estimated shipping cost for the warehouse leg
     * @param etaHours estimated delivery time in hours
     * @param loadPenalty warehouse load penalty for the leg
     * @param inventoryPenalty raw inventory depletion penalty before weighting
     * @return weighted score components for the candidate
     */
    ScoreBreakdown scoreWarehouseBreakdown(
            double distanceKilometers,
            BigDecimal shippingCost,
            int etaHours,
            BigDecimal loadPenalty,
            BigDecimal inventoryPenalty);

    /**
     * Returns the weights applied by this calculator.
     *
     * @return configured score weights
     */
    ScoreWeights getWeights();
}
