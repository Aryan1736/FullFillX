package com.aryan.fulfillx.dto.request;

import com.aryan.fulfillx.config.OpenApiExamples;
import com.aryan.fulfillx.entity.OrderStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "CustomerOrderRequest", description = "Payload for creating or updating a customer order")
public class CustomerOrderRequest {

    @Schema(description = "Customer ID", example = OpenApiExamples.CUSTOMER_ID)
    @NotNull(message = "{order.customerId.required}")
    private UUID customerId;

    @Schema(description = "Order status", example = "PENDING")
    private OrderStatus status;

    @Schema(description = "Total item count across all line items", example = "2")
    @NotNull(message = "{order.totalItems.required}")
    @Min(value = 0, message = "{order.totalItems.min}")
    private Integer totalItems;

    @Schema(description = "Order line items")
    @NotEmpty(message = "{order.orderItems.notEmpty}")
    @Valid
    private List<OrderItemRequest> orderItems;
}
