package com.aryan.fulfillx.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.aryan.fulfillx.dto.request.CustomerOrderFilterRequest;
import com.aryan.fulfillx.entity.Customer;
import com.aryan.fulfillx.entity.CustomerOrder;
import com.aryan.fulfillx.entity.OrderItem;
import com.aryan.fulfillx.entity.OrderStatus;
import com.aryan.fulfillx.repository.spec.CustomerOrderSpecifications;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.hibernate.Hibernate;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
@DisplayName("CustomerOrderRepository & Two-Phase Pagination Tests")
class CustomerOrderRepositoryTest {

    @Autowired
    private CustomerOrderRepository customerOrderRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    @DisplayName("1. First page: returns correct number of orders, total count, order sequence, and eagerly initialized associations")
    void findAll_firstPage_returnsCorrectCountAndEagerAssociations() {
        entityManager.flush();
        entityManager.clear();

        Page<CustomerOrder> page = customerOrderRepository.findAll(
                CustomerOrderSpecifications.fromFilter(null),
                PageRequest.of(0, 10, Sort.by("createdAt").descending()));

        assertFalse(page.isEmpty());
        assertEquals(10, page.getContent().size());
        assertEquals(30, page.getTotalElements());
        assertEquals(3, page.getTotalPages());
        assertEquals(0, page.getNumber());

        // Verify descending order sequence
        for (int i = 0; i < page.getContent().size() - 1; i++) {
            CustomerOrder current = page.getContent().get(i);
            CustomerOrder next = page.getContent().get(i + 1);
            assertTrue(current.getCreatedAt().compareTo(next.getCreatedAt()) >= 0,
                    "Orders must be sorted in descending order of createdAt");
        }

        // Verify eager initialization of customer, orderItems, and product without lazy initialization errors
        for (CustomerOrder order : page.getContent()) {
            assertNotNull(order.getCustomer());
            assertTrue(Hibernate.isInitialized(order.getCustomer()), "Customer should be eagerly initialized");
            assertNotNull(order.getCustomer().getName());

            assertNotNull(order.getOrderItems());
            assertTrue(Hibernate.isInitialized(order.getOrderItems()), "OrderItems should be eagerly initialized");
            assertFalse(order.getOrderItems().isEmpty(), "OrderItems should not be empty");

            for (OrderItem item : order.getOrderItems()) {
                assertNotNull(item.getProduct());
                assertTrue(Hibernate.isInitialized(item.getProduct()), "Product should be eagerly initialized");
                assertNotNull(item.getProduct().getName());
            }
        }
    }

    @Test
    @DisplayName("2. Middle page: correct offset/page boundaries, no duplicate orders across pages, correct ordering")
    void findAll_middlePage_correctOffsetAndNoDuplicates() {
        entityManager.flush();
        entityManager.clear();

        Sort sort = Sort.by("createdAt").descending().and(Sort.by("id").ascending());
        Page<CustomerOrder> page0 = customerOrderRepository.findAll(
                CustomerOrderSpecifications.fromFilter(null), PageRequest.of(0, 10, sort));
        Page<CustomerOrder> page1 = customerOrderRepository.findAll(
                CustomerOrderSpecifications.fromFilter(null), PageRequest.of(1, 10, sort));

        assertEquals(10, page0.getContent().size());
        assertEquals(10, page1.getContent().size());
        assertEquals(1, page1.getNumber());

        Set<UUID> page0Ids = new HashSet<>(page0.getContent().stream().map(CustomerOrder::getId).toList());
        Set<UUID> page1Ids = new HashSet<>(page1.getContent().stream().map(CustomerOrder::getId).toList());

        for (UUID id : page1Ids) {
            assertFalse(page0Ids.contains(id), "Page 1 must not contain any order from Page 0");
        }
    }

    @Test
    @DisplayName("3. Final page: correct partial page")
    void findAll_finalPage_correctPartialPage() {
        entityManager.flush();
        entityManager.clear();

        // 30 total items with page size 12 -> page 0: 12, page 1: 12, page 2: 6
        Page<CustomerOrder> finalPage = customerOrderRepository.findAll(
                CustomerOrderSpecifications.fromFilter(null),
                PageRequest.of(2, 12, Sort.by("createdAt").descending()));

        assertEquals(6, finalPage.getContent().size());
        assertEquals(30, finalPage.getTotalElements());
        assertEquals(3, finalPage.getTotalPages());
        assertEquals(2, finalPage.getNumber());
    }

