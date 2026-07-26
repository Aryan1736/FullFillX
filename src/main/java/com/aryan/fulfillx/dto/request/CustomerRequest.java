package com.aryan.fulfillx.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
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
public class CustomerRequest {

    @NotBlank(message = "{customer.name.required}")
    @Size(max = 255, message = "{customer.name.size}")
    private String name;

    @NotBlank(message = "{customer.city.required}")
    @Size(max = 100, message = "{customer.city.size}")
    private String city;

    @NotNull(message = "{customer.latitude.required}")
    @DecimalMin(value = "-90.0", message = "{validation.latitude.range}")
    @DecimalMax(value = "90.0", message = "{validation.latitude.range}")
    private Double latitude;

    @NotNull(message = "{customer.longitude.required}")
    @DecimalMin(value = "-180.0", message = "{validation.longitude.range}")
    @DecimalMax(value = "180.0", message = "{validation.longitude.range}")
    private Double longitude;
}
