package com.aryan.fulfillx.repository;

import com.aryan.fulfillx.entity.CustomerOrder;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.query.QueryUtils;
import org.springframework.stereotype.Repository;

@Repository
public class CustomerOrderRepositoryCustomImpl implements CustomerOrderRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<CustomerOrder> findAll(Specification<CustomerOrder> specification, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        // 1. Total count query
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<CustomerOrder> countRoot = countQuery.from(CustomerOrder.class);

        if (specification != null) {
            Predicate predicate = specification.toPredicate(countRoot, countQuery, cb);
            if (predicate != null) {
                countQuery.where(predicate);
            }
        }

        if (countQuery.isDistinct()) {
            countQuery.select(cb.countDistinct(countRoot));
        } else {
            countQuery.select(cb.count(countRoot));
        }

        Long totalElements = entityManager.createQuery(countQuery).getSingleResult();
        long total = totalElements != null ? totalElements : 0L;

        if (total == 0L || (pageable.isPaged() && pageable.getOffset() >= total)) {
            return new PageImpl<>(Collections.emptyList(), pageable, total);
        }

        // 2. Phase 1: ID Pagination query
        CriteriaQuery<UUID> idQuery = cb.createQuery(UUID.class);
        Root<CustomerOrder> idRoot = idQuery.from(CustomerOrder.class);
        idQuery.select(idRoot.get("id"));

        if (specification != null) {
            Predicate predicate = specification.toPredicate(idRoot, idQuery, cb);
            if (predicate != null) {
                idQuery.where(predicate);
            }
        }

        if (pageable.isPaged() && pageable.getSort().isSorted()) {
            idQuery.orderBy(QueryUtils.toOrders(pageable.getSort(), idRoot, cb));
        }

        TypedQuery<UUID> typedIdQuery = entityManager.createQuery(idQuery);

        if (pageable.isPaged()) {
            typedIdQuery.setFirstResult((int) pageable.getOffset());
            typedIdQuery.setMaxResults(pageable.getPageSize());
        }

        List<UUID> orderIds = typedIdQuery.getResultList();

        if (orderIds.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, total);
        }

        // 3. Phase 2: Batch fetch entities with eager associations (customer, orderItems, product)
        TypedQuery<CustomerOrder> detailedQuery = entityManager.createQuery(
                "SELECT DISTINCT o FROM CustomerOrder o "
                        + "LEFT JOIN FETCH o.customer "
                        + "LEFT JOIN FETCH o.orderItems oi "
                        + "LEFT JOIN FETCH oi.product "
                        + "WHERE o.id IN :ids",
                CustomerOrder.class);
        detailedQuery.setParameter("ids", orderIds);
        List<CustomerOrder> fetchedOrders = detailedQuery.getResultList();

        // 4. Deterministically restore the original ordering established by Phase 1
        Map<UUID, Integer> positionMap = new HashMap<>();
        for (int i = 0; i < orderIds.size(); i++) {
            positionMap.put(orderIds.get(i), i);
        }

        List<CustomerOrder> sortedOrders = new ArrayList<>(fetchedOrders);
        sortedOrders.sort(Comparator.comparingInt(order -> positionMap.getOrDefault(order.getId(), Integer.MAX_VALUE)));

        return new PageImpl<>(sortedOrders, pageable, total);
    }
}
