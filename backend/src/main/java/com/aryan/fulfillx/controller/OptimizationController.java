package com.aryan.fulfillx.controller;

import com.aryan.fulfillx.config.OpenApiExamples;
import com.aryan.fulfillx.dto.request.OptimizationRequestDto;
import com.aryan.fulfillx.dto.response.ApiResponse;
import com.aryan.fulfillx.dto.response.OptimizationResponseDto;
import com.aryan.fulfillx.service.OptimizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/optimization")
@RequiredArgsConstructor
@Tag(name = "Optimization", description = "Multi-factor warehouse selection engine")
public class OptimizationController {

    private final OptimizationService optimizationService;

    @PostMapping("/run")
    @Operation(
            summary = "Run warehouse optimization",
            description = "Scores warehouse candidates using distance, cost, inventory, and load weights")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            required = true,
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = OptimizationRequestDto.class),
                    examples = @ExampleObject(name = "Single-line order", value = OpenApiExamples.OPTIMIZATION_REQUEST)))
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Optimization completed",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Optimization result", value = OpenApiExamples.OPTIMIZATION_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request", ref = "#/components/responses/BadRequest")
    })
    public ResponseEntity<ApiResponse<OptimizationResponseDto>> run(@Valid @RequestBody OptimizationRequestDto request) {
        log.info("Running optimization for order {}", request.getOrderId());
        OptimizationResponseDto response = optimizationService.run(request);
        return ResponseEntity.ok(ApiResponse.success("Optimization completed successfully", response));
    }
}
