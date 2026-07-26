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
public class AllocationItemRequest {

    private UUID allocationId;

    @NotNull(message = "{allocationItem.warehouseId.required}")
    private UUID warehouseId;

    @NotNull(message = "{allocationItem.productId.required}")
    private UUID productId;

    @NotNull(message = "{allocationItem.quantity.required}")
    @Min(value = 1, message = "{allocationItem.quantity.min}")
    private Integer quantity;
}
