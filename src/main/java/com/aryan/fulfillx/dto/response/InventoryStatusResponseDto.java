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
public class InventoryStatusResponseDto {

    private Long totalAvailableQuantity;
    private Long totalReservedQuantity;
    private Long totalQuantity;
    private Long inventoryRecordCount;
    private Long outOfStockCount;
    private Long lowStockCount;
    private List<InventoryStatusItemDto> items;
}
