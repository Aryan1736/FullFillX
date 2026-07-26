package com.aryan.fulfillx.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class ProductRequest {

    @NotBlank(message = "{product.name.required}")
    @Size(max = 255, message = "{product.name.size}")
    private String name;

    @NotBlank(message = "{product.category.required}")
    @Size(max = 100, message = "{product.category.size}")
    private String category;

    @NotNull(message = "{product.weight.required}")
    @DecimalMin(value = "0.0", inclusive = true, message = "{product.weight.min}")
    private BigDecimal weight;
}
