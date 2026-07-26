package com.aryan.fulfillx.service;

import com.aryan.fulfillx.dto.request.InventoryRequest;
import com.aryan.fulfillx.dto.response.InventoryResponse;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InventoryService {

    InventoryResponse create(InventoryRequest request);

    InventoryResponse getById(UUID id);

    Page<InventoryResponse> getAll(Pageable pageable);

    InventoryResponse update(UUID id, InventoryRequest request);

    void delete(UUID id);
}
