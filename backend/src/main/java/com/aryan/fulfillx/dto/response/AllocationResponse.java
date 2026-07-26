package com.aryan.fulfillx.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
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
public class AllocationResponse {

    private UUID id;
    private UUID orderId;
    private BigDecimal optimizationScore;
    private BigDecimal shippingCost;
    private Integer estimatedDeliveryHours;
    private List<AllocationItemResponse> allocationItems;
    private Instant createdAt;
    private Instant updatedAt;
}
