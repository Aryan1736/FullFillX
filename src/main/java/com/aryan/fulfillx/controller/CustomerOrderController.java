package com.aryan.fulfillx.controller;

import com.aryan.fulfillx.dto.request.CustomerOrderRequest;
import com.aryan.fulfillx.dto.response.CustomerOrderResponse;
import com.aryan.fulfillx.service.CustomerOrderService;
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
@RequestMapping("/api/v1/customer-orders")
@RequiredArgsConstructor
@Tag(name = "Customer Orders", description = "Customer order management APIs")
public class CustomerOrderController {

    private final CustomerOrderService customerOrderService;

    @PostMapping
    @Operation(summary = "Create a customer order")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Customer order created"),
        @ApiResponse(responseCode = "400", description = "Invalid request"),
        @ApiResponse(responseCode = "404", description = "Customer or product not found")
    })
    public ResponseEntity<CustomerOrderResponse> create(@Valid @RequestBody CustomerOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(customerOrderService.create(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a customer order by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Customer order found"),
        @ApiResponse(responseCode = "404", description = "Customer order not found")
    })
    public ResponseEntity<CustomerOrderResponse> getById(
            @Parameter(description = "Customer order ID") @PathVariable UUID id) {
        return ResponseEntity.ok(customerOrderService.getById(id));
    }

    @GetMapping
    @Operation(summary = "List all customer orders")
    public ResponseEntity<List<CustomerOrderResponse>> getAll() {
        return ResponseEntity.ok(customerOrderService.getAll());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a customer order")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Customer order updated"),
        @ApiResponse(responseCode = "400", description = "Invalid request"),
        @ApiResponse(responseCode = "404", description = "Customer order, customer, or product not found")
    })
    public ResponseEntity<CustomerOrderResponse> update(
            @Parameter(description = "Customer order ID") @PathVariable UUID id,
            @Valid @RequestBody CustomerOrderRequest request) {
        return ResponseEntity.ok(customerOrderService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a customer order")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Customer order deleted"),
        @ApiResponse(responseCode = "404", description = "Customer order not found")
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "Customer order ID") @PathVariable UUID id) {
        customerOrderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
