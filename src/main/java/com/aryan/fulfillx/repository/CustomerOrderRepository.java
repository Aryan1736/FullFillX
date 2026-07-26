package com.aryan.fulfillx.repository;

import com.aryan.fulfillx.entity.CustomerOrder;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, UUID>,
        JpaSpecificationExecutor<CustomerOrder> {
}
