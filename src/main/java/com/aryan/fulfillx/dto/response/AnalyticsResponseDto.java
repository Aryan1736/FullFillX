package com.aryan.fulfillx.dto.response;

import java.math.BigDecimal;
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
public class AnalyticsResponseDto {

    private Long totalWarehouses;
    private Long totalProducts;
    private Long totalInventory;
    private Long totalOrders;
    private Double averageWarehouseLoad;
    private BigDecimal averageShippingCost;
    private Long totalAllocations;
}
