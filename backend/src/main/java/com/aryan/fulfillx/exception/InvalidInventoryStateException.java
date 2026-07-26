package com.aryan.fulfillx.exception;

import java.util.UUID;
import org.springframework.http.HttpStatus;

public class InvalidInventoryStateException extends FulfillxException {

    public InvalidInventoryStateException(UUID warehouseId, UUID productId, String reason) {
        super(
                String.format(
                        "Invalid inventory state at warehouse %s for product %s: %s",
                        warehouseId,
                        productId,
                        reason),
                HttpStatus.CONFLICT);
    }
}
