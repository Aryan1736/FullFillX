package com.aryan.fulfillx.service;

import com.aryan.fulfillx.dto.response.AnalyticsResponseDto;
import com.aryan.fulfillx.dto.response.InventoryStatusResponseDto;
import com.aryan.fulfillx.dto.response.ShippingCostAnalysisResponseDto;
import com.aryan.fulfillx.dto.response.WarehouseUtilizationResponseDto;

public interface AnalyticsService {

    AnalyticsResponseDto getAnalytics();

    WarehouseUtilizationResponseDto getWarehouseUtilization();

    InventoryStatusResponseDto getInventoryStatus();

    ShippingCostAnalysisResponseDto getShippingCostAnalysis();
}
