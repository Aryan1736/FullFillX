package com.aryan.fulfillx.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(name = "ProductRequest", description = "Payload for creating or updating a product")
public class ProductRequest {

    @Schema(description = "Product name", example = "Wireless Mouse")
    @NotBlank(message = "{product.name.required}")
    @Size(max = 255, message = "{product.name.size}")
    private String name;

    @Schema(description = "Product category", example = "Electronics")
    @NotBlank(message = "{product.category.required}")
    @Size(max = 100, message = "{product.category.size}")
    private String category;

    @Schema(description = "Product weight in kilograms", example = "0.25")
    @NotNull(message = "{product.weight.required}")
    @DecimalMin(value = "0.0", inclusive = true, message = "{product.weight.min}")
    private BigDecimal weight;
}
