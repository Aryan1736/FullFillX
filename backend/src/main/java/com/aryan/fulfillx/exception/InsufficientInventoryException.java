package com.aryan.fulfillx.exception;

import java.util.UUID;
import org.springframework.http.HttpStatus;

public class InsufficientInventoryException extends FulfillxException {

    public InsufficientInventoryException(UUID warehouseId, UUID productId, int requestedQuantity, int availableQuantity) {
        super(
                String.format(
                        "Insufficient inventory at warehouse %s for product %s: requested %d, available %d",
                        warehouseId,
                        productId,
                        requestedQuantity,
                        availableQuantity),
                HttpStatus.CONFLICT);
    }

    public InsufficientInventoryException(UUID warehouseId, UUID productId) {
        super(
                String.format("No inventory record found at warehouse %s for product %s", warehouseId, productId),
                HttpStatus.CONFLICT);
    }
}
