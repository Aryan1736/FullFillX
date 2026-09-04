package com.aryan.fulfillx.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.aryan.fulfillx.dto.response.ShippingCostTrendResponseDto;
import com.aryan.fulfillx.entity.Allocation;
import com.aryan.fulfillx.entity.CustomerOrder;
import com.aryan.fulfillx.repository.AllocationRepository;
import com.aryan.fulfillx.repository.CustomerOrderRepository;
import com.aryan.fulfillx.service.DashboardService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("Analytics Shipping Cost Trend Integration Tests")
class AnalyticsControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private CustomerOrderRepository customerOrderRepository;

    @Autowired
    private DashboardService dashboardService;

    @Test
    @DisplayName("findShippingCostTrend executes native query and dashboardService safely maps JDBC rows")
    void getShippingCostTrend_withRealAllocations_mapsSafely() {
        List<CustomerOrder> orders = customerOrderRepository.findAll();
        assertFalse(orders.isEmpty(), "Demo orders should be present from DataInitializer");

        CustomerOrder order1 = orders.get(0);
        CustomerOrder order2 = orders.get(1);

        Allocation allocation1 = Allocation.builder()
                .order(order1)
                .optimizationScore(new BigDecimal("95.5000"))
                .shippingCost(new BigDecimal("18.50"))
                .estimatedDeliveryHours(24)
                .strategyName("WEIGHTED_GREEDY")
                .build();

        Allocation allocation2 = Allocation.builder()
                .order(order2)
                .optimizationScore(new BigDecimal("90.0000"))
                .shippingCost(new BigDecimal("21.50"))
                .estimatedDeliveryHours(48)
                .strategyName("WEIGHTED_GREEDY")
                .build();

        allocationRepository.saveAll(List.of(allocation1, allocation2));
        allocationRepository.flush();

        // 1. Direct native query execution verification
        List<Object[]> rawRows = allocationRepository.findShippingCostTrend();
        assertFalse(rawRows.isEmpty());
        Object[] firstRow = rawRows.get(0);
        assertNotNull(firstRow[0], "trend_date should not be null");
        assertNotNull(firstRow[1], "average_shipping_cost should not be null");
        assertNotNull(firstRow[2], "allocation_count should not be null");

        // 2. Service-level verification
        ShippingCostTrendResponseDto serviceResult = dashboardService.getShippingCostTrend();
        assertNotNull(serviceResult);
        assertFalse(serviceResult.getTrend().isEmpty());
        assertEquals(2L, serviceResult.getTrend().get(0).getAllocationCount());
        assertEquals(0, new BigDecimal("20.00").compareTo(serviceResult.getTrend().get(0).getAverageShippingCost()));

        // 3. Controller endpoint regression verification
        try {
            mockMvc.perform(get("/api/v1/analytics/shipping-cost-trend")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.trend").isArray())
                    .andExpect(jsonPath("$.data.trend", hasSize(1)))
                    .andExpect(jsonPath("$.data.trend[0].date").isNotEmpty())
                    .andExpect(jsonPath("$.data.trend[0].averageShippingCost").value(20.0))
                    .andExpect(jsonPath("$.data.trend[0].allocationCount").value(2));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    @DisplayName("getShippingCostTrend returns empty trend when no allocations exist")
    void getShippingCostTrend_emptyAllocations_returnsEmptyTrend() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/shipping-cost-trend")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.trend").isArray());
    }

    @Test
    @DisplayName("getShippingCostTrend with valid date range returns filtered records")
    void getShippingCostTrend_withDateRange_returnsFilteredRecords() throws Exception {
        List<CustomerOrder> orders = customerOrderRepository.findAll();
        CustomerOrder order = orders.get(0);

        Allocation allocation = Allocation.builder()
                .order(order)
                .optimizationScore(new BigDecimal("88.0000"))
                .shippingCost(new BigDecimal("25.00"))
                .estimatedDeliveryHours(12)
                .strategyName("WEIGHTED_GREEDY")
                .build();

        allocationRepository.save(allocation);
        allocationRepository.flush();

        LocalDate today = LocalDate.now();
        String startDate = today.minusDays(7).format(DateTimeFormatter.ISO_DATE);
        String endDate = today.format(DateTimeFormatter.ISO_DATE);

        mockMvc.perform(get("/api/v1/analytics/shipping-cost-trend")
                        .param("startDate", startDate)
                        .param("endDate", endDate)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.trend").isArray())
                .andExpect(jsonPath("$.data.trend", hasSize(1)))
                .andExpect(jsonPath("$.data.trend[0].averageShippingCost").value(25.0))
                .andExpect(jsonPath("$.data.trend[0].allocationCount").value(1));
    }

    @Test
    @DisplayName("getShippingCostTrend with date range outside records returns empty array")
    void getShippingCostTrend_withDateRangeOutsideRecords_returnsEmpty() throws Exception {
        List<CustomerOrder> orders = customerOrderRepository.findAll();
        Allocation allocation = Allocation.builder()
                .order(orders.get(0))
                .optimizationScore(new BigDecimal("88.0000"))
                .shippingCost(new BigDecimal("25.00"))
                .estimatedDeliveryHours(12)
                .strategyName("WEIGHTED_GREEDY")
                .build();

        allocationRepository.save(allocation);
        allocationRepository.flush();

        mockMvc.perform(get("/api/v1/analytics/shipping-cost-trend")
                        .param("startDate", "2020-01-01")
                        .param("endDate", "2020-01-07")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.trend").isArray())
                .andExpect(jsonPath("$.data.trend", hasSize(0)));
    }

    @Test
    @DisplayName("getShippingCostTrend with startDate after endDate returns 400 Bad Request")
    void getShippingCostTrend_startDateAfterEndDate_returns400() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/shipping-cost-trend")
                        .param("startDate", "2026-09-10")
                        .param("endDate", "2026-09-01")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Start date cannot be after end date"));
    }

    @Test
    @DisplayName("getShippingCostTrend with only startDate returns 400 Bad Request")
    void getShippingCostTrend_onlyStartDate_returns400() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/shipping-cost-trend")
                        .param("startDate", "2026-09-01")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Both startDate and endDate must be provided for range filtering"));
    }

    @Test
    @DisplayName("getShippingCostTrend with invalid date format returns 400 Bad Request")
    void getShippingCostTrend_invalidDateFormat_returns400() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/shipping-cost-trend")
                        .param("startDate", "not-a-date")
                        .param("endDate", "2026-09-01")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
