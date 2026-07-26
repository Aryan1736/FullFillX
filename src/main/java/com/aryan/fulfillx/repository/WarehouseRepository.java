package com.aryan.fulfillx.repository;

import com.aryan.fulfillx.entity.Warehouse;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface WarehouseRepository extends JpaRepository<Warehouse, UUID> {

    @Query("SELECT COALESCE(AVG(w.currentLoad), 0.0) FROM Warehouse w")
    Double findAverageCurrentLoad();
}
