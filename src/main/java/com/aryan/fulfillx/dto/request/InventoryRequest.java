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

    @NotNull
    private UUID warehouseId;

    @NotNull
    private UUID productId;

    @NotNull
    @Min(0)
    private Integer availableQuantity;

    @NotNull
    @Min(0)
    private Integer reservedQuantity;
}
