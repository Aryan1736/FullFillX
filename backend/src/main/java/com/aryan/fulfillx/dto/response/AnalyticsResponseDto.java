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

    private Long totalOrders;
    private Long totalWarehouses;
    private Long totalProducts;
    private Double inventoryUtilization;
    private Double warehouseUtilization;
    private BigDecimal averageShippingCost;
    private Double averageETA;
    private Long totalSplitShipments;
}
