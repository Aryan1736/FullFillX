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
@Schema(name = "InventoryRequest", description = "Payload for creating or updating inventory stock")
public class InventoryRequest {

    @Schema(description = "Warehouse ID", example = OpenApiExamples.WAREHOUSE_ID)
    @NotNull(message = "{inventory.warehouseId.required}")
    private UUID warehouseId;

    @Schema(description = "Product ID", example = OpenApiExamples.PRODUCT_ID)
    @NotNull(message = "{inventory.productId.required}")
    private UUID productId;

    @Schema(description = "Units available for allocation", example = "150")
    @NotNull(message = "{inventory.availableQuantity.required}")
    @Min(value = 0, message = "{inventory.availableQuantity.min}")
    private Integer availableQuantity;

    @Schema(description = "Units reserved for pending orders", example = "10")
    @NotNull(message = "{inventory.reservedQuantity.required}")
    @Min(value = 0, message = "{inventory.reservedQuantity.min}")
    private Integer reservedQuantity;
}
