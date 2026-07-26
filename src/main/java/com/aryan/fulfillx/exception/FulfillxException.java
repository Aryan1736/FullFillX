package com.aryan.fulfillx.exception;

public abstract class FulfillxException extends RuntimeException {

    protected FulfillxException(String message) {
        super(message);
    }
}
