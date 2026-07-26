package com.aryan.fulfillx.config;

import com.aryan.fulfillx.algorithm.calculator.ScoreWeights;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Externalized optimization scoring configuration bound from {@code application.yml}.
 */
@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "fulfillx.optimization")
public class OptimizationProperties {

    @Valid
    @NotNull
    private Weights weights = new Weights();

    /**
     * Converts configured weights into the plain algorithm {@link ScoreWeights} type.
     *
     * @return score weights used by {@link com.aryan.fulfillx.algorithm.calculator.ScoreCalculator}
     */
    public ScoreWeights toScoreWeights() {
        return new ScoreWeights(
                weights.getShippingWeight(),
                weights.getEtaWeight(),
                weights.getLoadWeight(),
                weights.getSplitShipmentPenalty());
    }

    @Getter
    @Setter
    public static class Weights {

        @NotNull
        @DecimalMin(value = "0.0", inclusive = true)
        private BigDecimal shippingWeight = BigDecimal.ONE;

        @NotNull
        @DecimalMin(value = "0.0", inclusive = true)
        private BigDecimal etaWeight = BigDecimal.ONE;

        @NotNull
        @DecimalMin(value = "0.0", inclusive = true)
        private BigDecimal loadWeight = BigDecimal.ONE;

        @NotNull
        @DecimalMin(value = "0.0", inclusive = true)
        private BigDecimal splitShipmentPenalty = BigDecimal.valueOf(100);
    }
}
