package com.aryan.fulfillx.entity.snapshot;

import java.math.BigDecimal;
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
public class AllocationScoreBreakdown {

    private BigDecimal distanceScore;
    private BigDecimal shippingCostScore;
    private BigDecimal inventoryScore;
    private BigDecimal warehouseLoadScore;
    private BigDecimal totalScore;
}
