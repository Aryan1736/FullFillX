package com.aryan.fulfillx.controller;

import com.aryan.fulfillx.dto.request.AllocationRequest;
import com.aryan.fulfillx.dto.response.AllocationResponse;
import com.aryan.fulfillx.service.AllocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
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

@RestController
@RequestMapping("/api/v1/allocations")
@RequiredArgsConstructor
@Tag(name = "Allocations", description = "Allocation management APIs")
public class AllocationController {

    private final AllocationService allocationService;

    @PostMapping
    @Operation(summary = "Create an allocation")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Allocation created"),
        @ApiResponse(responseCode = "400", description = "Invalid request"),
        @ApiResponse(responseCode = "404", description = "Order, warehouse, or product not found")
    })
    public ResponseEntity<AllocationResponse> create(@Valid @RequestBody AllocationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(allocationService.create(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an allocation by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Allocation found"),
        @ApiResponse(responseCode = "404", description = "Allocation not found")
    })
    public ResponseEntity<AllocationResponse> getById(
            @Parameter(description = "Allocation ID") @PathVariable UUID id) {
        return ResponseEntity.ok(allocationService.getById(id));
    }

    @GetMapping
    @Operation(summary = "List all allocations")
    public ResponseEntity<List<AllocationResponse>> getAll() {
        return ResponseEntity.ok(allocationService.getAll());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an allocation")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Allocation updated"),
        @ApiResponse(responseCode = "400", description = "Invalid request"),
        @ApiResponse(responseCode = "404", description = "Allocation, order, warehouse, or product not found")
    })
    public ResponseEntity<AllocationResponse> update(
            @Parameter(description = "Allocation ID") @PathVariable UUID id,
            @Valid @RequestBody AllocationRequest request) {
        return ResponseEntity.ok(allocationService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an allocation")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Allocation deleted"),
        @ApiResponse(responseCode = "404", description = "Allocation not found")
    })
    public ResponseEntity<Void> delete(@Parameter(description = "Allocation ID") @PathVariable UUID id) {
        allocationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
