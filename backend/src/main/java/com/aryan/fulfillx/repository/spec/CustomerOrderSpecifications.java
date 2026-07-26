package com.aryan.fulfillx.repository.spec;

import com.aryan.fulfillx.dto.request.CustomerOrderFilterRequest;
import com.aryan.fulfillx.entity.CustomerOrder;
import jakarta.persistence.criteria.JoinType;
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

            root.fetch("customer", JoinType.LEFT);
            var orderItems = root.fetch("orderItems", JoinType.LEFT);
            orderItems.fetch("product", JoinType.LEFT);
            if (query != null) {
                query.distinct(true);
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
