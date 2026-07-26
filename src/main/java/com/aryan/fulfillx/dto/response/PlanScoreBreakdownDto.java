package com.aryan.fulfillx.dto.response;

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
public class PlanScoreBreakdownDto {

    private BigDecimal shippingCostScore;
    private BigDecimal etaScore;
    private BigDecimal warehouseLoadScore;
    private BigDecimal splitShipmentPenalty;
    private BigDecimal totalScore;
}
