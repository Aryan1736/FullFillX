package com.aryan.fulfillx.dto.request;

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
public class OptimizationWarehouseAvailabilityDto {

    @NotNull(message = "{optimizationWarehouse.warehouseId.required}")
    private UUID warehouseId;

    @NotBlank(message = "{optimizationWarehouse.warehouseName.required}")
    private String warehouseName;

    @NotNull(message = "{optimizationWarehouse.latitude.required}")
    private Double latitude;

    @NotNull(message = "{optimizationWarehouse.longitude.required}")
    private Double longitude;

    @NotNull(message = "{optimizationWarehouse.capacity.required}")
    @Min(value = 1, message = "{optimizationWarehouse.capacity.min}")
    private Integer capacity;

    @NotNull(message = "{optimizationWarehouse.currentLoad.required}")
    @Min(value = 0, message = "{optimizationWarehouse.currentLoad.min}")
    private Integer currentLoad;

    @NotEmpty(message = "{optimizationWarehouse.stock.notEmpty}")
    private Map<UUID, Integer> availableStockByProductId;
}
