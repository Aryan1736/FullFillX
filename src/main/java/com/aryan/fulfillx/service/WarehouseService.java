package com.aryan.fulfillx.service;

import com.aryan.fulfillx.dto.request.WarehouseRequest;
import com.aryan.fulfillx.dto.response.WarehouseResponse;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WarehouseService {

    WarehouseResponse create(WarehouseRequest request);

    WarehouseResponse getById(UUID id);

    Page<WarehouseResponse> getAll(Pageable pageable);

    WarehouseResponse update(UUID id, WarehouseRequest request);

    void delete(UUID id);
}
