package com.aryan.fulfillx.exception;

import java.util.UUID;

public class ResourceNotFoundException extends FulfillxException {

    public ResourceNotFoundException(String resourceName, UUID id) {
        super(String.format("%s not found with id: %s", resourceName, id));
    }
}
