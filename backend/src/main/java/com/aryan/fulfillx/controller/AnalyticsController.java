package com.aryan.fulfillx.controller;

import com.aryan.fulfillx.config.OpenApiExamples;
import com.aryan.fulfillx.dto.response.AnalyticsResponseDto;
import com.aryan.fulfillx.dto.response.ApiResponse;
import com.aryan.fulfillx.dto.response.InventoryStatusResponseDto;
import com.aryan.fulfillx.dto.response.OrdersByStatusResponseDto;
import com.aryan.fulfillx.dto.response.ShippingCostAnalysisResponseDto;
import com.aryan.fulfillx.dto.response.ShippingCostTrendResponseDto;
import com.aryan.fulfillx.dto.response.WarehouseUtilizationResponseDto;
import com.aryan.fulfillx.service.AnalyticsService;
import com.aryan.fulfillx.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Operational metrics and reporting")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final DashboardService dashboardService;

    @GetMapping("/analytics")
    @Operation(summary = "Get platform analytics summary", description = "Returns high-level KPIs across orders, inventory, and shipping")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Analytics summary",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    examples = @ExampleObject(name = "Platform analytics", value = OpenApiExamples.ANALYTICS_RESPONSE)))
    public ResponseEntity<ApiResponse<AnalyticsResponseDto>> getAnalytics() {
        log.info("Fetching analytics summary");
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getAnalytics()));
    }

    @GetMapping("/warehouse-utilization")
    @Operation(summary = "Get warehouse utilization metrics", description = "Returns capacity usage per warehouse")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Warehouse utilization report",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    examples = @ExampleObject(name = "Warehouse utilization", value = OpenApiExamples.WAREHOUSE_UTILIZATION_RESPONSE)))
    public ResponseEntity<ApiResponse<WarehouseUtilizationResponseDto>> getWarehouseUtilization() {
        log.info("Fetching warehouse utilization");
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getWarehouseUtilization()));
    }

    @GetMapping("/inventory-status")
    @Operation(summary = "Get inventory status breakdown", description = "Returns in-stock, low-stock, and out-of-stock counts")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Inventory status report",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    examples = @ExampleObject(name = "Inventory status", value = OpenApiExamples.INVENTORY_STATUS_RESPONSE)))
    public ResponseEntity<ApiResponse<InventoryStatusResponseDto>> getInventoryStatus() {
        log.info("Fetching inventory status");
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getInventoryStatus()));
    }

    @GetMapping("/shipping-cost-analysis")
    @Operation(summary = "Get shipping cost analysis", description = "Returns aggregate shipping cost statistics from allocations")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Shipping cost analysis",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    examples = @ExampleObject(name = "Shipping cost analysis", value = OpenApiExamples.SHIPPING_COST_ANALYSIS_RESPONSE)))
    public ResponseEntity<ApiResponse<ShippingCostAnalysisResponseDto>> getShippingCostAnalysis() {
        log.info("Fetching shipping cost analysis");
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getShippingCostAnalysis()));
    }

    @GetMapping("/analytics/orders-by-status")
    @Operation(summary = "Get order counts by status", description = "Returns order volume grouped by fulfillment status")
    public ResponseEntity<ApiResponse<OrdersByStatusResponseDto>> getOrdersByStatus() {
        log.info("Fetching orders by status");
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getOrdersByStatus()));
    }

    @GetMapping("/analytics/shipping-cost-trend")
    @Operation(summary = "Get shipping cost trend", description = "Returns daily average shipping cost over recent allocations")
    public ResponseEntity<ApiResponse<ShippingCostTrendResponseDto>> getShippingCostTrend() {
        log.info("Fetching shipping cost trend");
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getShippingCostTrend()));
    }
}
