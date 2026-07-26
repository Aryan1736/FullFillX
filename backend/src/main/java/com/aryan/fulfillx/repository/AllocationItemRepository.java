package com.aryan.fulfillx.repository;

import com.aryan.fulfillx.entity.AllocationItem;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AllocationItemRepository extends JpaRepository<AllocationItem, UUID> {
}
