package com.aryan.fulfillx.controller;

import com.aryan.fulfillx.dto.request.InventoryRequest;
import com.aryan.fulfillx.dto.response.InventoryResponse;
import com.aryan.fulfillx.service.InventoryService;
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
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory", description = "Inventory management APIs")
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    @Operation(summary = "Create an inventory record")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Inventory record created"),
        @ApiResponse(responseCode = "400", description = "Invalid request"),
        @ApiResponse(responseCode = "404", description = "Warehouse or product not found")
    })
    public ResponseEntity<InventoryResponse> create(@Valid @RequestBody InventoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryService.create(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an inventory record by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inventory record found"),
        @ApiResponse(responseCode = "404", description = "Inventory record not found")
    })
    public ResponseEntity<InventoryResponse> getById(
            @Parameter(description = "Inventory ID") @PathVariable UUID id) {
        return ResponseEntity.ok(inventoryService.getById(id));
    }

    @GetMapping
    @Operation(summary = "List all inventory records")
    public ResponseEntity<List<InventoryResponse>> getAll() {
        return ResponseEntity.ok(inventoryService.getAll());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an inventory record")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inventory record updated"),
        @ApiResponse(responseCode = "400", description = "Invalid request"),
        @ApiResponse(responseCode = "404", description = "Inventory, warehouse, or product not found")
    })
    public ResponseEntity<InventoryResponse> update(
            @Parameter(description = "Inventory ID") @PathVariable UUID id,
            @Valid @RequestBody InventoryRequest request) {
        return ResponseEntity.ok(inventoryService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an inventory record")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Inventory record deleted"),
        @ApiResponse(responseCode = "404", description = "Inventory record not found")
    })
    public ResponseEntity<Void> delete(@Parameter(description = "Inventory ID") @PathVariable UUID id) {
        inventoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
