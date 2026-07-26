package com.aryan.fulfillx.dto.request;

import com.aryan.fulfillx.config.OpenApiExamples;
import com.aryan.fulfillx.entity.OrderStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Customer order list filters")
public class CustomerOrderFilterRequest {

    @Schema(description = "Filter by order status", example = "PENDING")
    private OrderStatus status;

    @Schema(description = "Filter by customer ID", example = OpenApiExamples.CUSTOMER_ID)
    private UUID customerId;
}
