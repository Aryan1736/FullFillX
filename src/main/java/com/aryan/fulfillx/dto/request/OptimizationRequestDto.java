package com.aryan.fulfillx.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
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
public class OptimizationRequestDto {

    @NotNull(message = "{optimization.orderId.required}")
    private UUID orderId;

    @NotNull(message = "{optimization.destinationLatitude.required}")
    private Double destinationLatitude;

    @NotNull(message = "{optimization.destinationLongitude.required}")
    private Double destinationLongitude;

    @NotEmpty(message = "{optimization.orderLines.notEmpty}")
    @Valid
    private List<OptimizationOrderLineDto> orderLines;

    @NotEmpty(message = "{optimization.warehouseAvailabilities.notEmpty}")
    @Valid
    private List<OptimizationWarehouseAvailabilityDto> warehouseAvailabilities;

    @NotNull(message = "{optimization.weights.required}")
    @Valid
    private OptimizationWeightsDto optimizationWeights;
}
