package com.aryan.fulfillx.dto.request;

import com.aryan.fulfillx.entity.OrderStatus;
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
public class CustomerOrderRequest {

    @NotNull
    private UUID customerId;

    private OrderStatus status;

    @NotNull
    @Min(0)
    private Integer totalItems;

    @NotEmpty
    @Valid
    private List<OrderItemRequest> orderItems;
}
