package com.aryan.fulfillx.repository;

import com.aryan.fulfillx.entity.CustomerOrder;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, UUID>,
        JpaSpecificationExecutor<CustomerOrder> {

    @EntityGraph(attributePaths = {
        "customer",
        "orderItems",
        "orderItems.product"
    })
    @Query("SELECT o FROM CustomerOrder o WHERE o.id = :id")
    Optional<CustomerOrder> findDetailedById(@Param("id") UUID id);

    @EntityGraph(attributePaths = {
        "customer",
        "orderItems",
        "orderItems.product"
    })
    Page<CustomerOrder> findAll(Specification<CustomerOrder> specification, Pageable pageable);

    @Query("SELECT o.status, COUNT(o) FROM CustomerOrder o GROUP BY o.status")
    List<Object[]> countOrdersByStatus();
}
