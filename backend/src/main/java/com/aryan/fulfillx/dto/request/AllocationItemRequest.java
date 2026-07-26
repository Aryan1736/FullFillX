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
@Schema(name = "AllocationItemRequest", description = "Product quantity allocated from a warehouse")
public class AllocationItemRequest {

    @Schema(description = "Parent allocation ID (optional on create)", example = OpenApiExamples.ALLOCATION_ID)
    private UUID allocationId;

    @Schema(description = "Source warehouse ID", example = OpenApiExamples.WAREHOUSE_ID)
    @NotNull(message = "{allocationItem.warehouseId.required}")
    private UUID warehouseId;

    @Schema(description = "Allocated product ID", example = OpenApiExamples.PRODUCT_ID)
    @NotNull(message = "{allocationItem.productId.required}")
    private UUID productId;

    @Schema(description = "Allocated quantity", example = "2")
    @NotNull(message = "{allocationItem.quantity.required}")
    @Min(value = 1, message = "{allocationItem.quantity.min}")
    private Integer quantity;
}
