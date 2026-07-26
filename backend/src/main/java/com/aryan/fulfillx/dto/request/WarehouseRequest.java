package com.aryan.fulfillx.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
@Schema(name = "WarehouseRequest", description = "Payload for creating or updating a warehouse")
public class WarehouseRequest {

    @Schema(description = "Warehouse name", example = "Kolkata Fulfillment Center")
    @NotBlank(message = "{warehouse.name.required}")
    @Size(max = 255, message = "{warehouse.name.size}")
    private String name;

    @Schema(description = "Warehouse city", example = "Kolkata")
    @NotBlank(message = "{warehouse.city.required}")
    @Size(max = 100, message = "{warehouse.city.size}")
    private String city;

    @Schema(description = "Warehouse latitude", example = "22.5726")
    @NotNull(message = "{warehouse.latitude.required}")
    @DecimalMin(value = "-90.0", message = "{validation.latitude.range}")
    @DecimalMax(value = "90.0", message = "{validation.latitude.range}")
    private Double latitude;

    @Schema(description = "Warehouse longitude", example = "88.3639")
    @NotNull(message = "{warehouse.longitude.required}")
    @DecimalMin(value = "-180.0", message = "{validation.longitude.range}")
    @DecimalMax(value = "180.0", message = "{validation.longitude.range}")
    private Double longitude;

    @Schema(description = "Maximum storage capacity in units", example = "12000")
    @NotNull(message = "{warehouse.capacity.required}")
    @Min(value = 0, message = "{warehouse.capacity.min}")
    private Integer capacity;

    @Schema(description = "Current occupied load in units", example = "4200")
    @NotNull(message = "{warehouse.currentLoad.required}")
    @Min(value = 0, message = "{warehouse.currentLoad.min}")
    private Integer currentLoad;

    @Schema(description = "Whether the warehouse accepts new allocations", example = "true")
    private Boolean active;
}
