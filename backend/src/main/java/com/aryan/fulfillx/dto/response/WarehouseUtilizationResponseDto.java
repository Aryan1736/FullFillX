package com.aryan.fulfillx.dto.response;

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
public class WarehouseUtilizationResponseDto {

    private Double averageUtilizationPercentage;
    private List<WarehouseUtilizationItemDto> warehouses;
}