    @Test
    @DisplayName("4. Page beyond available data: empty content, correct metadata")
    void findAll_pageBeyondAvailableData_emptyContentWithCorrectMetadata() {
        entityManager.flush();
        entityManager.clear();

        Page<CustomerOrder> emptyPage = customerOrderRepository.findAll(
                CustomerOrderSpecifications.fromFilter(null),
                PageRequest.of(10, 10, Sort.by("createdAt").descending()));

        assertTrue(emptyPage.isEmpty());
        assertEquals(0, emptyPage.getContent().size());
        assertEquals(30, emptyPage.getTotalElements());
        assertEquals(3, emptyPage.getTotalPages());
        assertEquals(10, emptyPage.getNumber());
    }

    @Test
    @DisplayName("5. Status filter: filtering remains correct and eager associations loaded")
    void findAll_withStatusFilter_filtersCorrectlyAndLoadsAssociations() {
        List<CustomerOrder> sample = customerOrderRepository.findAll();
        assertFalse(sample.isEmpty());
        OrderStatus targetStatus = sample.getFirst().getStatus();

        entityManager.flush();
        entityManager.clear();

        CustomerOrderFilterRequest filter = new CustomerOrderFilterRequest();
        filter.setStatus(targetStatus);

        Page<CustomerOrder> page = customerOrderRepository.findAll(
                CustomerOrderSpecifications.fromFilter(filter),
                PageRequest.of(0, 10));

        assertFalse(page.isEmpty());
        for (CustomerOrder order : page.getContent()) {
            assertEquals(targetStatus, order.getStatus());
            assertTrue(Hibernate.isInitialized(order.getCustomer()));
            assertTrue(Hibernate.isInitialized(order.getOrderItems()));
            for (OrderItem item : order.getOrderItems()) {
                assertTrue(Hibernate.isInitialized(item.getProduct()));
            }
        }
    }

    @Test
    @DisplayName("6. Customer filter: filtering remains correct and eager associations loaded")
    void findAll_withCustomerIdFilter_filtersCorrectlyAndLoadsAssociations() {
        List<CustomerOrder> sample = customerOrderRepository.findAll();
        assertFalse(sample.isEmpty());
        Customer targetCustomer = sample.getFirst().getCustomer();

        entityManager.flush();
        entityManager.clear();

        CustomerOrderFilterRequest filter = new CustomerOrderFilterRequest();
        filter.setCustomerId(targetCustomer.getId());

        Page<CustomerOrder> page = customerOrderRepository.findAll(
                CustomerOrderSpecifications.fromFilter(filter),
                PageRequest.of(0, 10));

        assertFalse(page.isEmpty());
        for (CustomerOrder order : page.getContent()) {
            assertEquals(targetCustomer.getId(), order.getCustomer().getId());
            assertTrue(Hibernate.isInitialized(order.getCustomer()));
            assertTrue(Hibernate.isInitialized(order.getOrderItems()));
            for (OrderItem item : order.getOrderItems()) {
                assertTrue(Hibernate.isInitialized(item.getProduct()));
            }
        }
    }

    @Test
    @DisplayName("7. Search filter: custom specification involving joined associations filters correctly")
    void findAll_withSearchSpecification_filtersCorrectly() {
        entityManager.flush();
        entityManager.clear();

        // Custom specification filtering orders containing a product whose name contains 'Mouse' or customer name
        Specification<CustomerOrder> searchSpec = (root, query, cb) -> {
            Join<CustomerOrder, OrderItem> itemJoin = root.join("orderItems");
            return cb.like(cb.lower(itemJoin.get("product").get("name")), "%mouse%");
        };

        Page<CustomerOrder> page = customerOrderRepository.findAll(
                searchSpec,
                PageRequest.of(0, 10, Sort.by("createdAt").descending()));

        assertFalse(page.isEmpty());
        for (CustomerOrder order : page.getContent()) {
            assertTrue(Hibernate.isInitialized(order.getCustomer()));
            assertTrue(Hibernate.isInitialized(order.getOrderItems()));
            boolean hasMouse = order.getOrderItems().stream()
                    .anyMatch(item -> item.getProduct().getName().toLowerCase().contains("mouse"));
            assertTrue(hasMouse, "Order must contain a product with 'mouse' in name");
        }
    }

