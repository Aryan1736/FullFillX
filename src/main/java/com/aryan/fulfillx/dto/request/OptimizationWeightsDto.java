package com.aryan.fulfillx.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
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
public class OptimizationWeightsDto {

    @NotNull(message = "{optimizationWeights.distanceWeight.required}")
    @DecimalMin(value = "0.0", inclusive = true, message = "{optimizationWeights.distanceWeight.min}")
    private BigDecimal distanceWeight;

    @NotNull(message = "{optimizationWeights.shippingCostWeight.required}")
    @DecimalMin(value = "0.0", inclusive = true, message = "{optimizationWeights.shippingCostWeight.min}")
    private BigDecimal shippingCostWeight;

    @NotNull(message = "{optimizationWeights.inventoryWeight.required}")
    @DecimalMin(value = "0.0", inclusive = true, message = "{optimizationWeights.inventoryWeight.min}")
    private BigDecimal inventoryWeight;

    @NotNull(message = "{optimizationWeights.warehouseLoadWeight.required}")
    @DecimalMin(value = "0.0", inclusive = true, message = "{optimizationWeights.warehouseLoadWeight.min}")
    private BigDecimal warehouseLoadWeight;
}
