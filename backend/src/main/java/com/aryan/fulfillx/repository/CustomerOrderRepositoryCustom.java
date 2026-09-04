package com.aryan.fulfillx.repository;

import com.aryan.fulfillx.entity.CustomerOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface CustomerOrderRepositoryCustom {

    Page<CustomerOrder> findAll(Specification<CustomerOrder> specification, Pageable pageable);
}
