package com.aryan.fulfillx.controller;

import com.aryan.fulfillx.dto.request.InventoryRequest;
import com.aryan.fulfillx.dto.response.ApiResponse;
import com.aryan.fulfillx.dto.response.InventoryResponse;
import com.aryan.fulfillx.dto.response.PageResponse;
import com.aryan.fulfillx.service.InventoryService;
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
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory", description = "Inventory management APIs")
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    @Operation(summary = "Create an inventory record")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Inventory record created"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Warehouse or product not found")
    })
    public ResponseEntity<ApiResponse<InventoryResponse>> create(@Valid @RequestBody InventoryRequest request) {
        log.info("Creating inventory for warehouse {} and product {}",
                request.getWarehouseId(), request.getProductId());
        InventoryResponse response = inventoryService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Inventory record created successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an inventory record by ID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Inventory record found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Inventory record not found")
    })
    public ResponseEntity<ApiResponse<InventoryResponse>> getById(
            @Parameter(description = "Inventory ID") @PathVariable UUID id) {
        log.info("Fetching inventory record: {}", id);
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "List inventory records with pagination and sorting")
    public ResponseEntity<ApiResponse<PageResponse<InventoryResponse>>> getAll(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Listing inventory page={}, size={}, sort={}",
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort());
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(inventoryService.getAll(pageable))));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an inventory record")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Inventory record updated"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Inventory, warehouse, or product not found")
    })
    public ResponseEntity<ApiResponse<InventoryResponse>> update(
            @Parameter(description = "Inventory ID") @PathVariable UUID id,
            @Valid @RequestBody InventoryRequest request) {
        log.info("Updating inventory record: {}", id);
        return ResponseEntity.ok(ApiResponse.success("Inventory record updated successfully", inventoryService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an inventory record")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Inventory record deleted"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Inventory record not found")
    })
    public ResponseEntity<Void> delete(@Parameter(description = "Inventory ID") @PathVariable UUID id) {
        log.info("Deleting inventory record: {}", id);
        inventoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
