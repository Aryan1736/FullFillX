package com.aryan.fulfillx.service;

import com.aryan.fulfillx.dto.request.CustomerRequest;
import com.aryan.fulfillx.dto.response.CustomerResponse;
import java.util.List;
import java.util.UUID;

public interface CustomerService {

    CustomerResponse create(CustomerRequest request);

    CustomerResponse getById(UUID id);

    List<CustomerResponse> getAll();

    CustomerResponse update(UUID id, CustomerRequest request);

    void delete(UUID id);
}
