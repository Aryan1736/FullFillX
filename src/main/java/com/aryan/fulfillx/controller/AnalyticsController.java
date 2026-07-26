package com.aryan.fulfillx.controller;

import com.aryan.fulfillx.dto.response.AnalyticsResponseDto;
import com.aryan.fulfillx.dto.response.ApiResponse;
import com.aryan.fulfillx.dto.response.InventoryStatusResponseDto;
import com.aryan.fulfillx.dto.response.ShippingCostAnalysisResponseDto;
import com.aryan.fulfillx.dto.response.WarehouseUtilizationResponseDto;
import com.aryan.fulfillx.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Analytics and reporting APIs")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/analytics")
    @Operation(summary = "Get platform analytics summary")
    public ResponseEntity<ApiResponse<AnalyticsResponseDto>> getAnalytics() {
        log.info("Fetching analytics summary");
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getAnalytics()));
    }

    @GetMapping("/warehouse-utilization")
    @Operation(summary = "Get warehouse utilization metrics")
    public ResponseEntity<ApiResponse<WarehouseUtilizationResponseDto>> getWarehouseUtilization() {
        log.info("Fetching warehouse utilization");
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getWarehouseUtilization()));
    }

    @GetMapping("/inventory-status")
    @Operation(summary = "Get inventory status breakdown")
    public ResponseEntity<ApiResponse<InventoryStatusResponseDto>> getInventoryStatus() {
        log.info("Fetching inventory status");
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getInventoryStatus()));
    }

    @GetMapping("/shipping-cost-analysis")
    @Operation(summary = "Get shipping cost analysis")
    public ResponseEntity<ApiResponse<ShippingCostAnalysisResponseDto>> getShippingCostAnalysis() {
        log.info("Fetching shipping cost analysis");
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getShippingCostAnalysis()));
    }
}
