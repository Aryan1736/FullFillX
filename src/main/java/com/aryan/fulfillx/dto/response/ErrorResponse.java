package com.aryan.fulfillx.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ErrorResponse {

    private final String message;
    private final List<String> errors;

    public ErrorResponse(String message) {
        this(message, List.of());
    }
}
