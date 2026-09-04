package com.aryan.fulfillx.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.aryan.fulfillx.dto.response.ShippingCostTrendPointDto;
import com.aryan.fulfillx.dto.response.ShippingCostTrendResponseDto;
import com.aryan.fulfillx.exception.BadRequestException;
import com.aryan.fulfillx.repository.AllocationRepository;
import com.aryan.fulfillx.repository.CustomerOrderRepository;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@DisplayName("DashboardServiceImpl Shipping Cost Trend Tests")
class DashboardServiceImplTest {

    @Mock
    private CustomerOrderRepository customerOrderRepository;

    @Mock
    private AllocationRepository allocationRepository;

    @InjectMocks
    private DashboardServiceImpl dashboardService;

    @Test
    @DisplayName("getShippingCostTrend handles standard JDBC types correctly")
    void getShippingCostTrend_standardTypes_mappedCorrectly() {
        LocalDate date = LocalDate.of(2026, 9, 1);
        Date sqlDate = Date.valueOf(date);
        BigDecimal averageCost = new BigDecimal("15.75");
        Long count = 10L;

        when(allocationRepository.findShippingCostTrend())
                .thenReturn(Collections.singletonList(new Object[]{sqlDate, averageCost, count}));

        ShippingCostTrendResponseDto response = dashboardService.getShippingCostTrend();

        assertNotNull(response);
        assertEquals(1, response.getTrend().size());

        ShippingCostTrendPointDto point = response.getTrend().get(0);
        assertEquals(date, point.getDate());
        assertEquals(averageCost, point.getAverageShippingCost());
        assertEquals(10L, point.getAllocationCount());

        verify(allocationRepository).findShippingCostTrend();
    }

    @Test
    @DisplayName("getShippingCostTrend handles LocalDate directly from modern drivers")
    void getShippingCostTrend_localDate_mappedCorrectly() {
        LocalDate date = LocalDate.of(2026, 9, 2);
        BigDecimal averageCost = new BigDecimal("22.50");
        Long count = 5L;

        when(allocationRepository.findShippingCostTrend())
                .thenReturn(Collections.singletonList(new Object[]{date, averageCost, count}));

        ShippingCostTrendResponseDto response = dashboardService.getShippingCostTrend();

        assertNotNull(response);
        assertEquals(1, response.getTrend().size());
        assertEquals(date, response.getTrend().get(0).getDate());
    }

    @Test
    @DisplayName("getShippingCostTrend handles BigInteger count from PostgreSQL native queries")
    void getShippingCostTrend_bigIntegerCount_convertedSafely() {
        LocalDate date = LocalDate.of(2026, 9, 3);
        BigDecimal averageCost = new BigDecimal("12.00");
        BigInteger bigIntegerCount = new BigInteger("42");

        when(allocationRepository.findShippingCostTrend())
                .thenReturn(Collections.singletonList(new Object[]{date, averageCost, bigIntegerCount}));

        ShippingCostTrendResponseDto response = dashboardService.getShippingCostTrend();

        assertNotNull(response);
        assertEquals(1, response.getTrend().size());
        assertEquals(42L, response.getTrend().get(0).getAllocationCount());
    }

    @Test
    @DisplayName("getShippingCostTrend handles Integer count from drivers returning 32-bit integers")
    void getShippingCostTrend_integerCount_convertedSafely() {
        LocalDate date = LocalDate.of(2026, 9, 3);
        BigDecimal averageCost = new BigDecimal("8.50");
        Integer integerCount = 15;

        when(allocationRepository.findShippingCostTrend())
                .thenReturn(Collections.singletonList(new Object[]{date, averageCost, integerCount}));

        ShippingCostTrendResponseDto response = dashboardService.getShippingCostTrend();

        assertNotNull(response);
        assertEquals(1, response.getTrend().size());
        assertEquals(15L, response.getTrend().get(0).getAllocationCount());
    }

    @Test
    @DisplayName("getShippingCostTrend handles Double and Float for average shipping cost without precision issues")
    void getShippingCostTrend_doubleAndFloatAverageCost_convertedSafely() {
        LocalDate date1 = LocalDate.of(2026, 9, 1);
        Double doubleVal = 18.50;

        LocalDate date2 = LocalDate.of(2026, 9, 2);
        Float floatVal = 25.75f;

        when(allocationRepository.findShippingCostTrend())
                .thenReturn(List.of(
                        new Object[]{date1, doubleVal, 4L},
                        new Object[]{date2, floatVal, 6L}
                ));

        ShippingCostTrendResponseDto response = dashboardService.getShippingCostTrend();

        assertNotNull(response);
        assertEquals(2, response.getTrend().size());

        ShippingCostTrendPointDto point1 = response.getTrend().get(0);
        assertEquals(BigDecimal.valueOf(18.5), point1.getAverageShippingCost());
        assertEquals(4L, point1.getAllocationCount());

        ShippingCostTrendPointDto point2 = response.getTrend().get(1);
        assertEquals(BigDecimal.valueOf(25.75), point2.getAverageShippingCost());
        assertEquals(6L, point2.getAllocationCount());
    }

