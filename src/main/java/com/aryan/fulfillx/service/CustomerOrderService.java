package com.aryan.fulfillx.service;

import com.aryan.fulfillx.dto.request.CustomerOrderRequest;
import com.aryan.fulfillx.dto.response.CustomerOrderResponse;
import java.util.List;
import java.util.UUID;

public interface CustomerOrderService {

    CustomerOrderResponse create(CustomerOrderRequest request);

    CustomerOrderResponse getById(UUID id);

    List<CustomerOrderResponse> getAll();

    CustomerOrderResponse update(UUID id, CustomerOrderRequest request);

    void delete(UUID id);
}
