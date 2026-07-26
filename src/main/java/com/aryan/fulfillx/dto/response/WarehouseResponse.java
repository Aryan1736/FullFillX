package com.aryan.fulfillx.dto.response;

import java.time.Instant;
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
public class WarehouseResponse {

    private UUID id;
    private String name;
    private String city;
    private Double latitude;
    private Double longitude;
    private Integer capacity;
    private Integer currentLoad;
    private Boolean active;
    private Instant createdAt;
    private Instant updatedAt;
}
