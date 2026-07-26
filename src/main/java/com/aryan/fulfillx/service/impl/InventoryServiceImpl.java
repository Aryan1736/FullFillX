package com.aryan.fulfillx.service.impl;

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
import com.aryan.fulfillx.service.InventoryService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final InventoryMapper inventoryMapper;

    @Override
    @Transactional
    public InventoryResponse create(InventoryRequest request) {
        log.debug("Creating inventory for warehouse {} and product {}",
                request.getWarehouseId(), request.getProductId());
        Inventory inventory = inventoryMapper.toEntity(request);
        inventory.setWarehouse(findWarehouseOrThrow(request.getWarehouseId()));
        inventory.setProduct(findProductOrThrow(request.getProductId()));
        Inventory saved = inventoryRepository.save(inventory);
        return inventoryMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryResponse getById(UUID id) {
        return inventoryMapper.toResponse(findInventoryOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InventoryResponse> getAll(Pageable pageable) {
        log.debug("Fetching inventory page={}, size={}, sort={}",
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort());
        return inventoryRepository.findAll(pageable).map(inventoryMapper::toResponse);
    }

    @Override
    @Transactional
    public InventoryResponse update(UUID id, InventoryRequest request) {
        Inventory inventory = findInventoryOrThrow(id);
        inventoryMapper.updateEntity(request, inventory);
        if (request.getWarehouseId() != null) {
            inventory.setWarehouse(findWarehouseOrThrow(request.getWarehouseId()));
        }
        if (request.getProductId() != null) {
            inventory.setProduct(findProductOrThrow(request.getProductId()));
        }
        return inventoryMapper.toResponse(inventoryRepository.save(inventory));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Inventory inventory = findInventoryOrThrow(id);
        inventoryRepository.delete(inventory);
        log.debug("Deleted inventory: {}", id);
    }

    private Inventory findInventoryOrThrow(UUID id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", id));
    }

    private Warehouse findWarehouseOrThrow(UUID id) {
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse", id));
    }

    private Product findProductOrThrow(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }
}
