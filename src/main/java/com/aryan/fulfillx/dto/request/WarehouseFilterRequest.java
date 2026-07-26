package com.aryan.fulfillx.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Warehouse list filters")
public class WarehouseFilterRequest {

    @Size(max = 100)
    @Schema(description = "Filter by city (case-insensitive partial match)", example = "Kolkata")
    private String city;

    @Schema(description = "Filter by active status", example = "true")
    private Boolean active;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    @Schema(description = "Minimum utilization percentage (inclusive)", example = "20.0")
    private Double minUtilization;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    @Schema(description = "Maximum utilization percentage (inclusive)", example = "80.0")
    private Double maxUtilization;
}
