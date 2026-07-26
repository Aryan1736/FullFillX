package com.aryan.fulfillx.service;

import com.aryan.fulfillx.dto.request.ProductRequest;
import com.aryan.fulfillx.dto.response.ProductResponse;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {

    ProductResponse create(ProductRequest request);

    ProductResponse getById(UUID id);

    Page<ProductResponse> getAll(Pageable pageable);

    ProductResponse update(UUID id, ProductRequest request);

    void delete(UUID id);
}
