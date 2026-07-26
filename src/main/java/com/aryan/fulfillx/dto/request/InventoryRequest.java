package com.aryan.fulfillx.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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
public class InventoryRequest {

    @NotNull(message = "{inventory.warehouseId.required}")
    private UUID warehouseId;

    @NotNull(message = "{inventory.productId.required}")
    private UUID productId;

    @NotNull(message = "{inventory.availableQuantity.required}")
    @Min(value = 0, message = "{inventory.availableQuantity.min}")
    private Integer availableQuantity;

    @NotNull(message = "{inventory.reservedQuantity.required}")
    @Min(value = 0, message = "{inventory.reservedQuantity.min}")
    private Integer reservedQuantity;
}
