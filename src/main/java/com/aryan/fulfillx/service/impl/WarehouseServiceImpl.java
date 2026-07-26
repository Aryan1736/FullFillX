package com.aryan.fulfillx.service.impl;

import com.aryan.fulfillx.dto.request.WarehouseRequest;
import com.aryan.fulfillx.dto.response.WarehouseResponse;
import com.aryan.fulfillx.entity.Warehouse;
import com.aryan.fulfillx.exception.ResourceNotFoundException;
import com.aryan.fulfillx.mapper.WarehouseMapper;
import com.aryan.fulfillx.repository.WarehouseRepository;
import com.aryan.fulfillx.service.WarehouseService;
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
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final WarehouseMapper warehouseMapper;

    @Override
    @Transactional
    public WarehouseResponse create(WarehouseRequest request) {
        log.debug("Creating warehouse: {}", request.getName());
        Warehouse warehouse = warehouseMapper.toEntity(request);
        Warehouse saved = warehouseRepository.save(warehouse);
        return warehouseMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public WarehouseResponse getById(UUID id) {
        return warehouseMapper.toResponse(findWarehouseOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<WarehouseResponse> getAll(Pageable pageable) {
        log.debug("Fetching warehouses page={}, size={}, sort={}",
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort());
        return warehouseRepository.findAll(pageable).map(warehouseMapper::toResponse);
    }

    @Override
    @Transactional
    public WarehouseResponse update(UUID id, WarehouseRequest request) {
        Warehouse warehouse = findWarehouseOrThrow(id);
        warehouseMapper.updateEntity(request, warehouse);
        return warehouseMapper.toResponse(warehouseRepository.save(warehouse));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Warehouse warehouse = findWarehouseOrThrow(id);
        warehouseRepository.delete(warehouse);
        log.debug("Deleted warehouse: {}", id);
    }

    private Warehouse findWarehouseOrThrow(UUID id) {
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse", id));
    }
}
