package com.aryan.fulfillx.service;

import com.aryan.fulfillx.dto.request.OptimizationRequestDto;
import com.aryan.fulfillx.dto.response.OptimizationResponseDto;

public interface OptimizationService {

    OptimizationResponseDto run(OptimizationRequestDto request);
}
