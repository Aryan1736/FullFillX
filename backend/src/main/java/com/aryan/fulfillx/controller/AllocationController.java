package com.aryan.fulfillx.controller;

import com.aryan.fulfillx.config.OpenApiExamples;
import com.aryan.fulfillx.dto.request.AllocationFilterRequest;
import com.aryan.fulfillx.dto.request.AllocationRequest;
import com.aryan.fulfillx.dto.response.AllocationDetailResponse;
import com.aryan.fulfillx.dto.response.AllocationResponse;
import com.aryan.fulfillx.dto.response.ApiResponse;
import com.aryan.fulfillx.dto.response.PageResponse;
import com.aryan.fulfillx.service.AllocationHistoryService;
import com.aryan.fulfillx.service.AllocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/allocations")
@RequiredArgsConstructor
@Tag(name = "Allocations", description = "Fulfillment allocation records and history")
public class AllocationController {

    private final AllocationService allocationService;
    private final AllocationHistoryService allocationHistoryService;

    @PostMapping
    @Operation(summary = "Create an allocation", description = "Persists a fulfillment allocation for an order")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            required = true,
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = AllocationRequest.class),
                    examples = @ExampleObject(name = "Single-warehouse allocation", value = OpenApiExamples.ALLOCATION_REQUEST)))
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "201",
                description = "Allocation created",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Created allocation", value = OpenApiExamples.ALLOCATION_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request", ref = "#/components/responses/BadRequest"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Order, warehouse, or product not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<ApiResponse<AllocationResponse>> create(@Valid @RequestBody AllocationRequest request) {
        log.info("Creating allocation for order {}", request.getOrderId());
        AllocationResponse response = allocationService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Allocation created successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get allocation history by ID", description = "Returns detailed allocation history including scoring breakdown")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Allocation found",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Allocation detail", value = OpenApiExamples.ALLOCATION_DETAIL_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Allocation not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<ApiResponse<AllocationDetailResponse>> getById(
            @Parameter(description = "Allocation ID", example = OpenApiExamples.ALLOCATION_ID) @PathVariable UUID id) {
        log.info("Fetching allocation history: {}", id);
        return ResponseEntity.ok(ApiResponse.success(allocationHistoryService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "List allocation history", description = "Returns a paginated allocation history list")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Paginated allocation history",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    examples = @ExampleObject(name = "Allocation page", value = OpenApiExamples.PAGE_RESPONSE)))
    public ResponseEntity<ApiResponse<PageResponse<AllocationDetailResponse>>> getAll(
            @Valid @ModelAttribute AllocationFilterRequest filter,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Listing allocation history page={}, size={}, sort={}, filter={}",
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort(), filter);
        return ResponseEntity.ok(ApiResponse.success(
                PageResponse.from(allocationHistoryService.getAll(filter, pageable))));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an allocation", description = "Updates allocation metrics and line items")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            required = true,
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = AllocationRequest.class),
                    examples = @ExampleObject(name = "Single-warehouse allocation", value = OpenApiExamples.ALLOCATION_REQUEST)))
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Allocation updated",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Updated allocation", value = OpenApiExamples.ALLOCATION_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request", ref = "#/components/responses/BadRequest"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Allocation, order, warehouse, or product not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<ApiResponse<AllocationResponse>> update(
            @Parameter(description = "Allocation ID", example = OpenApiExamples.ALLOCATION_ID) @PathVariable UUID id,
            @Valid @RequestBody AllocationRequest request) {
        log.info("Updating allocation: {}", id);
        return ResponseEntity.ok(ApiResponse.success("Allocation updated successfully", allocationService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an allocation", description = "Permanently removes an allocation by UUID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Allocation deleted"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Allocation not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "Allocation ID", example = OpenApiExamples.ALLOCATION_ID) @PathVariable UUID id) {
        log.info("Deleting allocation: {}", id);
        allocationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
