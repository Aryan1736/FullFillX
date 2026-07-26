package com.aryan.fulfillx.dto.response;

import com.aryan.fulfillx.algorithm.model.ReasoningDecision;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptimizationReasoningDto {

    private ReasoningDecision decision;
    private UUID warehouseId;
    private String warehouseName;
    private UUID productId;
    private String message;
}
