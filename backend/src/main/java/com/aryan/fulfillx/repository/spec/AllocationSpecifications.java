package com.aryan.fulfillx.repository.spec;

import com.aryan.fulfillx.dto.request.AllocationFilterRequest;
import com.aryan.fulfillx.entity.Allocation;
import com.aryan.fulfillx.entity.AllocationItem;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class AllocationSpecifications {

    private AllocationSpecifications() {
    }

    public static Specification<Allocation> fromFilter(AllocationFilterRequest filter) {
        return (root, query, criteriaBuilder) -> {
            if (filter == null) {
                return criteriaBuilder.conjunction();
            }

            List<Predicate> predicates = new ArrayList<>();

            if (filter.getOrderId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("order").get("id"), filter.getOrderId()));
            }

            if (filter.getWarehouseId() != null) {
                Join<Allocation, AllocationItem> items = root.join("allocationItems", JoinType.INNER);
                predicates.add(criteriaBuilder.equal(items.get("warehouse").get("id"), filter.getWarehouseId()));
                if (query != null) {
                    query.distinct(true);
                }
            }

            if (StringUtils.hasText(filter.getSearch())) {
                String search = filter.getSearch().trim();
                try {
                    UUID uuid = UUID.fromString(search);
                    predicates.add(criteriaBuilder.or(
                            criteriaBuilder.equal(root.get("id"), uuid),
                            criteriaBuilder.equal(root.get("order").get("id"), uuid)));
                } catch (IllegalArgumentException ignored) {
                    String searchPattern = "%" + search.toLowerCase() + "%";
                    Join<Allocation, AllocationItem> items = root.join("allocationItems", JoinType.LEFT);
                    predicates.add(criteriaBuilder.or(
                            criteriaBuilder.like(
                                    criteriaBuilder.lower(root.get("strategyName")), searchPattern),
                            criteriaBuilder.like(
                                    criteriaBuilder.lower(items.get("warehouse").get("name")), searchPattern)));
                    if (query != null) {
                        query.distinct(true);
                    }
                }
            }

            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }
}