    @Test
    @DisplayName("getShippingCostTrend handles Integer and Long from COALESCE(..., 0)")
    void getShippingCostTrend_integerOrLongFromCoalesce_convertedSafely() {
        LocalDate date = LocalDate.of(2026, 9, 1);
        Integer zeroInt = 0;
        Long count = 2L;

        when(allocationRepository.findShippingCostTrend())
                .thenReturn(Collections.singletonList(new Object[]{date, zeroInt, count}));

        ShippingCostTrendResponseDto response = dashboardService.getShippingCostTrend();

        assertNotNull(response);
        assertEquals(1, response.getTrend().size());
        assertEquals(BigDecimal.valueOf(0), response.getTrend().get(0).getAverageShippingCost());
    }

    @Test
    @DisplayName("getShippingCostTrend preserves exact BigDecimal scale and precision")
    void getShippingCostTrend_preservesExactBigDecimalPrecision() {
        LocalDate date = LocalDate.of(2026, 9, 1);
        BigDecimal preciseCost = new BigDecimal("12345.67890123");
        Long count = 1L;

        when(allocationRepository.findShippingCostTrend())
                .thenReturn(Collections.singletonList(new Object[]{date, preciseCost, count}));

        ShippingCostTrendResponseDto response = dashboardService.getShippingCostTrend();

        assertNotNull(response);
        assertEquals(1, response.getTrend().size());
        assertEquals(preciseCost, response.getTrend().get(0).getAverageShippingCost());
    }

    @Test
    @DisplayName("getShippingCostTrend handles null values safely without NullPointerException")
    void getShippingCostTrend_nullValues_handledSafely() {
        when(allocationRepository.findShippingCostTrend())
                .thenReturn(Collections.singletonList(new Object[]{null, null, null}));

        ShippingCostTrendResponseDto response = dashboardService.getShippingCostTrend();

        assertNotNull(response);
        assertEquals(1, response.getTrend().size());

        ShippingCostTrendPointDto point = response.getTrend().get(0);
        assertNull(point.getDate());
        assertNull(point.getAverageShippingCost());
        assertNull(point.getAllocationCount());
    }

    @Test
    @DisplayName("getShippingCostTrend handles multiple rows with mixed Number types")
    void getShippingCostTrend_multipleRowsWithMixedTypes_mappedCorrectly() {
        LocalDate d1 = LocalDate.of(2026, 8, 30);
        LocalDate d2 = LocalDate.of(2026, 8, 31);
        LocalDate d3 = LocalDate.of(2026, 9, 1);

        List<Object[]> rows = List.of(
                new Object[]{Date.valueOf(d1), new BigDecimal("14.50"), BigInteger.valueOf(10)},
                new Object[]{d2, Double.valueOf(20.25), Integer.valueOf(5)},
                new Object[]{d3, 0, 1L}
        );

        when(allocationRepository.findShippingCostTrend()).thenReturn(rows);

        ShippingCostTrendResponseDto response = dashboardService.getShippingCostTrend();

        assertNotNull(response);
        assertEquals(3, response.getTrend().size());

        assertEquals(d1, response.getTrend().get(0).getDate());
        assertEquals(new BigDecimal("14.50"), response.getTrend().get(0).getAverageShippingCost());
        assertEquals(10L, response.getTrend().get(0).getAllocationCount());

        assertEquals(d2, response.getTrend().get(1).getDate());
        assertEquals(BigDecimal.valueOf(20.25), response.getTrend().get(1).getAverageShippingCost());
        assertEquals(5L, response.getTrend().get(1).getAllocationCount());

        assertEquals(d3, response.getTrend().get(2).getDate());
        assertEquals(BigDecimal.valueOf(0), response.getTrend().get(2).getAverageShippingCost());
        assertEquals(1L, response.getTrend().get(2).getAllocationCount());
    }

    @Test
    @DisplayName("getShippingCostTrend returns empty list when repository returns no rows")
    void getShippingCostTrend_emptyRepositoryResult_returnsEmptyList() {
        when(allocationRepository.findShippingCostTrend()).thenReturn(Collections.emptyList());

        ShippingCostTrendResponseDto response = dashboardService.getShippingCostTrend();

        assertNotNull(response);
        assertNotNull(response.getTrend());
        assertTrue(response.getTrend().isEmpty());
    }

    @Test
    @DisplayName("getShippingCostTrend throws IllegalArgumentException for unsupported date type")
    void getShippingCostTrend_unsupportedDateType_throwsException() {
        when(allocationRepository.findShippingCostTrend())
                .thenReturn(Collections.singletonList(new Object[]{"not-a-date", new BigDecimal("10.00"), 1L}));

        assertThrows(IllegalArgumentException.class, () -> dashboardService.getShippingCostTrend());
    }

