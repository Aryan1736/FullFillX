package com.aryan.fulfillx.repository.spec;

import com.aryan.fulfillx.dto.request.CustomerOrderFilterRequest;
import com.aryan.fulfillx.entity.CustomerOrder;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public final class CustomerOrderSpecifications {

    private CustomerOrderSpecifications() {
    }

    public static Specification<CustomerOrder> fromFilter(CustomerOrderFilterRequest filter) {
        return (root, query, criteriaBuilder) -> {
            if (filter == null) {
                return criteriaBuilder.conjunction();
            }

            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            if (filter.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), filter.getStatus()));
            }

            if (filter.getCustomerId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("customer").get("id"), filter.getCustomerId()));
            }

            return criteriaBuilder.and(predicates.toArray(jakarta.persistence.criteria.Predicate[]::new));
        };
    }
}
