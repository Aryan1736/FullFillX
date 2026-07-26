package com.aryan.fulfillx.service.impl;

import com.aryan.fulfillx.dto.response.OrderStatusCountDto;
import com.aryan.fulfillx.dto.response.OrdersByStatusResponseDto;
import com.aryan.fulfillx.dto.response.ShippingCostTrendPointDto;
import com.aryan.fulfillx.dto.response.ShippingCostTrendResponseDto;
import com.aryan.fulfillx.entity.OrderStatus;
import com.aryan.fulfillx.repository.AllocationRepository;
import com.aryan.fulfillx.repository.CustomerOrderRepository;
import com.aryan.fulfillx.service.DashboardService;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardServiceImpl implements DashboardService {

    private final CustomerOrderRepository customerOrderRepository;
    private final AllocationRepository allocationRepository;

    @Override
    @Transactional(readOnly = true)
    public OrdersByStatusResponseDto getOrdersByStatus() {
        log.debug("Fetching orders grouped by status");

        Map<OrderStatus, Long> countsByStatus = new EnumMap<>(OrderStatus.class);
        Arrays.stream(OrderStatus.values()).forEach(status -> countsByStatus.put(status, 0L));

        customerOrderRepository.countOrdersByStatus().forEach(row -> {
            OrderStatus status = (OrderStatus) row[0];
            Long count = (Long) row[1];
            countsByStatus.put(status, count);
        });

        List<OrderStatusCountDto> statuses = Arrays.stream(OrderStatus.values())
                .map(status -> OrderStatusCountDto.builder()
                        .status(status)
                        .count(countsByStatus.get(status))
                        .build())
                .toList();

        long totalOrders = statuses.stream()
                .mapToLong(OrderStatusCountDto::getCount)
                .sum();

        return OrdersByStatusResponseDto.builder()
                .totalOrders(totalOrders)
                .statuses(statuses)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ShippingCostTrendResponseDto getShippingCostTrend() {
        log.debug("Fetching shipping cost trend");

        List<ShippingCostTrendPointDto> trend = allocationRepository.findShippingCostTrend().stream()
                .map(row -> ShippingCostTrendPointDto.builder()
                        .date(toLocalDate(row[0]))
                        .averageShippingCost((BigDecimal) row[1])
                        .allocationCount((Long) row[2])
                        .build())
                .toList();

        return ShippingCostTrendResponseDto.builder()
                .trend(trend)
                .build();
    }

    private LocalDate toLocalDate(Object value) {
        if (value instanceof LocalDate localDate) {
            return localDate;
        }
        if (value instanceof Date sqlDate) {
            return sqlDate.toLocalDate();
        }
        throw new IllegalArgumentException("Unsupported date type: " + value.getClass().getName());
    }
}
