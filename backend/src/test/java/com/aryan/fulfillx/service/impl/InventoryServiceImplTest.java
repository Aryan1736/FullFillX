package com.aryan.fulfillx.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.aryan.fulfillx.dto.request.InventoryFilterRequest;
import com.aryan.fulfillx.dto.request.InventoryRequest;
import com.aryan.fulfillx.dto.response.InventoryResponse;
import com.aryan.fulfillx.entity.Inventory;
import com.aryan.fulfillx.entity.Product;
import com.aryan.fulfillx.entity.Warehouse;
import com.aryan.fulfillx.exception.ResourceNotFoundException;
import com.aryan.fulfillx.mapper.InventoryMapper;
import com.aryan.fulfillx.repository.InventoryRepository;
import com.aryan.fulfillx.repository.ProductRepository;
import com.aryan.fulfillx.repository.WarehouseRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

@ExtendWith(MockitoExtension.class)
@DisplayName("InventoryServiceImpl")
class InventoryServiceImplTest {

    private static final UUID INVENTORY_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID WAREHOUSE_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private static final UUID PRODUCT_ID = UUID.fromString("33333333-3333-3333-3333-333333333333");

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private WarehouseRepository warehouseRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private InventoryMapper inventoryMapper;

    @InjectMocks
    private InventoryServiceImpl inventoryService;

    private Warehouse warehouse;
    private Product product;
    private Inventory inventory;

    @BeforeEach
    void setUp() {
        warehouse = Warehouse.builder()
                .id(WAREHOUSE_ID)
                .name("Kolkata Fulfillment Center")
                .city("Kolkata")
                .build();

        product = Product.builder()
                .id(PRODUCT_ID)
                .name("Wireless Mouse")
                .category("Electronics")
                .weight(new BigDecimal("0.120"))
                .build();

        inventory = Inventory.builder()
                .id(INVENTORY_ID)
                .warehouse(warehouse)
                .product(product)
                .availableQuantity(100)
                .reservedQuantity(10)
                .build();
    }

    @Test
    @DisplayName("getAll returns paginated InventoryResponse with mapped warehouse and product fields")
    void getAll_returnsPaginatedResponse() {
        InventoryFilterRequest filter = new InventoryFilterRequest();
        Pageable pageable = PageRequest.of(0, 10);
        Page<Inventory> inventoryPage = new PageImpl<>(List.of(inventory), pageable, 1);

        InventoryResponse responseDto = InventoryResponse.builder()
                .id(INVENTORY_ID)
                .warehouseId(WAREHOUSE_ID)
                .warehouseName("Kolkata Fulfillment Center")
                .productId(PRODUCT_ID)
                .productName("Wireless Mouse")
                .sku("ELEC-WIRELESS-MOUSE")
                .availableQuantity(100)
                .reservedQuantity(10)
                .build();

        when(inventoryRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(inventoryPage);
        when(inventoryMapper.toResponse(inventory)).thenReturn(responseDto);

        Page<InventoryResponse> result = inventoryService.getAll(filter, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Kolkata Fulfillment Center", result.getContent().getFirst().getWarehouseName());
        assertEquals("Wireless Mouse", result.getContent().getFirst().getProductName());
        assertEquals("ELEC-WIRELESS-MOUSE", result.getContent().getFirst().getSku());

        verify(inventoryRepository).findAll(any(Specification.class), any(Pageable.class));
        verify(inventoryMapper).toResponse(inventory);
    }

    @Test
    @DisplayName("getById returns detailed InventoryResponse when found")
    void getById_found_returnsResponse() {
        when(inventoryRepository.findDetailedById(INVENTORY_ID)).thenReturn(Optional.of(inventory));
        when(inventoryMapper.toResponse(inventory)).thenReturn(InventoryResponse.builder().id(INVENTORY_ID).build());

        InventoryResponse response = inventoryService.getById(INVENTORY_ID);

        assertNotNull(response);
        assertEquals(INVENTORY_ID, response.getId());
        verify(inventoryRepository).findDetailedById(INVENTORY_ID);
    }

    @Test
    @DisplayName("getById throws ResourceNotFoundException when not found")
    void getById_notFound_throwsException() {
        when(inventoryRepository.findDetailedById(INVENTORY_ID)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> inventoryService.getById(INVENTORY_ID));
    }
}
