package com.aryan.fulfillx.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.aryan.fulfillx.dto.request.InventoryFilterRequest;
import com.aryan.fulfillx.entity.Inventory;
import com.aryan.fulfillx.entity.Product;
import com.aryan.fulfillx.entity.Warehouse;
import com.aryan.fulfillx.repository.spec.InventorySpecifications;
import jakarta.persistence.EntityManager;
import java.util.List;
import org.hibernate.Hibernate;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
@DisplayName("InventoryRepository EntityGraph & Specification Tests")
class InventoryRepositoryTest {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    @DisplayName("findAll with null filter eagerly fetches warehouse and product associations")
    void findAll_nullFilter_eagerlyFetchesAssociations() {
        entityManager.flush();
        entityManager.clear();

        Page<Inventory> page = inventoryRepository.findAll(
                InventorySpecifications.fromFilter(null),
                PageRequest.of(0, 10, Sort.by("id").ascending()));

        assertFalse(page.isEmpty());
        assertEquals(10, page.getContent().size());

        for (Inventory inventory : page.getContent()) {
            assertNotNull(inventory.getWarehouse());
            assertNotNull(inventory.getProduct());
            assertTrue(
                    Hibernate.isInitialized(inventory.getWarehouse()),
                    "Warehouse association should be eagerly initialized by @EntityGraph");
            assertTrue(
                    Hibernate.isInitialized(inventory.getProduct()),
                    "Product association should be eagerly initialized by @EntityGraph");

            assertNotNull(inventory.getWarehouse().getName());
            assertNotNull(inventory.getProduct().getName());
            assertNotNull(inventory.getProduct().getCategory());
        }
    }

    @Test
    @DisplayName("findAll with active filter eagerly fetches warehouse and product associations")
    void findAll_withFilter_eagerlyFetchesAssociations() {
        List<Inventory> sample = inventoryRepository.findAll();
        assertFalse(sample.isEmpty());
        Warehouse targetWarehouse = sample.getFirst().getWarehouse();
        Product targetProduct = sample.getFirst().getProduct();

        entityManager.flush();
        entityManager.clear();

        InventoryFilterRequest filter = new InventoryFilterRequest();
        filter.setWarehouseId(targetWarehouse.getId());
        filter.setProductId(targetProduct.getId());

        Page<Inventory> page = inventoryRepository.findAll(
                InventorySpecifications.fromFilter(filter),
                PageRequest.of(0, 10));

        assertFalse(page.isEmpty());
        for (Inventory inventory : page.getContent()) {
            assertEquals(targetWarehouse.getId(), inventory.getWarehouse().getId());
            assertEquals(targetProduct.getId(), inventory.getProduct().getId());
            assertTrue(Hibernate.isInitialized(inventory.getWarehouse()));
            assertTrue(Hibernate.isInitialized(inventory.getProduct()));
            assertNotNull(inventory.getWarehouse().getName());
            assertNotNull(inventory.getProduct().getName());
        }
    }

    @Test
    @DisplayName("findAll with search text eagerly fetches associations and filters correctly")
    void findAll_withSearchText_eagerlyFetchesAssociations() {
        entityManager.flush();
        entityManager.clear();

        InventoryFilterRequest filter = new InventoryFilterRequest();
        filter.setSearch("Mouse");

        Page<Inventory> page = inventoryRepository.findAll(
                InventorySpecifications.fromFilter(filter),
                PageRequest.of(0, 10));

        assertFalse(page.isEmpty());
        for (Inventory inventory : page.getContent()) {
            assertTrue(inventory.getProduct().getName().toLowerCase().contains("mouse")
                    || inventory.getProduct().getCategory().toLowerCase().contains("mouse")
                    || inventory.getWarehouse().getName().toLowerCase().contains("mouse"));
            assertTrue(Hibernate.isInitialized(inventory.getWarehouse()));
            assertTrue(Hibernate.isInitialized(inventory.getProduct()));
        }
    }

    @Test
    @DisplayName("findAll with lowStock filter preserves pagination and eager associations")
    void findAll_withLowStockFilter_preservesPaginationAndEagerAssociations() {
        entityManager.flush();
        entityManager.clear();

        InventoryFilterRequest filter = new InventoryFilterRequest();
        filter.setLowStock(true);

        Page<Inventory> page = inventoryRepository.findAll(
                InventorySpecifications.fromFilter(filter),
                PageRequest.of(0, 5));

        assertNotNull(page);
        for (Inventory inventory : page.getContent()) {
            assertTrue(Hibernate.isInitialized(inventory.getWarehouse()));
            assertTrue(Hibernate.isInitialized(inventory.getProduct()));
            assertTrue(inventory.getAvailableQuantity() > 0);
            assertTrue(inventory.getAvailableQuantity() < com.aryan.fulfillx.constant.InventoryConstants.LOW_STOCK_THRESHOLD);
        }
    }
}
