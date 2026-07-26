package com.aryan.fulfillx.service;

import com.aryan.fulfillx.dto.request.AllocationFilterRequest;
import com.aryan.fulfillx.dto.response.AllocationDetailResponse;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AllocationHistoryService {

    AllocationDetailResponse getById(UUID id);

    Page<AllocationDetailResponse> getAll(AllocationFilterRequest filter, Pageable pageable);

    AllocationDetailResponse getByOrderId(UUID orderId);
}
