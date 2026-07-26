package com.aryan.fulfillx.dto.request;

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
public class OrderItemRequest {

    private UUID orderId;

    @NotNull(message = "{orderItem.productId.required}")
    private UUID productId;

    @NotNull(message = "{orderItem.quantity.required}")
    @Min(value = 1, message = "{orderItem.quantity.min}")
    private Integer quantity;
}
