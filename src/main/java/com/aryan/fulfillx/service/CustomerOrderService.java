package com.aryan.fulfillx.service;

import com.aryan.fulfillx.dto.request.CustomerOrderRequest;
import com.aryan.fulfillx.dto.response.CustomerOrderResponse;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerOrderService {

    CustomerOrderResponse create(CustomerOrderRequest request);

    CustomerOrderResponse getById(UUID id);

    Page<CustomerOrderResponse> getAll(Pageable pageable);

    CustomerOrderResponse update(UUID id, CustomerOrderRequest request);

    void delete(UUID id);
}
