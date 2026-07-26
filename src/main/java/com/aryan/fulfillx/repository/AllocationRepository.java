package com.aryan.fulfillx.repository;

import com.aryan.fulfillx.entity.Allocation;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AllocationRepository extends JpaRepository<Allocation, UUID> {
}
