package com.aryan.fulfillx.dto.response;

import com.aryan.fulfillx.entity.OrderStatus;
import java.time.Instant;
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
public class CustomerOrderResponse {

    private UUID id;
    private UUID customerId;
    private OrderStatus status;
    private Integer totalItems;
    private List<OrderItemResponse> orderItems;
    private Instant createdAt;
    private Instant updatedAt;
}
