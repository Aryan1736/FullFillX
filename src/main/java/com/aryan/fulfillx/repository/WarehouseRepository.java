package com.aryan.fulfillx.repository;

import com.aryan.fulfillx.entity.Warehouse;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarehouseRepository extends JpaRepository<Warehouse, UUID> {
}
