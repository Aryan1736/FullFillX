package com.aryan.fulfillx.repository;

import com.aryan.fulfillx.entity.Inventory;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InventoryRepository extends JpaRepository<Inventory, UUID> {

    @Query("SELECT i FROM Inventory i JOIN FETCH i.warehouse JOIN FETCH i.product")
    List<Inventory> findAllWithWarehouseAndProduct();
}
