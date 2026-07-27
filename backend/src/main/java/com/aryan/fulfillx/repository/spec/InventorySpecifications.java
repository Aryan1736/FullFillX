package com.aryan.fulfillx.repository.spec;

import com.aryan.fulfillx.constant.InventoryConstants;
import com.aryan.fulfillx.dto.request.InventoryFilterRequest;
import com.aryan.fulfillx.entity.Inventory;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class InventorySpecifications {

    private InventorySpecifications() {
    }

    public static Specification<Inventory> fromFilter(InventoryFilterRequest filter) {
        return (root, query, criteriaBuilder) -> {
            if (filter == null) {
                return criteriaBuilder.conjunction();
            }

            List<Predicate> predicates = new ArrayList<>();

            if (Boolean.TRUE.equals(filter.getLowStock())) {
                predicates.add(criteriaBuilder.greaterThan(root.get("availableQuantity"), 0));
                predicates.add(criteriaBuilder.lessThan(
                        root.get("availableQuantity"), InventoryConstants.LOW_STOCK_THRESHOLD));
            }

            if (filter.getProductId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("product").get("id"), filter.getProductId()));
            }

            if (filter.getWarehouseId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("warehouse").get("id"), filter.getWarehouseId()));
            }

            if (StringUtils.hasText(filter.getSearch())) {
                String searchPattern = "%" + filter.getSearch().trim().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("product").get("name")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("product").get("category")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("warehouse").get("name")), searchPattern)));
            }

            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }
}
