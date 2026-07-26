package com.aryan.fulfillx.repository;

import com.aryan.fulfillx.entity.Warehouse;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface WarehouseRepository extends JpaRepository<Warehouse, UUID>, JpaSpecificationExecutor<Warehouse> {

    @Query("SELECT COALESCE(AVG(w.currentLoad), 0.0) FROM Warehouse w")
    Double findAverageCurrentLoad();

    @Query("""
            SELECT CASE WHEN COUNT(w) = 0 THEN 0.0
            ELSE AVG(CASE WHEN w.capacity = 0 THEN 0.0 ELSE (w.currentLoad * 100.0) / w.capacity END)
            END
            FROM Warehouse w
            """)
    Double findAverageUtilizationPercentage();
}