    @Test
    @DisplayName("getShippingCostTrend throws IllegalArgumentException for unsupported numeric type")
    void getShippingCostTrend_unsupportedNumericType_throwsException() {
        LocalDate date = LocalDate.of(2026, 9, 1);
        when(allocationRepository.findShippingCostTrend())
                .thenReturn(Collections.singletonList(new Object[]{date, Boolean.TRUE, 1L}));

        assertThrows(IllegalArgumentException.class, () -> dashboardService.getShippingCostTrend());
    }

    @Test
    @DisplayName("getShippingCostTrend with null dates delegates to default method")
    void getShippingCostTrend_withNullDates_delegatesToDefault() {
        LocalDate date = LocalDate.of(2026, 9, 1);
        when(allocationRepository.findShippingCostTrend())
                .thenReturn(Collections.singletonList(new Object[]{date, new BigDecimal("15.00"), 3L}));

        ShippingCostTrendResponseDto response = dashboardService.getShippingCostTrend(null, null);

        assertNotNull(response);
        assertEquals(1, response.getTrend().size());
        verify(allocationRepository).findShippingCostTrend();
    }

    @Test
    @DisplayName("getShippingCostTrend with valid range invokes findShippingCostTrendBetween with UTC boundaries")
    void getShippingCostTrend_withValidRange_queriesBetweenInstants() {
        LocalDate startDate = LocalDate.of(2026, 8, 28);
        LocalDate endDate = LocalDate.of(2026, 9, 4);

        Instant expectedStart = startDate.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant expectedEnd = endDate.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

        List<Object[]> rows = List.of(
                new Object[]{startDate, new BigDecimal("19.50"), 4L},
                new Object[]{endDate, new BigDecimal("22.00"), 6L}
        );

        when(allocationRepository.findShippingCostTrendBetween(expectedStart, expectedEnd)).thenReturn(rows);

        ShippingCostTrendResponseDto response = dashboardService.getShippingCostTrend(startDate, endDate);

        assertNotNull(response);
        assertEquals(2, response.getTrend().size());
        assertEquals(startDate, response.getTrend().get(0).getDate());
        assertEquals(new BigDecimal("19.50"), response.getTrend().get(0).getAverageShippingCost());
        assertEquals(4L, response.getTrend().get(0).getAllocationCount());
        assertEquals(endDate, response.getTrend().get(1).getDate());
        assertEquals(new BigDecimal("22.00"), response.getTrend().get(1).getAverageShippingCost());
        assertEquals(6L, response.getTrend().get(1).getAllocationCount());

        verify(allocationRepository).findShippingCostTrendBetween(expectedStart, expectedEnd);
    }

    @Test
    @DisplayName("getShippingCostTrend with startDate after endDate throws BadRequestException")
    void getShippingCostTrend_startDateAfterEndDate_throwsBadRequestException() {
        LocalDate startDate = LocalDate.of(2026, 9, 5);
        LocalDate endDate = LocalDate.of(2026, 9, 4);

        BadRequestException ex = assertThrows(
                BadRequestException.class,
                () -> dashboardService.getShippingCostTrend(startDate, endDate)
        );

        assertEquals("Start date cannot be after end date", ex.getMessage());
    }

    @Test
    @DisplayName("getShippingCostTrend with startDate only throws BadRequestException")
    void getShippingCostTrend_startDateOnly_throwsBadRequestException() {
        LocalDate startDate = LocalDate.of(2026, 9, 1);

        BadRequestException ex = assertThrows(
                BadRequestException.class,
                () -> dashboardService.getShippingCostTrend(startDate, null)
        );

        assertEquals("Both startDate and endDate must be provided for range filtering", ex.getMessage());
    }

    @Test
    @DisplayName("getShippingCostTrend with endDate only throws BadRequestException")
    void getShippingCostTrend_endDateOnly_throwsBadRequestException() {
        LocalDate endDate = LocalDate.of(2026, 9, 4);

        BadRequestException ex = assertThrows(
                BadRequestException.class,
                () -> dashboardService.getShippingCostTrend(null, endDate)
        );

        assertEquals("Both startDate and endDate must be provided for range filtering", ex.getMessage());
    }

    @Test
    @DisplayName("getShippingCostTrend with range returns empty list when no data matches")
    void getShippingCostTrend_emptyRangeResult_returnsEmptyList() {
        LocalDate startDate = LocalDate.of(2026, 1, 1);
        LocalDate endDate = LocalDate.of(2026, 1, 7);

        Instant expectedStart = startDate.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant expectedEnd = endDate.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

        when(allocationRepository.findShippingCostTrendBetween(expectedStart, expectedEnd))
                .thenReturn(Collections.emptyList());

        ShippingCostTrendResponseDto response = dashboardService.getShippingCostTrend(startDate, endDate);

        assertNotNull(response);
        assertNotNull(response.getTrend());
        assertTrue(response.getTrend().isEmpty());
    }
}
