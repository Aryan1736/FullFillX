package com.aryan.fulfillx.exception;

import org.springframework.http.HttpStatus;

public class InvalidSortFieldException extends FulfillxException {

    public InvalidSortFieldException(String field) {
        super("Invalid sort field: " + field, HttpStatus.BAD_REQUEST);
    }
}
