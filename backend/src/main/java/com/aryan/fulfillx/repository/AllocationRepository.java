package com.aryan.fulfillx.repository;

import com.aryan.fulfillx.entity.Allocation;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AllocationRepository extends JpaRepository<Allocation, UUID> {

    @EntityGraph(attributePaths = {
        "order",
        "allocationItems",
        "allocationItems.warehouse",
        "allocationItems.product"
    })
    @Query("SELECT a FROM Allocation a WHERE a.id = :id")
    Optional<Allocation> findDetailedById(@Param("id") UUID id);

    @EntityGraph(attributePaths = {
        "order",
        "allocationItems",
        "allocationItems.warehouse",
        "allocationItems.product"
    })
    @Query("SELECT a FROM Allocation a")
    Page<Allocation> findAllDetailed(Pageable pageable);

    @EntityGraph(attributePaths = {
        "order",
        "allocationItems",
        "allocationItems.warehouse",
        "allocationItems.product"
    })
    Optional<Allocation> findTopByOrder_IdOrderByCreatedAtDesc(UUID orderId);

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

    @Query(value = """
            SELECT COUNT(*) FROM (
                SELECT allocation_id
                FROM allocation_items
                GROUP BY allocation_id
                HAVING COUNT(DISTINCT warehouse_id) > 1
            ) split_shipments
            """, nativeQuery = true)
    Long countSplitShipments();
}
