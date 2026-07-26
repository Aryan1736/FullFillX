package com.aryan.fulfillx.dto.response;

import com.aryan.fulfillx.entity.OrderStatus;
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
public class OrderStatusCountDto {

    private OrderStatus status;
    private Long count;
}
