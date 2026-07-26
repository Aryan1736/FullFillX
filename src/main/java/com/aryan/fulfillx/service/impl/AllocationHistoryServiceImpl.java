package com.aryan.fulfillx.service.impl;

import com.aryan.fulfillx.dto.response.AllocationDetailResponse;
import com.aryan.fulfillx.entity.Allocation;
import com.aryan.fulfillx.exception.ResourceNotFoundException;
import com.aryan.fulfillx.mapper.AllocationDetailMapper;
import com.aryan.fulfillx.repository.AllocationRepository;
import com.aryan.fulfillx.repository.CustomerOrderRepository;
import com.aryan.fulfillx.service.AllocationHistoryService;
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
public class AllocationHistoryServiceImpl implements AllocationHistoryService {

    private final AllocationRepository allocationRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final AllocationDetailMapper allocationDetailMapper;

    @Override
    @Transactional(readOnly = true)
    public AllocationDetailResponse getById(UUID id) {
        Allocation allocation = allocationRepository.findDetailedById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation", id));
        return allocationDetailMapper.toDetailResponse(allocation);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AllocationDetailResponse> getAll(Pageable pageable) {
        log.debug("Fetching allocation history page={}, size={}, sort={}",
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort());
        return allocationRepository.findAllDetailed(pageable)
                .map(allocationDetailMapper::toDetailResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AllocationDetailResponse getByOrderId(UUID orderId) {
        customerOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerOrder", orderId));

        Allocation allocation = allocationRepository.findTopByOrder_IdOrderByCreatedAtDesc(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation for order", orderId));
        return allocationDetailMapper.toDetailResponse(allocation);
    }
}
