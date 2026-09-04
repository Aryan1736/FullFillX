package com.aryan.fulfillx.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.aryan.fulfillx.dto.request.AllocationExecutionRequest;
import com.aryan.fulfillx.dto.response.AllocationResponse;
import com.aryan.fulfillx.dto.response.OptimizationResponseDto;
import com.aryan.fulfillx.dto.response.WarehouseCandidateDto;
import com.aryan.fulfillx.exception.GlobalExceptionHandler;
import com.aryan.fulfillx.exception.InsufficientInventoryException;
import com.aryan.fulfillx.exception.OrderAlreadyAllocatedException;
import com.aryan.fulfillx.exception.ResourceNotFoundException;
import com.aryan.fulfillx.service.AllocationExecutionService;
import com.aryan.fulfillx.service.AllocationHistoryService;
import com.aryan.fulfillx.service.AllocationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
@DisplayName("AllocationController")
class AllocationControllerTest {

    private static final UUID ORDER_ID = UUID.fromString("44444444-4444-4444-4444-444444444444");
    private static final UUID ALLOCATION_ID = UUID.fromString("66666666-6666-6666-6666-666666666666");
    private static final UUID WAREHOUSE_ID = UUID.fromString("33333333-3333-3333-3333-333333333333");
    private static final UUID PRODUCT_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");

    @Mock
    private AllocationService allocationService;

    @Mock
    private AllocationHistoryService allocationHistoryService;

    @Mock
    private AllocationExecutionService allocationExecutionService;

    @InjectMocks
    private AllocationController allocationController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(allocationController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("POST /api/v1/allocations/execute returns 201 Created on valid request")
    void execute_validRequest_returnsCreated() throws Exception {
        AllocationExecutionRequest request = sampleExecutionRequest();
        AllocationResponse response = AllocationResponse.builder()
                .id(ALLOCATION_ID)
                .orderId(ORDER_ID)
                .optimizationScore(BigDecimal.valueOf(87.5))
                .shippingCost(BigDecimal.valueOf(245.75))
                .estimatedDeliveryHours(36)
                .build();

        when(allocationExecutionService.execute(any(AllocationExecutionRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/allocations/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Allocation executed successfully"))
                .andExpect(jsonPath("$.data.id").value(ALLOCATION_ID.toString()))
                .andExpect(jsonPath("$.data.orderId").value(ORDER_ID.toString()))
                .andExpect(jsonPath("$.data.optimizationScore").value(87.5));

        verify(allocationExecutionService).execute(any(AllocationExecutionRequest.class));
    }

    @Test
    @DisplayName("POST /api/v1/allocations/execute returns 400 Bad Request when orderId is missing")
    void execute_missingOrderId_returnsBadRequest() throws Exception {
        AllocationExecutionRequest request = sampleExecutionRequest();
        request.setOrderId(null);

        mockMvc.perform(post("/api/v1/allocations/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/v1/allocations/execute returns 404 Not Found when order does not exist")
    void execute_orderNotFound_returnsNotFound() throws Exception {
        AllocationExecutionRequest request = sampleExecutionRequest();

        when(allocationExecutionService.execute(any(AllocationExecutionRequest.class)))
                .thenThrow(new ResourceNotFoundException("CustomerOrder", ORDER_ID));

        mockMvc.perform(post("/api/v1/allocations/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    @DisplayName("POST /api/v1/allocations/execute returns 409 Conflict when order is already allocated")
    void execute_orderAlreadyAllocated_returnsConflict() throws Exception {
        AllocationExecutionRequest request = sampleExecutionRequest();

        when(allocationExecutionService.execute(any(AllocationExecutionRequest.class)))
                .thenThrow(new OrderAlreadyAllocatedException(ORDER_ID));

        mockMvc.perform(post("/api/v1/allocations/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("Customer order " + ORDER_ID + " has already been allocated"));
    }

    @Test
    @DisplayName("POST /api/v1/allocations/execute returns 409 Conflict when inventory is insufficient")
    void execute_insufficientInventory_returnsConflict() throws Exception {
        AllocationExecutionRequest request = sampleExecutionRequest();

        when(allocationExecutionService.execute(any(AllocationExecutionRequest.class)))
                .thenThrow(new InsufficientInventoryException(WAREHOUSE_ID, PRODUCT_ID, 5, 2));

        mockMvc.perform(post("/api/v1/allocations/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }

    private AllocationExecutionRequest sampleExecutionRequest() {
        OptimizationResponseDto optimizationResult = OptimizationResponseDto.builder()
                .strategyName("WEIGHTED_GREEDY")
                .warehouseCandidates(List.of(
                        WarehouseCandidateDto.builder()
                                .warehouseId(WAREHOUSE_ID)
                                .warehouseName("Kolkata Fulfillment Center")
                                .allocatedQuantitiesByProductId(Map.of(PRODUCT_ID, 2))
                                .shippingCost(BigDecimal.valueOf(245.75))
                                .estimatedDeliveryHours(36)
                                .build()))
                .optimizationScore(BigDecimal.valueOf(87.5))
                .totalShippingCost(BigDecimal.valueOf(245.75))
                .estimatedDeliveryHours(36)
                .build();

        return AllocationExecutionRequest.builder()
                .orderId(ORDER_ID)
                .optimizationResult(optimizationResult)
                .build();
    }
}
