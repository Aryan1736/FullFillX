package com.aryan.fulfillx.dto.request;

import com.aryan.fulfillx.config.OpenApiExamples;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(name = "OptimizationRequest", description = "Input for the warehouse optimization engine")
public class OptimizationRequestDto {

    @Schema(description = "Customer order ID", example = OpenApiExamples.ORDER_ID)
    @NotNull(message = "{optimization.orderId.required}")
    private UUID orderId;

    @Schema(description = "Destination latitude", example = "22.5726")
    @NotNull(message = "{optimization.destinationLatitude.required}")
    private Double destinationLatitude;

    @Schema(description = "Destination longitude", example = "88.3639")
    @NotNull(message = "{optimization.destinationLongitude.required}")
    private Double destinationLongitude;

    @Schema(description = "Products and quantities to fulfill")
    @NotEmpty(message = "{optimization.orderLines.notEmpty}")
    @Valid
    private List<OptimizationOrderLineDto> orderLines;

    @Schema(description = "Candidate warehouses with stock availability")
    @NotEmpty(message = "{optimization.warehouseAvailabilities.notEmpty}")
    @Valid
    private List<OptimizationWarehouseAvailabilityDto> warehouseAvailabilities;

    @Schema(description = "Scoring weights for optimization factors")
    @NotNull(message = "{optimization.weights.required}")
    @Valid
    private OptimizationWeightsDto optimizationWeights;
}
