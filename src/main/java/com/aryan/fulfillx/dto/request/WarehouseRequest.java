package com.aryan.fulfillx.dto.request;

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
public class WarehouseRequest {

    @NotBlank(message = "{warehouse.name.required}")
    @Size(max = 255, message = "{warehouse.name.size}")
    private String name;

    @NotBlank(message = "{warehouse.city.required}")
    @Size(max = 100, message = "{warehouse.city.size}")
    private String city;

    @NotNull(message = "{warehouse.latitude.required}")
    @DecimalMin(value = "-90.0", message = "{validation.latitude.range}")
    @DecimalMax(value = "90.0", message = "{validation.latitude.range}")
    private Double latitude;

    @NotNull(message = "{warehouse.longitude.required}")
    @DecimalMin(value = "-180.0", message = "{validation.longitude.range}")
    @DecimalMax(value = "180.0", message = "{validation.longitude.range}")
    private Double longitude;

    @NotNull(message = "{warehouse.capacity.required}")
    @Min(value = 0, message = "{warehouse.capacity.min}")
    private Integer capacity;

    @NotNull(message = "{warehouse.currentLoad.required}")
    @Min(value = 0, message = "{warehouse.currentLoad.min}")
    private Integer currentLoad;

    private Boolean active;
}
