package com.aryan.fulfillx.controller;

import com.aryan.fulfillx.dto.request.AllocationRequest;
import com.aryan.fulfillx.dto.response.AllocationResponse;
import com.aryan.fulfillx.dto.response.ApiResponse;
import com.aryan.fulfillx.dto.response.PageResponse;
import com.aryan.fulfillx.service.AllocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
@Tag(name = "Allocations", description = "Allocation management APIs")
public class AllocationController {

    private final AllocationService allocationService;

    @PostMapping
    @Operation(summary = "Create an allocation")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Allocation created"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Order, warehouse, or product not found")
    })
    public ResponseEntity<ApiResponse<AllocationResponse>> create(@Valid @RequestBody AllocationRequest request) {
        log.info("Creating allocation for order {}", request.getOrderId());
        AllocationResponse response = allocationService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Allocation created successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an allocation by ID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Allocation found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Allocation not found")
    })
    public ResponseEntity<ApiResponse<AllocationResponse>> getById(
            @Parameter(description = "Allocation ID") @PathVariable UUID id) {
        log.info("Fetching allocation: {}", id);
        return ResponseEntity.ok(ApiResponse.success(allocationService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "List allocations with pagination and sorting")
    public ResponseEntity<ApiResponse<PageResponse<AllocationResponse>>> getAll(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Listing allocations page={}, size={}, sort={}",
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort());
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(allocationService.getAll(pageable))));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an allocation")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Allocation updated"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Allocation, order, warehouse, or product not found")
    })
    public ResponseEntity<ApiResponse<AllocationResponse>> update(
            @Parameter(description = "Allocation ID") @PathVariable UUID id,
            @Valid @RequestBody AllocationRequest request) {
        log.info("Updating allocation: {}", id);
        return ResponseEntity.ok(ApiResponse.success("Allocation updated successfully", allocationService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an allocation")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Allocation deleted"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Allocation not found")
    })
    public ResponseEntity<Void> delete(@Parameter(description = "Allocation ID") @PathVariable UUID id) {
        log.info("Deleting allocation: {}", id);
        allocationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
