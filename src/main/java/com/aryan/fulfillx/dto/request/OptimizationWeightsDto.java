package com.aryan.fulfillx.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(name = "OptimizationWeights", description = "Relative weights for optimization scoring factors")
public class OptimizationWeightsDto {

    @Schema(description = "Weight for distance factor", example = "0.35")
    @NotNull(message = "{optimizationWeights.distanceWeight.required}")
    @DecimalMin(value = "0.0", inclusive = true, message = "{optimizationWeights.distanceWeight.min}")
    private BigDecimal distanceWeight;

    @Schema(description = "Weight for shipping cost factor", example = "0.25")
    @NotNull(message = "{optimizationWeights.shippingCostWeight.required}")
    @DecimalMin(value = "0.0", inclusive = true, message = "{optimizationWeights.shippingCostWeight.min}")
    private BigDecimal shippingCostWeight;

    @Schema(description = "Weight for inventory availability factor", example = "0.25")
    @NotNull(message = "{optimizationWeights.inventoryWeight.required}")
    @DecimalMin(value = "0.0", inclusive = true, message = "{optimizationWeights.inventoryWeight.min}")
    private BigDecimal inventoryWeight;

    @Schema(description = "Weight for warehouse load factor", example = "0.15")
    @NotNull(message = "{optimizationWeights.warehouseLoadWeight.required}")
    @DecimalMin(value = "0.0", inclusive = true, message = "{optimizationWeights.warehouseLoadWeight.min}")
    private BigDecimal warehouseLoadWeight;
}
