package com.aryan.fulfillx.dto.request;

import com.aryan.fulfillx.config.OpenApiExamples;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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
@Schema(name = "OrderItemRequest", description = "Single line item within a customer order")
public class OrderItemRequest {

    @Schema(description = "Parent order ID (optional on create)", example = OpenApiExamples.ORDER_ID)
    private UUID orderId;

    @Schema(description = "Product ID", example = OpenApiExamples.PRODUCT_ID)
    @NotNull(message = "{orderItem.productId.required}")
    private UUID productId;

    @Schema(description = "Ordered quantity", example = "1")
    @NotNull(message = "{orderItem.quantity.required}")
    @Min(value = 1, message = "{orderItem.quantity.min}")
    private Integer quantity;
}
