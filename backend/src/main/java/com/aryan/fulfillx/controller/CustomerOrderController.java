package com.aryan.fulfillx.controller;

import com.aryan.fulfillx.config.OpenApiExamples;
import com.aryan.fulfillx.dto.request.CustomerOrderFilterRequest;
import com.aryan.fulfillx.dto.request.CustomerOrderRequest;
import com.aryan.fulfillx.dto.response.ApiResponse;
import com.aryan.fulfillx.dto.response.CustomerOrderResponse;
import com.aryan.fulfillx.dto.response.PageResponse;
import com.aryan.fulfillx.service.CustomerOrderService;
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
@RequestMapping("/api/v1/customer-orders")
@RequiredArgsConstructor
@Tag(name = "Customer Orders", description = "Customer order lifecycle management")
public class CustomerOrderController {

    private final CustomerOrderService customerOrderService;

    @PostMapping
    @Operation(summary = "Create a customer order", description = "Creates an order with one or more line items")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            required = true,
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = CustomerOrderRequest.class),
                    examples = @ExampleObject(name = "Multi-item order", value = OpenApiExamples.CUSTOMER_ORDER_REQUEST)))
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "201",
                description = "Customer order created",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Created order", value = OpenApiExamples.CUSTOMER_ORDER_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request", ref = "#/components/responses/BadRequest"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer or product not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<ApiResponse<CustomerOrderResponse>> create(@Valid @RequestBody CustomerOrderRequest request) {
        log.info("Creating customer order for customer {}", request.getCustomerId());
        CustomerOrderResponse response = customerOrderService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Customer order created successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a customer order by ID", description = "Returns a single order with line items")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Customer order found",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Order detail", value = OpenApiExamples.CUSTOMER_ORDER_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer order not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<ApiResponse<CustomerOrderResponse>> getById(
            @Parameter(description = "Customer order ID", example = OpenApiExamples.ORDER_ID) @PathVariable UUID id) {
        log.info("Fetching customer order: {}", id);
        return ResponseEntity.ok(ApiResponse.success(customerOrderService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "List customer orders", description = "Returns a filtered, paginated order list")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Paginated order list",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    examples = @ExampleObject(name = "Order page", value = OpenApiExamples.PAGE_RESPONSE)))
    public ResponseEntity<ApiResponse<PageResponse<CustomerOrderResponse>>> getAll(
            @Valid @ModelAttribute CustomerOrderFilterRequest filter,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Listing customer orders page={}, size={}, sort={}, filter={}",
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort(), filter);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(customerOrderService.getAll(filter, pageable))));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a customer order", description = "Updates order status and line items")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            required = true,
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = CustomerOrderRequest.class),
                    examples = @ExampleObject(name = "Multi-item order", value = OpenApiExamples.CUSTOMER_ORDER_REQUEST)))
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Customer order updated",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Updated order", value = OpenApiExamples.CUSTOMER_ORDER_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request", ref = "#/components/responses/BadRequest"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer order, customer, or product not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<ApiResponse<CustomerOrderResponse>> update(
            @Parameter(description = "Customer order ID", example = OpenApiExamples.ORDER_ID) @PathVariable UUID id,
            @Valid @RequestBody CustomerOrderRequest request) {
        log.info("Updating customer order: {}", id);
        return ResponseEntity.ok(ApiResponse.success("Customer order updated successfully", customerOrderService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a customer order", description = "Permanently removes an order by UUID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Customer order deleted"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer order not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "Customer order ID", example = OpenApiExamples.ORDER_ID) @PathVariable UUID id) {
        log.info("Deleting customer order: {}", id);
        customerOrderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
