package com.aryan.fulfillx.repository;

import com.aryan.fulfillx.entity.Allocation;
import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AllocationRepository extends JpaRepository<Allocation, UUID> {

    @Query("SELECT COALESCE(AVG(a.shippingCost), 0) FROM Allocation a")
    BigDecimal findAverageShippingCost();

    @Query("SELECT COALESCE(MIN(a.shippingCost), 0) FROM Allocation a")
    BigDecimal findMinimumShippingCost();

    @Query("SELECT COALESCE(MAX(a.shippingCost), 0) FROM Allocation a")
    BigDecimal findMaximumShippingCost();

    @Query("SELECT COALESCE(SUM(a.shippingCost), 0) FROM Allocation a")
    BigDecimal findTotalShippingCost();

    @Query("SELECT COALESCE(AVG(a.estimatedDeliveryHours), 0.0) FROM Allocation a")
    Double findAverageEstimatedDeliveryHours();
}
