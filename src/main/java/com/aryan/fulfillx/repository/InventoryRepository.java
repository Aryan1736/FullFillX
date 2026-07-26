package com.aryan.fulfillx.repository;

import com.aryan.fulfillx.entity.Inventory;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Inventory, UUID> {
}
