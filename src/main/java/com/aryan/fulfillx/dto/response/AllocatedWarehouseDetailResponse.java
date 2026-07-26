package com.aryan.fulfillx.dto.response;

import java.math.BigDecimal;
import java.util.List;
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
public class AllocatedWarehouseDetailResponse {

    private WarehouseResponse warehouse;
    private List<AllocatedProductDetailResponse> products;
    private BigDecimal shippingCost;
    private Integer eta;
    private ScoreBreakdownDto scoreBreakdown;
}
