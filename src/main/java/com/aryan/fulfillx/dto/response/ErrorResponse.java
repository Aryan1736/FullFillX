package com.aryan.fulfillx.dto.response;

import java.time.Instant;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse {

    private final boolean success;
    private final String message;
    private final int status;
    private final Instant timestamp;
    private final String path;
    private final List<FieldErrorDetail> errors;

    public static ErrorResponse of(int status, String message, String path, List<FieldErrorDetail> errors) {
        return ErrorResponse.builder()
                .success(false)
                .status(status)
                .message(message)
                .path(path)
                .errors(errors == null || errors.isEmpty() ? List.of() : errors)
                .timestamp(Instant.now())
                .build();
    }
}
