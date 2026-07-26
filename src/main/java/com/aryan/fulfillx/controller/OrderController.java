package com.aryan.fulfillx.controller;

import com.aryan.fulfillx.config.OpenApiExamples;
import com.aryan.fulfillx.dto.response.AllocationDetailResponse;
import com.aryan.fulfillx.dto.response.ApiResponse;
import com.aryan.fulfillx.service.AllocationHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order-centric allocation lookups")
public class OrderController {

    private final AllocationHistoryService allocationHistoryService;

    @GetMapping("/{id}/allocation")
    @Operation(summary = "Get allocation for an order", description = "Returns the fulfillment allocation linked to an order")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Allocation found",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Order allocation", value = OpenApiExamples.ALLOCATION_DETAIL_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Order or allocation not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<ApiResponse<AllocationDetailResponse>> getAllocation(
            @Parameter(description = "Order ID", example = OpenApiExamples.ORDER_ID) @PathVariable UUID id) {
        log.info("Fetching allocation for order: {}", id);
        return ResponseEntity.ok(ApiResponse.success(allocationHistoryService.getByOrderId(id)));
    }
}
