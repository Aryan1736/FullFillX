package com.aryan.fulfillx.service;

import com.aryan.fulfillx.algorithm.model.OptimizationResult;
import com.aryan.fulfillx.dto.response.AllocationResponse;
import java.util.UUID;

public interface AllocationExecutionService {

    AllocationResponse execute(UUID orderId, OptimizationResult optimizationResult);
}
