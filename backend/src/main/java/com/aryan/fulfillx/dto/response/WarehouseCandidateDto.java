package com.aryan.fulfillx.dto.response;

import java.math.BigDecimal;
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
public class WarehouseCandidateDto {

    private UUID warehouseId;
    private String warehouseName;
    private Map<UUID, Integer> allocatedQuantitiesByProductId;
    private BigDecimal shippingCost;
    private Integer estimatedDeliveryHours;
    private ScoreBreakdownDto scoreBreakdown;
}
