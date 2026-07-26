package com.aryan.fulfillx.repository;

import com.aryan.fulfillx.entity.CustomerOrder;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, UUID> {
}
