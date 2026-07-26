package com.aryan.fulfillx.service;

import com.aryan.fulfillx.dto.request.ProductRequest;
import com.aryan.fulfillx.dto.response.ProductResponse;
import java.util.List;
import java.util.UUID;

public interface ProductService {

    ProductResponse create(ProductRequest request);

    ProductResponse getById(UUID id);

    List<ProductResponse> getAll();

    ProductResponse update(UUID id, ProductRequest request);

    void delete(UUID id);
}
