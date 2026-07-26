package com.aryan.fulfillx.dto.response;

import java.time.Instant;
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
public class InventoryResponse {

    private UUID id;
    private UUID warehouseId;
    private String warehouseName;
    private UUID productId;
    private String productName;
    private String sku;
    private Integer availableQuantity;
    private Integer reservedQuantity;
    private Boolean lowStock;
    private Instant createdAt;
    private Instant updatedAt;
}
