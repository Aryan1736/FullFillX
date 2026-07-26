package com.aryan.fulfillx.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Schema(name = "FieldErrorDetail", description = "Single field validation error")
public class FieldErrorDetail {

    @Schema(description = "Field name", example = "name")
    private final String field;

    @Schema(description = "Validation message", example = "Customer name is required")
    private final String message;

    @Schema(description = "Rejected input value")
    private final Object rejectedValue;
}
