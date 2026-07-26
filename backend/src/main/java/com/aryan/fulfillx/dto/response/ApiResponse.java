package com.aryan.fulfillx.dto.response;

import com.aryan.fulfillx.config.OpenApiExamples;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(name = "ApiResponse", description = "Standard success response envelope")
public class ApiResponse<T> {

    @Schema(description = "Whether the request succeeded", example = "true")
    private final boolean success;

    @Schema(description = "Human-readable message", example = "Customer created successfully")
    private final String message;

    @Schema(description = "Response payload")
    private final T data;

    @Schema(description = "Response timestamp in ISO-8601 UTC", example = OpenApiExamples.TIMESTAMP)
    private final Instant timestamp;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> created(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }
}
