package com.aryan.fulfillx.dto.response;

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
public class WarehouseUtilizationItemDto {

    private UUID warehouseId;
    private String warehouseName;
    private String city;
    private Integer capacity;
    private Integer currentLoad;
    private Double utilizationPercentage;
}
