package com.aryan.fulfillx.dto.request;

import com.aryan.fulfillx.config.OpenApiExamples;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Inventory list filters")
public class InventoryFilterRequest {

    @Schema(description = "When true, return only low-stock records", example = "true")
    private Boolean lowStock;

    @Schema(description = "Filter by product ID", example = OpenApiExamples.PRODUCT_ID)
    private UUID productId;

    @Schema(description = "Filter by warehouse ID", example = OpenApiExamples.WAREHOUSE_ID)
    private UUID warehouseId;
}
