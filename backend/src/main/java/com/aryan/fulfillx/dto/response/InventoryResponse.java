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
    private UUID productId;
    private Integer availableQuantity;
    private Integer reservedQuantity;
    private Instant createdAt;
    private Instant updatedAt;
}
