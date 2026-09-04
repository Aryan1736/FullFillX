package com.aryan.fulfillx.exception;

import java.util.UUID;
import org.springframework.http.HttpStatus;

public class OrderAlreadyAllocatedException extends FulfillxException {

    public OrderAlreadyAllocatedException(UUID orderId) {
        super(String.format("Customer order %s has already been allocated", orderId), HttpStatus.CONFLICT);
    }
}
