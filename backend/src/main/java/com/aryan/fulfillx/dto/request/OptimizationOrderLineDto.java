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
@Schema(name = "OptimizationOrderLine", description = "Product line to optimize fulfillment for")
public class OptimizationOrderLineDto {

    @Schema(description = "Product ID", example = OpenApiExamples.PRODUCT_ID)
    @NotNull(message = "{optimizationOrderLine.productId.required}")
    private UUID productId;

    @Schema(description = "Required quantity", example = "2")
    @NotNull(message = "{optimizationOrderLine.quantity.required}")
    @Min(value = 1, message = "{optimizationOrderLine.quantity.min}")
    private Integer quantity;
}
