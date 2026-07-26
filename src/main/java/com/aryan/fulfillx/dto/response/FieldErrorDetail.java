package com.aryan.fulfillx.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FieldErrorDetail {

    private final String field;
    private final String message;
    private final Object rejectedValue;
}
