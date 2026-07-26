package com.aryan.fulfillx.service;

import com.aryan.fulfillx.dto.request.AllocationRequest;
import com.aryan.fulfillx.dto.response.AllocationResponse;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AllocationService {

    AllocationResponse create(AllocationRequest request);

    AllocationResponse getById(UUID id);

    Page<AllocationResponse> getAll(Pageable pageable);

    AllocationResponse update(UUID id, AllocationRequest request);

    void delete(UUID id);
}
