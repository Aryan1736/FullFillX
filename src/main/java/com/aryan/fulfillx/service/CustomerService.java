package com.aryan.fulfillx.service;

import com.aryan.fulfillx.dto.request.CustomerRequest;
import com.aryan.fulfillx.dto.response.CustomerResponse;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerService {

    CustomerResponse create(CustomerRequest request);

    CustomerResponse getById(UUID id);

    Page<CustomerResponse> getAll(Pageable pageable);

    CustomerResponse update(UUID id, CustomerRequest request);

    void delete(UUID id);
}
