package com.aryan.fulfillx.controller;

import com.aryan.fulfillx.config.OpenApiExamples;
import com.aryan.fulfillx.dto.request.CustomerRequest;
import com.aryan.fulfillx.dto.response.ApiResponse;
import com.aryan.fulfillx.dto.response.CustomerResponse;
import com.aryan.fulfillx.dto.response.PageResponse;
import com.aryan.fulfillx.service.CustomerService;
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
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@Tag(name = "Customers", description = "Customer master data and delivery locations")
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    @Operation(summary = "Create a customer", description = "Registers a new customer with delivery location coordinates")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            required = true,
            description = "Customer details",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = CustomerRequest.class),
                    examples = @ExampleObject(name = "Standard customer", value = OpenApiExamples.CUSTOMER_REQUEST)))
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "201",
                description = "Customer created",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Created customer", value = OpenApiExamples.CUSTOMER_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "400",
                description = "Invalid request",
                ref = "#/components/responses/BadRequest")
    })
    public ResponseEntity<ApiResponse<CustomerResponse>> create(@Valid @RequestBody CustomerRequest request) {
        log.info("Creating customer: {}", request.getName());
        CustomerResponse response = customerService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Customer created successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a customer by ID", description = "Returns a single customer by UUID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Customer found",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Customer detail", value = OpenApiExamples.CUSTOMER_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<ApiResponse<CustomerResponse>> getById(
            @Parameter(description = "Customer ID", example = OpenApiExamples.CUSTOMER_ID) @PathVariable UUID id) {
        log.info("Fetching customer: {}", id);
        return ResponseEntity.ok(ApiResponse.success(customerService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "List customers", description = "Returns a paginated, sortable customer list")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Paginated customer list",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    examples = @ExampleObject(name = "Customer page", value = OpenApiExamples.PAGE_RESPONSE)))
    public ResponseEntity<ApiResponse<PageResponse<CustomerResponse>>> getAll(
            @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        log.info("Listing customers page={}, size={}, sort={}",
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort());
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(customerService.getAll(pageable))));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a customer", description = "Updates an existing customer by UUID")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            required = true,
            description = "Updated customer details",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = CustomerRequest.class),
                    examples = @ExampleObject(name = "Standard customer", value = OpenApiExamples.CUSTOMER_REQUEST)))
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Customer updated",
                content = @Content(
                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                        examples = @ExampleObject(name = "Updated customer", value = OpenApiExamples.CUSTOMER_RESPONSE))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request", ref = "#/components/responses/BadRequest"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<ApiResponse<CustomerResponse>> update(
            @Parameter(description = "Customer ID", example = OpenApiExamples.CUSTOMER_ID) @PathVariable UUID id,
            @Valid @RequestBody CustomerRequest request) {
        log.info("Updating customer: {}", id);
        return ResponseEntity.ok(ApiResponse.success("Customer updated successfully", customerService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a customer", description = "Permanently removes a customer by UUID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Customer deleted"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer not found", ref = "#/components/responses/NotFound")
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "Customer ID", example = OpenApiExamples.CUSTOMER_ID) @PathVariable UUID id) {
        log.info("Deleting customer: {}", id);
        customerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
