package com.aryan.fulfillx.service;

import com.aryan.fulfillx.dto.request.InventoryRequest;
import com.aryan.fulfillx.dto.response.InventoryResponse;
import java.util.List;
import java.util.UUID;

public interface InventoryService {

    InventoryResponse create(InventoryRequest request);

    InventoryResponse getById(UUID id);

    List<InventoryResponse> getAll();

    InventoryResponse update(UUID id, InventoryRequest request);

    void delete(UUID id);
}
