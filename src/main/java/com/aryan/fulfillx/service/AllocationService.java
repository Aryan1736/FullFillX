package com.aryan.fulfillx.service;

import com.aryan.fulfillx.dto.request.AllocationRequest;
import com.aryan.fulfillx.dto.response.AllocationResponse;
import java.util.List;
import java.util.UUID;

public interface AllocationService {

    AllocationResponse create(AllocationRequest request);

    AllocationResponse getById(UUID id);

    List<AllocationResponse> getAll();

    AllocationResponse update(UUID id, AllocationRequest request);

    void delete(UUID id);
}
