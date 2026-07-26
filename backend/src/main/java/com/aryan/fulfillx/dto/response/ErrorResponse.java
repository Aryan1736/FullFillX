package com.aryan.fulfillx.dto.response;

import com.aryan.fulfillx.config.OpenApiExamples;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(name = "ErrorResponse", description = "Standard error response envelope")
public class ErrorResponse {

    @Schema(description = "Always false for errors", example = "false")
    private final boolean success;

    @Schema(description = "Error summary", example = "Validation failed")
    private final String message;

    @Schema(description = "HTTP status code", example = "400")
    private final int status;

    @Schema(description = "Error timestamp in ISO-8601 UTC", example = OpenApiExamples.TIMESTAMP)
    private final Instant timestamp;

    @Schema(description = "Request path", example = "/api/v1/customers")
    private final String path;

    @Schema(description = "Field-level validation errors")
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
