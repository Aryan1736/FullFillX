package com.aryan.fulfillx.algorithm.calculator;

import com.aryan.fulfillx.algorithm.model.ScoreBreakdown;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

/**
 * Default weighted score calculator used by greedy optimization strategies.
 *
 * <p>Applies {@link ScoreWeights} to shipping cost, delivery time, warehouse load, and split-
 * shipment penalties.
 */
public final class DefaultScoreCalculator implements ScoreCalculator {

    private static final int SCORE_SCALE = 4;

    private final ScoreWeights weights;

    /**
     * Creates a score calculator with the given weights.
     *
     * @param weights score weights applied to each scoring dimension
     */
    public DefaultScoreCalculator(ScoreWeights weights) {
        this.weights = Objects.requireNonNull(weights, "weights must not be null");
    }

    /**
     * Creates a score calculator using {@link ScoreWeights#defaults()}.
     */
    public DefaultScoreCalculator() {
        this(ScoreWeights.defaults());
    }

    @Override
    public BigDecimal scoreWarehouseLeg(BigDecimal shippingCost, int etaHours, BigDecimal loadPenalty) {
        Objects.requireNonNull(shippingCost, "shippingCost must not be null");
        Objects.requireNonNull(loadPenalty, "loadPenalty must not be null");

        return weightedShippingCost(shippingCost)
                .add(weightedEta(etaHours))
                .add(weightedLoad(loadPenalty))
                .setScale(SCORE_SCALE, RoundingMode.HALF_UP);
    }

    @Override
    public BigDecimal scorePlan(
            BigDecimal totalShippingCost,
            int maxEtaHours,
            BigDecimal totalLoadPenalty,
            int warehouseCount) {
        Objects.requireNonNull(totalShippingCost, "totalShippingCost must not be null");
        Objects.requireNonNull(totalLoadPenalty, "totalLoadPenalty must not be null");

        return weightedShippingCost(totalShippingCost)
                .add(weightedEta(maxEtaHours))
                .add(weightedLoad(totalLoadPenalty))
                .add(calculateSplitShipmentPenalty(warehouseCount))
                .setScale(SCORE_SCALE, RoundingMode.HALF_UP);
    }

    @Override
    public ScoreBreakdown scoreWarehouseBreakdown(
            double distanceKilometers,
            BigDecimal shippingCost,
            int etaHours,
            BigDecimal loadPenalty,
            BigDecimal inventoryPenalty) {
        Objects.requireNonNull(shippingCost, "shippingCost must not be null");
        Objects.requireNonNull(loadPenalty, "loadPenalty must not be null");
        Objects.requireNonNull(inventoryPenalty, "inventoryPenalty must not be null");

        BigDecimal distanceScore = BigDecimal.valueOf(distanceKilometers)
                .multiply(weights.getEtaWeight())
                .setScale(SCORE_SCALE, RoundingMode.HALF_UP);
        BigDecimal shippingCostScore = weightedShippingCost(shippingCost);
        BigDecimal inventoryScore = inventoryPenalty.setScale(SCORE_SCALE, RoundingMode.HALF_UP);
        BigDecimal warehouseLoadScore = weightedLoad(loadPenalty);
        BigDecimal totalScore = shippingCostScore
                .add(weightedEta(etaHours))
                .add(warehouseLoadScore)
                .setScale(SCORE_SCALE, RoundingMode.HALF_UP);

        return new ScoreBreakdown(
                distanceScore, shippingCostScore, inventoryScore, warehouseLoadScore, totalScore);
    }

    @Override
    public ScoreWeights getWeights() {
        return weights;
    }

    private BigDecimal weightedShippingCost(BigDecimal shippingCost) {
        return shippingCost.multiply(weights.getShippingWeight()).setScale(SCORE_SCALE, RoundingMode.HALF_UP);
    }

    private BigDecimal weightedEta(int etaHours) {
        return BigDecimal.valueOf(etaHours)
                .multiply(weights.getEtaWeight())
                .setScale(SCORE_SCALE, RoundingMode.HALF_UP);
    }

    private BigDecimal weightedLoad(BigDecimal loadPenalty) {
        return loadPenalty.multiply(weights.getLoadWeight()).setScale(SCORE_SCALE, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateSplitShipmentPenalty(int warehouseCount) {
        if (warehouseCount <= 1) {
            return BigDecimal.ZERO;
        }
        return weights.getSplitShipmentPenalty().multiply(BigDecimal.valueOf(warehouseCount - 1L));
    }
}
