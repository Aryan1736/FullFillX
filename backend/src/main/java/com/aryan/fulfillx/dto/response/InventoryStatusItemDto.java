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
public class InventoryStatusItemDto {

    private UUID warehouseId;
    private String warehouseName;
    private UUID productId;
    private String productName;
    private Integer availableQuantity;
    private Integer reservedQuantity;
    private Integer totalQuantity;
    private String status;
}
