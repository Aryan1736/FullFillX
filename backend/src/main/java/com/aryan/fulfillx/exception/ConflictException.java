package com.aryan.fulfillx.exception;

import org.springframework.http.HttpStatus;

public class ConflictException extends FulfillxException {

    public ConflictException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}
