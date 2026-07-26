package com.aryan.fulfillx.service.impl;

import com.aryan.fulfillx.dto.request.CustomerOrderFilterRequest;
import com.aryan.fulfillx.dto.request.CustomerOrderRequest;
import com.aryan.fulfillx.dto.request.OrderItemRequest;
import com.aryan.fulfillx.dto.response.CustomerOrderResponse;
import com.aryan.fulfillx.entity.Customer;
import com.aryan.fulfillx.entity.CustomerOrder;
import com.aryan.fulfillx.entity.OrderItem;
import com.aryan.fulfillx.entity.Product;
import com.aryan.fulfillx.exception.ResourceNotFoundException;
import com.aryan.fulfillx.mapper.CustomerOrderMapper;
import com.aryan.fulfillx.mapper.OrderItemMapper;
import com.aryan.fulfillx.repository.CustomerOrderRepository;
import com.aryan.fulfillx.repository.CustomerRepository;
import com.aryan.fulfillx.repository.ProductRepository;
import com.aryan.fulfillx.repository.spec.CustomerOrderSpecifications;
import com.aryan.fulfillx.service.CustomerOrderService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerOrderServiceImpl implements CustomerOrderService {

    private final CustomerOrderRepository customerOrderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final CustomerOrderMapper customerOrderMapper;
    private final OrderItemMapper orderItemMapper;

    @Override
    @Transactional
    public CustomerOrderResponse create(CustomerOrderRequest request) {
        log.debug("Creating customer order for customer {}", request.getCustomerId());
        CustomerOrder order = customerOrderMapper.toEntity(request);
        order.setCustomer(findCustomerOrThrow(request.getCustomerId()));
        order.setOrderItems(buildOrderItems(request.getOrderItems(), order));
        CustomerOrder saved = customerOrderRepository.save(order);
        return customerOrderMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerOrderResponse getById(UUID id) {
        CustomerOrder order = findCustomerOrderOrThrow(id);
        order.getOrderItems().size();
        return customerOrderMapper.toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerOrderResponse> getAll(CustomerOrderFilterRequest filter, Pageable pageable) {
        log.debug("Fetching customer orders page={}, size={}, sort={}, filter={}",
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort(), filter);
        return customerOrderRepository.findAll(CustomerOrderSpecifications.fromFilter(filter), pageable)
                .map(order -> {
                    order.getOrderItems().size();
                    return customerOrderMapper.toResponse(order);
                });
    }

    @Override
    @Transactional
    public CustomerOrderResponse update(UUID id, CustomerOrderRequest request) {
        CustomerOrder order = findCustomerOrderOrThrow(id);
        if (request.getCustomerId() != null) {
            order.setCustomer(findCustomerOrThrow(request.getCustomerId()));
        }
        customerOrderMapper.updateEntity(request, order);
        if (request.getOrderItems() != null) {
            order.getOrderItems().clear();
            order.getOrderItems().addAll(buildOrderItems(request.getOrderItems(), order));
        }
        return customerOrderMapper.toResponse(customerOrderRepository.save(order));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        CustomerOrder order = findCustomerOrderOrThrow(id);
        customerOrderRepository.delete(order);
        log.debug("Deleted customer order: {}", id);
    }

    private List<OrderItem> buildOrderItems(List<OrderItemRequest> itemRequests, CustomerOrder order) {
        return itemRequests.stream()
                .map(itemRequest -> {
                    OrderItem orderItem = orderItemMapper.toEntity(itemRequest);
                    orderItem.setOrder(order);
                    orderItem.setProduct(findProductOrThrow(itemRequest.getProductId()));
                    return orderItem;
                })
                .toList();
    }

    private CustomerOrder findCustomerOrderOrThrow(UUID id) {
        return customerOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerOrder", id));
    }

    private Customer findCustomerOrThrow(UUID id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", id));
    }

    private Product findProductOrThrow(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }
}
