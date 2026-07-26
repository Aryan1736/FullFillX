package com.aryan.fulfillx.dto.request;

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
public class AllocationRequest {

    @NotNull
    private UUID orderId;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal optimizationScore;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal shippingCost;

    @NotNull
    @Min(0)
    private Integer estimatedDeliveryHours;

    @NotEmpty
    @Valid
    private List<AllocationItemRequest> allocationItems;
}
