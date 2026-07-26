package com.aryan.fulfillx.controller;

import com.aryan.fulfillx.config.OpenApiExamples;
import com.aryan.fulfillx.dto.request.ProductRequest;
import com.aryan.fulfillx.dto.response.ApiResponse;
import com.aryan.fulfillx.dto.response.PageResponse;
import com.aryan.fulfillx.dto.response.ProductResponse;
import com.aryan.fulfillx.service.ProductService;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product catalog management")
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @Operation(summary = "Create a product", description = "Adds a new product to the catalog")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            required = true,
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = ProductRequest.class),
                    examples = @ExampleObject(name = "Electronics product", value = OpenApiExamples.PRODUCT_REQUEST)))
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "201",
                description = "Product created",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Created product", value = OpenApiExamples.PRODUCT_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request", ref = "#/components/responses/BadRequest")
    })
    public ResponseEntity<ApiResponse<ProductResponse>> create(@Valid @RequestBody ProductRequest request) {
        log.info("Creating product: {}", request.getName());
        ProductResponse response = productService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Product created successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a product by ID", description = "Returns a single product by UUID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Product found",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Product detail", value = OpenApiExamples.PRODUCT_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<ApiResponse<ProductResponse>> getById(
            @Parameter(description = "Product ID", example = OpenApiExamples.PRODUCT_ID) @PathVariable UUID id) {
        log.info("Fetching product: {}", id);
        return ResponseEntity.ok(ApiResponse.success(productService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "List products", description = "Returns a paginated, sortable product list")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Paginated product list",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    examples = @ExampleObject(name = "Product page", value = OpenApiExamples.PAGE_RESPONSE)))
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getAll(
            @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        log.info("Listing products page={}, size={}, sort={}",
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort());
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(productService.getAll(pageable))));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a product", description = "Updates an existing product by UUID")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            required = true,
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = ProductRequest.class),
                    examples = @ExampleObject(name = "Electronics product", value = OpenApiExamples.PRODUCT_REQUEST)))
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Product updated",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Updated product", value = OpenApiExamples.PRODUCT_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request", ref = "#/components/responses/BadRequest"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<ApiResponse<ProductResponse>> update(
            @Parameter(description = "Product ID", example = OpenApiExamples.PRODUCT_ID) @PathVariable UUID id,
            @Valid @RequestBody ProductRequest request) {
        log.info("Updating product: {}", id);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", productService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product", description = "Permanently removes a product by UUID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Product deleted"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "Product ID", example = OpenApiExamples.PRODUCT_ID) @PathVariable UUID id) {
        log.info("Deleting product: {}", id);
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
