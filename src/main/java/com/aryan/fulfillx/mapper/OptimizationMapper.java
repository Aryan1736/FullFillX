package com.aryan.fulfillx.mapper;

import com.aryan.fulfillx.algorithm.model.OptimizationRequest;
import com.aryan.fulfillx.algorithm.model.OptimizationResult;
import com.aryan.fulfillx.algorithm.model.ScoreBreakdown;
import com.aryan.fulfillx.algorithm.model.WarehouseCandidate;
import com.aryan.fulfillx.dto.request.OptimizationOrderLineDto;
import com.aryan.fulfillx.dto.request.OptimizationRequestDto;
import com.aryan.fulfillx.dto.request.OptimizationWarehouseAvailabilityDto;
import com.aryan.fulfillx.dto.request.OptimizationWeightsDto;
import com.aryan.fulfillx.dto.response.OptimizationResponseDto;
import com.aryan.fulfillx.dto.response.ScoreBreakdownDto;
import com.aryan.fulfillx.dto.response.WarehouseCandidateDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OptimizationMapper {

    OptimizationRequest toRequest(OptimizationRequestDto dto);

    OptimizationResponseDto toResponse(OptimizationResult result);

    OptimizationRequest.OrderLine toOrderLine(OptimizationOrderLineDto dto);

    OptimizationRequest.WarehouseAvailability toWarehouseAvailability(OptimizationWarehouseAvailabilityDto dto);

    OptimizationRequest.OptimizationWeights toOptimizationWeights(OptimizationWeightsDto dto);

    WarehouseCandidateDto toWarehouseCandidateDto(WarehouseCandidate candidate);

    ScoreBreakdownDto toScoreBreakdownDto(ScoreBreakdown scoreBreakdown);
}
