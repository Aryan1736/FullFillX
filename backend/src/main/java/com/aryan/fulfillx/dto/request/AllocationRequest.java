package com.aryan.fulfillx.dto.request;

import com.aryan.fulfillx.config.OpenApiExamples;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
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
@Schema(name = "AllocationRequest", description = "Payload for creating or updating a fulfillment allocation")
public class AllocationRequest {

    @Schema(description = "Customer order ID", example = OpenApiExamples.ORDER_ID)
    @NotNull(message = "{allocation.orderId.required}")
    private UUID orderId;

    @Schema(description = "Optimization score from the selection engine", example = "87.5")
    @NotNull(message = "{allocation.optimizationScore.required}")
    @DecimalMin(value = "0.0", inclusive = true, message = "{allocation.optimizationScore.min}")
    private BigDecimal optimizationScore;

    @Schema(description = "Estimated shipping cost", example = "245.75")
    @NotNull(message = "{allocation.shippingCost.required}")
    @DecimalMin(value = "0.0", inclusive = true, message = "{allocation.shippingCost.min}")
    private BigDecimal shippingCost;

    @Schema(description = "Estimated delivery time in hours", example = "36")
    @NotNull(message = "{allocation.estimatedDeliveryHours.required}")
    @Min(value = 0, message = "{allocation.estimatedDeliveryHours.min}")
    private Integer estimatedDeliveryHours;

    @Schema(description = "Warehouse-product allocation lines")
    @NotEmpty(message = "{allocation.allocationItems.notEmpty}")
    @Valid
    private List<AllocationItemRequest> allocationItems;
}
