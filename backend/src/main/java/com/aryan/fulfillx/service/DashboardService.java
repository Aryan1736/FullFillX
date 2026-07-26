package com.aryan.fulfillx.service;

import com.aryan.fulfillx.dto.response.OrdersByStatusResponseDto;
import com.aryan.fulfillx.dto.response.ShippingCostTrendResponseDto;

public interface DashboardService {

    OrdersByStatusResponseDto getOrdersByStatus();

    ShippingCostTrendResponseDto getShippingCostTrend();
}
