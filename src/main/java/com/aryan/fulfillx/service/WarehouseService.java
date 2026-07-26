package com.aryan.fulfillx.service;

import com.aryan.fulfillx.dto.request.WarehouseRequest;
import com.aryan.fulfillx.dto.response.WarehouseResponse;
import java.util.List;
import java.util.UUID;

public interface WarehouseService {

    WarehouseResponse create(WarehouseRequest request);

    WarehouseResponse getById(UUID id);

    List<WarehouseResponse> getAll();

    WarehouseResponse update(UUID id, WarehouseRequest request);

    void delete(UUID id);
}
