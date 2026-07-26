package com.aryan.fulfillx.repository.spec;

import com.aryan.fulfillx.dto.request.WarehouseFilterRequest;
import com.aryan.fulfillx.entity.Warehouse;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class WarehouseSpecifications {

    private WarehouseSpecifications() {
    }

    public static Specification<Warehouse> fromFilter(WarehouseFilterRequest filter) {
        return (root, query, criteriaBuilder) -> {
            if (filter == null) {
                return criteriaBuilder.conjunction();
            }

            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(filter.getCity())) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("city")),
                        "%" + filter.getCity().trim().toLowerCase() + "%"));
            }

            if (filter.getActive() != null) {
                predicates.add(criteriaBuilder.equal(root.get("active"), filter.getActive()));
            }

            Expression<Double> utilizationPercentage = utilizationPercentage(root, criteriaBuilder);

            if (filter.getMinUtilization() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        utilizationPercentage, filter.getMinUtilization()));
            }

            if (filter.getMaxUtilization() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        utilizationPercentage, filter.getMaxUtilization()));
            }

            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private static Expression<Double> utilizationPercentage(Root<Warehouse> root, CriteriaBuilder criteriaBuilder) {
        Expression<Double> load = root.get("currentLoad").as(Double.class);
        Expression<Double> capacity = root.get("capacity").as(Double.class);
        Expression<Double> percentage = criteriaBuilder.prod(
                criteriaBuilder.quot(load, capacity).as(Double.class),
                criteriaBuilder.literal(100.0));

        return criteriaBuilder.<Double>selectCase()
                .when(criteriaBuilder.equal(root.get("capacity"), 0), criteriaBuilder.literal(0.0))
                .otherwise(percentage);
    }
}