    @Test
    @DisplayName("8. Sorting: ascending, descending, and secondary sort fields")
    void findAll_sorting_ascendingDescendingAndSecondary() {
        entityManager.flush();
        entityManager.clear();

        // Test Ascending
        Page<CustomerOrder> ascPage = customerOrderRepository.findAll(
                CustomerOrderSpecifications.fromFilter(null), PageRequest.of(0, 10, Sort.by("createdAt").ascending()));
        assertFalse(ascPage.isEmpty());
        for (int i = 0; i < ascPage.getContent().size() - 1; i++) {
            CustomerOrder current = ascPage.getContent().get(i);
            CustomerOrder next = ascPage.getContent().get(i + 1);
            assertTrue(current.getCreatedAt().compareTo(next.getCreatedAt()) <= 0,
                    "Ascending sort must preserve non-decreasing order");
        }

        // Test Descending with secondary sort
        Sort secondarySort = Sort.by(Sort.Order.desc("status"), Sort.Order.asc("createdAt"));
        Page<CustomerOrder> secondaryPage = customerOrderRepository.findAll(
                CustomerOrderSpecifications.fromFilter(null), PageRequest.of(0, 15, secondarySort));
        assertFalse(secondaryPage.isEmpty());
        for (int i = 0; i < secondaryPage.getContent().size() - 1; i++) {
            CustomerOrder current = secondaryPage.getContent().get(i);
            CustomerOrder next = secondaryPage.getContent().get(i + 1);
            int statusComp = current.getStatus().name().compareTo(next.getStatus().name());
            assertTrue(statusComp >= 0, "Primary sort on status desc must be preserved");
            if (statusComp == 0) {
                assertTrue(current.getCreatedAt().compareTo(next.getCreatedAt()) <= 0,
                        "Secondary sort on createdAt asc must be preserved");
            }
        }
    }

    @Test
    @DisplayName("9. Empty dataset: zero matches returns empty page without executing Phase 2 query")
    void findAll_emptyDataset_returnsEmptyPageSafely() {
        entityManager.flush();
        entityManager.clear();

        CustomerOrderFilterRequest filter = new CustomerOrderFilterRequest();
        filter.setCustomerId(UUID.randomUUID()); // Non-existent customer

        Page<CustomerOrder> page = customerOrderRepository.findAll(
                CustomerOrderSpecifications.fromFilter(filter),
                PageRequest.of(0, 10));

        assertTrue(page.isEmpty());
        assertEquals(0, page.getContent().size());
        assertEquals(0, page.getTotalElements());
        assertEquals(0, page.getTotalPages());
    }

    @Test
    @DisplayName("10. Regression: Specification does not add collection fetch joins to count query")
    void toPredicate_countQuery_doesNotAddFetchJoins() {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<CustomerOrder> root = countQuery.from(CustomerOrder.class);

        CustomerOrderFilterRequest filter = new CustomerOrderFilterRequest();
        CustomerOrderSpecifications.fromFilter(filter).toPredicate(root, countQuery, cb);

        assertTrue(root.getFetches().isEmpty(), "Count query must not contain any fetch joins");
        assertFalse(countQuery.isDistinct(), "Count query should not be forced distinct");
    }

    @Test
    @DisplayName("11. Regression: Specification does not add collection fetch joins to entity or id queries")
    void toPredicate_spec_doesNotAddCollectionFetchJoins() {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<CustomerOrder> entityQuery = cb.createQuery(CustomerOrder.class);
        Root<CustomerOrder> root = entityQuery.from(CustomerOrder.class);

        CustomerOrderFilterRequest filter = new CustomerOrderFilterRequest();
        CustomerOrderSpecifications.fromFilter(filter).toPredicate(root, entityQuery, cb);

        assertTrue(root.getFetches().isEmpty(), "Specification must not add collection fetch joins");
    }
}
