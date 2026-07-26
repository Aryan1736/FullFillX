package com.aryan.fulfillx.exception;

import org.springframework.http.HttpStatus;

public abstract class FulfillxException extends RuntimeException {

    private final HttpStatus status;

    protected FulfillxException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
