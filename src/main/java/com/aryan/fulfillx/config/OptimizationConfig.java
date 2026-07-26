package com.aryan.fulfillx.config;

import com.aryan.fulfillx.algorithm.calculator.DefaultEtaCalculator;
import com.aryan.fulfillx.algorithm.calculator.DefaultScoreCalculator;
import com.aryan.fulfillx.algorithm.calculator.DefaultShippingCostCalculator;
import com.aryan.fulfillx.algorithm.calculator.DistanceCalculator;
import com.aryan.fulfillx.algorithm.calculator.EtaCalculator;
import com.aryan.fulfillx.algorithm.calculator.HaversineDistanceCalculator;
import com.aryan.fulfillx.algorithm.calculator.ScoreCalculator;
import com.aryan.fulfillx.algorithm.calculator.ShippingCostCalculator;
import com.aryan.fulfillx.algorithm.engine.OptimizationEngine;
import com.aryan.fulfillx.algorithm.strategy.OptimizationStrategy;
import com.aryan.fulfillx.algorithm.strategy.WeightedGreedyStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OptimizationConfig {

    @Bean
    public OptimizationEngine optimizationEngine() {
        DistanceCalculator distanceCalculator = new HaversineDistanceCalculator();
        ShippingCostCalculator shippingCostCalculator = new DefaultShippingCostCalculator();
        EtaCalculator etaCalculator = new DefaultEtaCalculator();
        ScoreCalculator scoreCalculator = new DefaultScoreCalculator();
        OptimizationStrategy strategy = new WeightedGreedyStrategy(
                distanceCalculator, shippingCostCalculator, etaCalculator, scoreCalculator);
        return new OptimizationEngine(strategy);
    }
}
