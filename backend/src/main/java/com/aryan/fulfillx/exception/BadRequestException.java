package com.aryan.fulfillx.exception;

import org.springframework.http.HttpStatus;

public class BadRequestException extends FulfillxException {

    public BadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
