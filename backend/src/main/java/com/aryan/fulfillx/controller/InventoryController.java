package com.aryan.fulfillx.controller;

import com.aryan.fulfillx.config.OpenApiExamples;
import com.aryan.fulfillx.dto.request.InventoryFilterRequest;
import com.aryan.fulfillx.dto.request.InventoryRequest;
import com.aryan.fulfillx.dto.response.ApiResponse;
import com.aryan.fulfillx.dto.response.InventoryResponse;
import com.aryan.fulfillx.dto.response.PageResponse;
import com.aryan.fulfillx.service.InventoryService;
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
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory", description = "Stock levels per warehouse and product")
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    @Operation(summary = "Create an inventory record", description = "Links a product to a warehouse with stock quantities")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            required = true,
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = InventoryRequest.class),
                    examples = @ExampleObject(name = "Warehouse stock", value = OpenApiExamples.INVENTORY_REQUEST)))
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "201",
                description = "Inventory record created",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Created inventory", value = OpenApiExamples.INVENTORY_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request", ref = "#/components/responses/BadRequest"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Warehouse or product not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<ApiResponse<InventoryResponse>> create(@Valid @RequestBody InventoryRequest request) {
        log.info("Creating inventory for warehouse {} and product {}",
                request.getWarehouseId(), request.getProductId());
        InventoryResponse response = inventoryService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Inventory record created successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an inventory record by ID", description = "Returns a single inventory record by UUID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Inventory record found",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Inventory detail", value = OpenApiExamples.INVENTORY_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Inventory record not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<ApiResponse<InventoryResponse>> getById(
            @Parameter(description = "Inventory ID", example = OpenApiExamples.INVENTORY_ID) @PathVariable UUID id) {
        log.info("Fetching inventory record: {}", id);
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "List inventory records", description = "Returns a filtered, paginated inventory list")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Paginated inventory list",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    examples = @ExampleObject(name = "Inventory page", value = OpenApiExamples.PAGE_RESPONSE)))
    public ResponseEntity<ApiResponse<PageResponse<InventoryResponse>>> getAll(
            @ModelAttribute InventoryFilterRequest filter,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Listing inventory page={}, size={}, sort={}, filter={}",
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort(), filter);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(inventoryService.getAll(filter, pageable))));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an inventory record", description = "Updates stock quantities for an inventory record")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            required = true,
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = InventoryRequest.class),
                    examples = @ExampleObject(name = "Warehouse stock", value = OpenApiExamples.INVENTORY_REQUEST)))
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Inventory record updated",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Updated inventory", value = OpenApiExamples.INVENTORY_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request", ref = "#/components/responses/BadRequest"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Inventory, warehouse, or product not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<ApiResponse<InventoryResponse>> update(
            @Parameter(description = "Inventory ID", example = OpenApiExamples.INVENTORY_ID) @PathVariable UUID id,
            @Valid @RequestBody InventoryRequest request) {
        log.info("Updating inventory record: {}", id);
        return ResponseEntity.ok(ApiResponse.success("Inventory record updated successfully", inventoryService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an inventory record", description = "Permanently removes an inventory record by UUID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Inventory record deleted"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Inventory record not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "Inventory ID", example = OpenApiExamples.INVENTORY_ID) @PathVariable UUID id) {
        log.info("Deleting inventory record: {}", id);
        inventoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
