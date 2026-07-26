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
public class OptimizationOrderLineDto {

    @NotNull(message = "{optimizationOrderLine.productId.required}")
    private UUID productId;

    @NotNull(message = "{optimizationOrderLine.quantity.required}")
    @Min(value = 1, message = "{optimizationOrderLine.quantity.min}")
    private Integer quantity;
}
