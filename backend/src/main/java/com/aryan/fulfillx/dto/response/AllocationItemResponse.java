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
public class AllocationItemResponse {

    private UUID id;
    private UUID allocationId;
    private UUID warehouseId;
    private UUID productId;
    private Integer quantity;
    private Instant createdAt;
    private Instant updatedAt;
}
