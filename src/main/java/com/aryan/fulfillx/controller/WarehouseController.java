package com.aryan.fulfillx.controller;

import com.aryan.fulfillx.dto.request.WarehouseRequest;
import com.aryan.fulfillx.dto.response.WarehouseResponse;
import com.aryan.fulfillx.service.WarehouseService;
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
@RequestMapping("/api/v1/warehouses")
@RequiredArgsConstructor
@Tag(name = "Warehouses", description = "Warehouse management APIs")
public class WarehouseController {

    private final WarehouseService warehouseService;

    @PostMapping
    @Operation(summary = "Create a warehouse")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Warehouse created"),
        @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    public ResponseEntity<WarehouseResponse> create(@Valid @RequestBody WarehouseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(warehouseService.create(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a warehouse by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Warehouse found"),
        @ApiResponse(responseCode = "404", description = "Warehouse not found")
    })
    public ResponseEntity<WarehouseResponse> getById(
            @Parameter(description = "Warehouse ID") @PathVariable UUID id) {
        return ResponseEntity.ok(warehouseService.getById(id));
    }

    @GetMapping
    @Operation(summary = "List all warehouses")
    public ResponseEntity<List<WarehouseResponse>> getAll() {
        return ResponseEntity.ok(warehouseService.getAll());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a warehouse")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Warehouse updated"),
        @ApiResponse(responseCode = "400", description = "Invalid request"),
        @ApiResponse(responseCode = "404", description = "Warehouse not found")
    })
    public ResponseEntity<WarehouseResponse> update(
            @Parameter(description = "Warehouse ID") @PathVariable UUID id,
            @Valid @RequestBody WarehouseRequest request) {
        return ResponseEntity.ok(warehouseService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a warehouse")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Warehouse deleted"),
        @ApiResponse(responseCode = "404", description = "Warehouse not found")
    })
    public ResponseEntity<Void> delete(@Parameter(description = "Warehouse ID") @PathVariable UUID id) {
        warehouseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
