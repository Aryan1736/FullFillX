package com.aryan.fulfillx.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(name = "CustomerRequest", description = "Payload for creating or updating a customer")
public class CustomerRequest {

    @Schema(description = "Customer display name", example = "Acme Logistics")
    @NotBlank(message = "{customer.name.required}")
    @Size(max = 255, message = "{customer.name.size}")
    private String name;

    @Schema(description = "Primary delivery city", example = "Kolkata")
    @NotBlank(message = "{customer.city.required}")
    @Size(max = 100, message = "{customer.city.size}")
    private String city;

    @Schema(description = "Delivery latitude", example = "22.5726")
    @NotNull(message = "{customer.latitude.required}")
    @DecimalMin(value = "-90.0", message = "{validation.latitude.range}")
    @DecimalMax(value = "90.0", message = "{validation.latitude.range}")
    private Double latitude;

    @Schema(description = "Delivery longitude", example = "88.3639")
    @NotNull(message = "{customer.longitude.required}")
    @DecimalMin(value = "-180.0", message = "{validation.longitude.range}")
    @DecimalMax(value = "180.0", message = "{validation.longitude.range}")
    private Double longitude;
}
