package com.aryan.fulfillx.repository;

import com.aryan.fulfillx.entity.CustomerOrder;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, UUID>,
        JpaSpecificationExecutor<CustomerOrder> {

    @Query("SELECT o.status, COUNT(o) FROM CustomerOrder o GROUP BY o.status")
    List<Object[]> countOrdersByStatus();
}
