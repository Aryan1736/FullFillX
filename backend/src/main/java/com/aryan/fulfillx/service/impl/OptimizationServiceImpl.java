package com.aryan.fulfillx.service.impl;

import com.aryan.fulfillx.algorithm.engine.OptimizationEngine;
import com.aryan.fulfillx.algorithm.model.OptimizationRequest;
import com.aryan.fulfillx.algorithm.model.OptimizationResult;
import com.aryan.fulfillx.dto.request.OptimizationRequestDto;
import com.aryan.fulfillx.dto.response.OptimizationResponseDto;
import com.aryan.fulfillx.mapper.OptimizationMapper;
import com.aryan.fulfillx.service.OptimizationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OptimizationServiceImpl implements OptimizationService {

    private final OptimizationEngine optimizationEngine;
    private final OptimizationMapper optimizationMapper;

    @Override
    public OptimizationResponseDto run(OptimizationRequestDto request) {
        log.info(
                "event=optimization_started orderId={} orderLineCount={} warehouseCandidateCount={}",
                request.getOrderId(),
                request.getOrderLines().size(),
                request.getWarehouseAvailabilities().size());
        OptimizationRequest optimizationRequest = optimizationMapper.toRequest(request);
        OptimizationResult result = optimizationEngine.optimize(optimizationRequest);
        log.info(
                "event=optimization_completed orderId={} strategy={} score={} selectedWarehouseCount={} shippingCost={} estimatedDeliveryHours={}",
                request.getOrderId(),
                result.getStrategyName(),
                result.getOptimizationScore(),
                result.getSelectedWarehouses().size(),
                result.getTotalShippingCost(),
                result.getEstimatedDeliveryHours());
        return optimizationMapper.toResponse(result);
    }
}
