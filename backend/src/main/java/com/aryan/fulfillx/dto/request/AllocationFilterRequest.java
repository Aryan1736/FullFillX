package com.aryan.fulfillx.dto.request;

import com.aryan.fulfillx.config.OpenApiExamples;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Allocation history list filters")
public class AllocationFilterRequest {

    @Schema(
            description = "Search by allocation ID, order ID, strategy name, or warehouse name",
            example = "multi-factor")
    @Size(max = 255)
    private String search;

    @Schema(description = "Filter by order ID", example = OpenApiExamples.ORDER_ID)
    private UUID orderId;

    @Schema(description = "Filter by warehouse ID", example = OpenApiExamples.WAREHOUSE_ID)
    private UUID warehouseId;
}
