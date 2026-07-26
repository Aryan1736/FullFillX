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
public class ShippingCostAnalysisResponseDto {

    private Long totalAllocations;
    private BigDecimal averageShippingCost;
    private BigDecimal minimumShippingCost;
    private BigDecimal maximumShippingCost;
    private BigDecimal totalShippingCost;
    private Double averageEstimatedDeliveryHours;
}
