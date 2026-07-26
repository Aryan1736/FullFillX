package com.aryan.fulfillx.dto.request;

import com.aryan.fulfillx.config.OpenApiExamples;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
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
@Schema(name = "OptimizationWarehouseAvailability", description = "Warehouse candidate with stock snapshot")
public class OptimizationWarehouseAvailabilityDto {

    @Schema(description = "Warehouse ID", example = OpenApiExamples.WAREHOUSE_ID)
    @NotNull(message = "{optimizationWarehouse.warehouseId.required}")
    private UUID warehouseId;

    @Schema(description = "Warehouse name", example = "Kolkata Fulfillment Center")
    @NotBlank(message = "{optimizationWarehouse.warehouseName.required}")
    private String warehouseName;

    @Schema(description = "Warehouse latitude", example = "22.5726")
    @NotNull(message = "{optimizationWarehouse.latitude.required}")
    private Double latitude;

    @Schema(description = "Warehouse longitude", example = "88.3639")
    @NotNull(message = "{optimizationWarehouse.longitude.required}")
    private Double longitude;

    @Schema(description = "Maximum capacity in units", example = "12000")
    @NotNull(message = "{optimizationWarehouse.capacity.required}")
    @Min(value = 1, message = "{optimizationWarehouse.capacity.min}")
    private Integer capacity;

    @Schema(description = "Current load in units", example = "4200")
    @NotNull(message = "{optimizationWarehouse.currentLoad.required}")
    @Min(value = 0, message = "{optimizationWarehouse.currentLoad.min}")
    private Integer currentLoad;

    @Schema(description = "Available stock keyed by product ID")
    @NotEmpty(message = "{optimizationWarehouse.stock.notEmpty}")
    private Map<UUID, Integer> availableStockByProductId;
}
