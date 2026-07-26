package com.aryan.fulfillx.service.impl;

import com.aryan.fulfillx.dto.request.AllocationItemRequest;
import com.aryan.fulfillx.dto.request.AllocationRequest;
import com.aryan.fulfillx.dto.response.AllocationResponse;
import com.aryan.fulfillx.entity.Allocation;
import com.aryan.fulfillx.entity.AllocationItem;
import com.aryan.fulfillx.entity.CustomerOrder;
import com.aryan.fulfillx.entity.Product;
import com.aryan.fulfillx.entity.Warehouse;
import com.aryan.fulfillx.exception.ResourceNotFoundException;
import com.aryan.fulfillx.mapper.AllocationItemMapper;
import com.aryan.fulfillx.mapper.AllocationMapper;
import com.aryan.fulfillx.repository.AllocationRepository;
import com.aryan.fulfillx.repository.CustomerOrderRepository;
import com.aryan.fulfillx.repository.ProductRepository;
import com.aryan.fulfillx.repository.WarehouseRepository;
import com.aryan.fulfillx.service.AllocationService;
import java.util.List;
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
public class AllocationServiceImpl implements AllocationService {

    private final AllocationRepository allocationRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final AllocationMapper allocationMapper;
    private final AllocationItemMapper allocationItemMapper;

    @Override
    @Transactional
    public AllocationResponse create(AllocationRequest request) {
        log.debug("Creating allocation for order {}", request.getOrderId());
        Allocation allocation = allocationMapper.toEntity(request);
        allocation.setOrder(findCustomerOrderOrThrow(request.getOrderId()));
        allocation.setAllocationItems(buildAllocationItems(request.getAllocationItems(), allocation));
        Allocation saved = allocationRepository.save(allocation);
        log.info(
                "event=allocation_persisted allocationId={} orderId={} itemCount={} optimizationScore={}",
                saved.getId(),
                saved.getOrder().getId(),
                saved.getAllocationItems().size(),
                saved.getOptimizationScore());
        return allocationMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AllocationResponse getById(UUID id) {
        Allocation allocation = findAllocationOrThrow(id);
        allocation.getAllocationItems().size();
        return allocationMapper.toResponse(allocation);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AllocationResponse> getAll(Pageable pageable) {
        log.debug("Fetching allocations page={}, size={}, sort={}",
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort());
        return allocationRepository.findAll(pageable)
                .map(allocation -> {
                    allocation.getAllocationItems().size();
                    return allocationMapper.toResponse(allocation);
                });
    }

    @Override
    @Transactional
    public AllocationResponse update(UUID id, AllocationRequest request) {
        Allocation allocation = findAllocationOrThrow(id);
        if (request.getOrderId() != null) {
            allocation.setOrder(findCustomerOrderOrThrow(request.getOrderId()));
        }
        allocationMapper.updateEntity(request, allocation);
        if (request.getAllocationItems() != null) {
            allocation.getAllocationItems().clear();
            allocation.getAllocationItems().addAll(
                    buildAllocationItems(request.getAllocationItems(), allocation));
        }
        Allocation saved = allocationRepository.save(allocation);
        log.info(
                "event=allocation_persisted allocationId={} orderId={} itemCount={} optimizationScore={}",
                saved.getId(),
                saved.getOrder().getId(),
                saved.getAllocationItems().size(),
                saved.getOptimizationScore());
        return allocationMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Allocation allocation = findAllocationOrThrow(id);
        allocationRepository.delete(allocation);
        log.debug("Deleted allocation: {}", id);
    }

    private List<AllocationItem> buildAllocationItems(
            List<AllocationItemRequest> itemRequests, Allocation allocation) {
        return itemRequests.stream()
                .map(itemRequest -> {
                    AllocationItem allocationItem = allocationItemMapper.toEntity(itemRequest);
                    allocationItem.setAllocation(allocation);
                    allocationItem.setWarehouse(findWarehouseOrThrow(itemRequest.getWarehouseId()));
                    allocationItem.setProduct(findProductOrThrow(itemRequest.getProductId()));
                    return allocationItem;
                })
                .toList();
    }

    private Allocation findAllocationOrThrow(UUID id) {
        return allocationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation", id));
    }

    private CustomerOrder findCustomerOrderOrThrow(UUID id) {
        return customerOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerOrder", id));
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
