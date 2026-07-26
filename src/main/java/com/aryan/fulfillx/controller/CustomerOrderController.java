package com.aryan.fulfillx.controller;

import com.aryan.fulfillx.dto.request.CustomerOrderRequest;
import com.aryan.fulfillx.dto.response.ApiResponse;
import com.aryan.fulfillx.dto.response.CustomerOrderResponse;
import com.aryan.fulfillx.dto.response.PageResponse;
import com.aryan.fulfillx.service.CustomerOrderService;
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
@RequestMapping("/api/v1/customer-orders")
@RequiredArgsConstructor
@Tag(name = "Customer Orders", description = "Customer order management APIs")
public class CustomerOrderController {

    private final CustomerOrderService customerOrderService;

    @PostMapping
    @Operation(summary = "Create a customer order")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Customer order created"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer or product not found")
    })
    public ResponseEntity<ApiResponse<CustomerOrderResponse>> create(@Valid @RequestBody CustomerOrderRequest request) {
        log.info("Creating customer order for customer {}", request.getCustomerId());
        CustomerOrderResponse response = customerOrderService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Customer order created successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a customer order by ID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Customer order found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer order not found")
    })
    public ResponseEntity<ApiResponse<CustomerOrderResponse>> getById(
            @Parameter(description = "Customer order ID") @PathVariable UUID id) {
        log.info("Fetching customer order: {}", id);
        return ResponseEntity.ok(ApiResponse.success(customerOrderService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "List customer orders with pagination and sorting")
    public ResponseEntity<ApiResponse<PageResponse<CustomerOrderResponse>>> getAll(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Listing customer orders page={}, size={}, sort={}",
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort());
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(customerOrderService.getAll(pageable))));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a customer order")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Customer order updated"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer order, customer, or product not found")
    })
    public ResponseEntity<ApiResponse<CustomerOrderResponse>> update(
            @Parameter(description = "Customer order ID") @PathVariable UUID id,
            @Valid @RequestBody CustomerOrderRequest request) {
        log.info("Updating customer order: {}", id);
        return ResponseEntity.ok(ApiResponse.success("Customer order updated successfully", customerOrderService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a customer order")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Customer order deleted"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer order not found")
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "Customer order ID") @PathVariable UUID id) {
        log.info("Deleting customer order: {}", id);
        customerOrderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
