package com.aryan.fulfillx.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.aryan.fulfillx.dto.request.WarehouseRequest;
import com.aryan.fulfillx.dto.response.WarehouseResponse;
import com.aryan.fulfillx.exception.GlobalExceptionHandler;
import com.aryan.fulfillx.exception.ResourceNotFoundException;
import com.aryan.fulfillx.service.WarehouseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
@DisplayName("WarehouseController")
class WarehouseControllerTest {

    private static final UUID WAREHOUSE_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");

    @Mock
    private WarehouseService warehouseService;

    @InjectMocks
    private WarehouseController warehouseController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(warehouseController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("PUT /api/v1/warehouses/{id} returns 200 OK on valid update")
    void updateWarehouse_validRequest_returns200() throws Exception {
        WarehouseRequest request = WarehouseRequest.builder()
                .name("Bengaluru Hub Updated")
                .city("Bengaluru")
                .latitude(12.9716)
                .longitude(77.5946)
                .capacity(15000)
                .currentLoad(3000)
                .active(true)
                .build();

        WarehouseResponse response = WarehouseResponse.builder()
                .id(WAREHOUSE_ID)
                .name("Bengaluru Hub Updated")
                .city("Bengaluru")
                .latitude(12.9716)
                .longitude(77.5946)
                .capacity(15000)
                .currentLoad(3000)
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        when(warehouseService.update(eq(WAREHOUSE_ID), any(WarehouseRequest.class)))
                .thenReturn(response);

        mockMvc.perform(put("/api/v1/warehouses/{id}", WAREHOUSE_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(WAREHOUSE_ID.toString()))
                .andExpect(jsonPath("$.data.name").value("Bengaluru Hub Updated"))
                .andExpect(jsonPath("$.data.capacity").value(15000));

        verify(warehouseService).update(eq(WAREHOUSE_ID), any(WarehouseRequest.class));
    }

    @Test
    @DisplayName("PUT /api/v1/warehouses/{id} returns 400 Bad Request when validation fails")
    void updateWarehouse_invalidRequest_returns400() throws Exception {
        WarehouseRequest invalidRequest = WarehouseRequest.builder()
                .name("") // Blank name
                .city("Bengaluru")
                .latitude(195.0) // Invalid latitude
                .longitude(77.5946)
                .capacity(-10) // Negative capacity
                .currentLoad(0)
                .active(true)
                .build();

        mockMvc.perform(put("/api/v1/warehouses/{id}", WAREHOUSE_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("PUT /api/v1/warehouses/{id} returns 404 Not Found when warehouse does not exist")
    void updateWarehouse_notFound_returns404() throws Exception {
        WarehouseRequest request = WarehouseRequest.builder()
                .name("Bengaluru Hub")
                .city("Bengaluru")
                .latitude(12.9716)
                .longitude(77.5946)
                .capacity(15000)
                .currentLoad(3000)
                .active(true)
                .build();

        when(warehouseService.update(eq(WAREHOUSE_ID), any(WarehouseRequest.class)))
                .thenThrow(new ResourceNotFoundException("Warehouse", WAREHOUSE_ID));

        mockMvc.perform(put("/api/v1/warehouses/{id}", WAREHOUSE_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("DELETE /api/v1/warehouses/{id} returns 204 No Content on success")
    void deleteWarehouse_success_returns204() throws Exception {
        doNothing().when(warehouseService).delete(WAREHOUSE_ID);

        mockMvc.perform(delete("/api/v1/warehouses/{id}", WAREHOUSE_ID))
                .andExpect(status().isNoContent());

        verify(warehouseService).delete(WAREHOUSE_ID);
    }

    @Test
    @DisplayName("DELETE /api/v1/warehouses/{id} returns 404 Not Found when warehouse does not exist")
    void deleteWarehouse_notFound_returns404() throws Exception {
        doThrow(new ResourceNotFoundException("Warehouse", WAREHOUSE_ID))
                .when(warehouseService).delete(WAREHOUSE_ID);

        mockMvc.perform(delete("/api/v1/warehouses/{id}", WAREHOUSE_ID))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("DELETE /api/v1/warehouses/{id} returns 409 Conflict when referenced by allocations")
    void deleteWarehouse_referencedByAllocations_returns409() throws Exception {
        doThrow(new DataIntegrityViolationException(
                "could not execute statement; SQL [n/a]; constraint [fk_allocation_items_warehouse_id]"))
                .when(warehouseService).delete(WAREHOUSE_ID);

        mockMvc.perform(delete("/api/v1/warehouses/{id}", WAREHOUSE_ID))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Warehouse cannot be deleted because it is referenced by existing allocations"));
    }

    @Test
    @DisplayName("GET /api/v1/warehouses/{id} returns 200 OK")
    void getById_success_returns200() throws Exception {
        WarehouseResponse response = WarehouseResponse.builder()
                .id(WAREHOUSE_ID)
                .name("Bengaluru Hub")
                .city("Bengaluru")
                .latitude(12.9716)
                .longitude(77.5946)
                .capacity(15000)
                .currentLoad(3000)
                .active(true)
                .build();

        when(warehouseService.getById(WAREHOUSE_ID)).thenReturn(response);

        mockMvc.perform(get("/api/v1/warehouses/{id}", WAREHOUSE_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Bengaluru Hub"));
    }
}
