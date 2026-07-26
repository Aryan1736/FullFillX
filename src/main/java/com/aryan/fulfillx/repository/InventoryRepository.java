package com.aryan.fulfillx.repository;

import com.aryan.fulfillx.entity.Inventory;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface InventoryRepository extends JpaRepository<Inventory, UUID>, JpaSpecificationExecutor<Inventory> {

    @Query("SELECT i FROM Inventory i JOIN FETCH i.warehouse JOIN FETCH i.product")
    List<Inventory> findAllWithWarehouseAndProduct();

    Optional<Inventory> findByWarehouse_IdAndProduct_Id(UUID warehouseId, UUID productId);

    @Query("""
            SELECT CASE WHEN COALESCE(SUM(i.availableQuantity + i.reservedQuantity), 0) = 0 THEN 0.0
            ELSE (COALESCE(SUM(i.reservedQuantity), 0) * 100.0) / SUM(i.availableQuantity + i.reservedQuantity)
            END
            FROM Inventory i
            """)
    Double findInventoryUtilizationPercentage();
}
