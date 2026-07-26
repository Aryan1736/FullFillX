package com.aryan.fulfillx.controller;

import com.aryan.fulfillx.config.OpenApiExamples;
import com.aryan.fulfillx.dto.request.WarehouseFilterRequest;
import com.aryan.fulfillx.dto.request.WarehouseRequest;
import com.aryan.fulfillx.dto.response.ApiResponse;
import com.aryan.fulfillx.dto.response.PageResponse;
import com.aryan.fulfillx.dto.response.WarehouseResponse;
import com.aryan.fulfillx.service.WarehouseService;
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
@RequestMapping("/api/v1/warehouses")
@RequiredArgsConstructor
@Tag(name = "Warehouses", description = "Warehouse network and capacity management")
public class WarehouseController {

    private final WarehouseService warehouseService;

    @PostMapping
    @Operation(summary = "Create a warehouse", description = "Registers a new warehouse with location and capacity")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            required = true,
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = WarehouseRequest.class),
                    examples = @ExampleObject(name = "Fulfillment center", value = OpenApiExamples.WAREHOUSE_REQUEST)))
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "201",
                description = "Warehouse created",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Created warehouse", value = OpenApiExamples.WAREHOUSE_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request", ref = "#/components/responses/BadRequest")
    })
    public ResponseEntity<ApiResponse<WarehouseResponse>> create(@Valid @RequestBody WarehouseRequest request) {
        log.info("Creating warehouse: {}", request.getName());
        WarehouseResponse response = warehouseService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Warehouse created successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a warehouse by ID", description = "Returns a single warehouse by UUID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Warehouse found",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Warehouse detail", value = OpenApiExamples.WAREHOUSE_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Warehouse not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<ApiResponse<WarehouseResponse>> getById(
            @Parameter(description = "Warehouse ID", example = OpenApiExamples.WAREHOUSE_ID) @PathVariable UUID id) {
        log.info("Fetching warehouse: {}", id);
        return ResponseEntity.ok(ApiResponse.success(warehouseService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "List warehouses", description = "Returns a filtered, paginated warehouse list")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Paginated warehouse list",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    examples = @ExampleObject(name = "Warehouse page", value = OpenApiExamples.PAGE_RESPONSE)))
    public ResponseEntity<ApiResponse<PageResponse<WarehouseResponse>>> getAll(
            @ModelAttribute @Valid WarehouseFilterRequest filter,
            @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        log.info("Listing warehouses page={}, size={}, sort={}, filter={}",
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort(), filter);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(warehouseService.getAll(filter, pageable))));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a warehouse", description = "Updates an existing warehouse by UUID")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            required = true,
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = WarehouseRequest.class),
                    examples = @ExampleObject(name = "Fulfillment center", value = OpenApiExamples.WAREHOUSE_REQUEST)))
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Warehouse updated",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Updated warehouse", value = OpenApiExamples.WAREHOUSE_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request", ref = "#/components/responses/BadRequest"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Warehouse not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<ApiResponse<WarehouseResponse>> update(
            @Parameter(description = "Warehouse ID", example = OpenApiExamples.WAREHOUSE_ID) @PathVariable UUID id,
            @Valid @RequestBody WarehouseRequest request) {
        log.info("Updating warehouse: {}", id);
        return ResponseEntity.ok(ApiResponse.success("Warehouse updated successfully", warehouseService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a warehouse", description = "Permanently removes a warehouse by UUID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Warehouse deleted"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Warehouse not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "Warehouse ID", example = OpenApiExamples.WAREHOUSE_ID) @PathVariable UUID id) {
        log.info("Deleting warehouse: {}", id);
        warehouseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
