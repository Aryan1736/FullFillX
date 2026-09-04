package com.aryan.fulfillx.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.aryan.fulfillx.dto.request.CustomerOrderRequest;
import com.aryan.fulfillx.dto.request.OrderItemRequest;
import com.aryan.fulfillx.dto.response.CustomerOrderResponse;
import com.aryan.fulfillx.entity.Customer;
import com.aryan.fulfillx.entity.CustomerOrder;
import com.aryan.fulfillx.entity.OrderItem;
import com.aryan.fulfillx.entity.OrderStatus;
import com.aryan.fulfillx.entity.Product;
import com.aryan.fulfillx.exception.ResourceNotFoundException;
import com.aryan.fulfillx.mapper.CustomerOrderMapper;
import com.aryan.fulfillx.mapper.OrderItemMapper;
import com.aryan.fulfillx.repository.CustomerOrderRepository;
import com.aryan.fulfillx.repository.CustomerRepository;
import com.aryan.fulfillx.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@DisplayName("CustomerOrderServiceImpl")
class CustomerOrderServiceImplTest {

    private static final UUID CUSTOMER_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID ORDER_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private static final UUID PRODUCT_1_ID = UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private static final UUID PRODUCT_2_ID = UUID.fromString("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");

    @Mock
    private CustomerOrderRepository customerOrderRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CustomerOrderMapper customerOrderMapper;

    @Mock
    private OrderItemMapper orderItemMapper;

    @InjectMocks
    private CustomerOrderServiceImpl customerOrderService;

    private Customer customer;
    private Product product1;
    private Product product2;

    @BeforeEach
    void setUp() {
        customer = Customer.builder()
                .id(CUSTOMER_ID)
                .name("Ananya Sharma")
                .city("Mumbai")
                .build();

        product1 = Product.builder()
                .id(PRODUCT_1_ID)
                .name("Wireless Mouse")
                .category("Electronics")
                .weight(new BigDecimal("0.120"))
                .build();

        product2 = Product.builder()
                .id(PRODUCT_2_ID)
                .name("USB-C Hub")
                .category("Electronics")
                .weight(new BigDecimal("0.180"))
                .build();
    }

    @Test
    @DisplayName("create batches product lookup for multiple items and saves order")
    void create_multipleItems_batchesProductLookup() {
        OrderItemRequest itemReq1 = OrderItemRequest.builder().productId(PRODUCT_1_ID).quantity(2).build();
        OrderItemRequest itemReq2 = OrderItemRequest.builder().productId(PRODUCT_2_ID).quantity(3).build();

        CustomerOrderRequest request = CustomerOrderRequest.builder()
                .customerId(CUSTOMER_ID)
                .status(OrderStatus.PENDING)
                .totalItems(5)
                .orderItems(List.of(itemReq1, itemReq2))
                .build();

        CustomerOrder orderEntity = CustomerOrder.builder()
                .status(OrderStatus.PENDING)
                .totalItems(5)
                .build();

        OrderItem orderItem1 = OrderItem.builder().quantity(2).build();
        OrderItem orderItem2 = OrderItem.builder().quantity(3).build();

        when(customerRepository.findById(CUSTOMER_ID)).thenReturn(Optional.of(customer));
        when(customerOrderMapper.toEntity(request)).thenReturn(orderEntity);
        when(productRepository.findAllById(Set.of(PRODUCT_1_ID, PRODUCT_2_ID)))
                .thenReturn(List.of(product1, product2));
        when(orderItemMapper.toEntity(itemReq1)).thenReturn(orderItem1);
        when(orderItemMapper.toEntity(itemReq2)).thenReturn(orderItem2);
        when(customerOrderRepository.save(orderEntity)).thenReturn(orderEntity);
        when(customerOrderMapper.toResponse(orderEntity)).thenReturn(
                CustomerOrderResponse.builder().id(ORDER_ID).build());

        CustomerOrderResponse response = customerOrderService.create(request);

        assertNotNull(response);
        assertEquals(ORDER_ID, response.getId());
        assertEquals(customer, orderEntity.getCustomer());
        assertEquals(2, orderEntity.getOrderItems().size());
        assertEquals(product1, orderItem1.getProduct());
        assertEquals(orderEntity, orderItem1.getOrder());
        assertEquals(product2, orderItem2.getProduct());
        assertEquals(orderEntity, orderItem2.getOrder());

        verify(productRepository).findAllById(Set.of(PRODUCT_1_ID, PRODUCT_2_ID));
        verify(productRepository, never()).findById(any());
        verify(customerOrderRepository).save(orderEntity);
    }

    @Test
    @DisplayName("create handles duplicate product IDs in order items and queries product once")
    void create_duplicateProductIds_queriesProductOnce() {
        OrderItemRequest itemReq1 = OrderItemRequest.builder().productId(PRODUCT_1_ID).quantity(1).build();
        OrderItemRequest itemReq2 = OrderItemRequest.builder().productId(PRODUCT_1_ID).quantity(4).build();

        CustomerOrderRequest request = CustomerOrderRequest.builder()
                .customerId(CUSTOMER_ID)
                .status(OrderStatus.PENDING)
                .totalItems(5)
                .orderItems(List.of(itemReq1, itemReq2))
                .build();

        CustomerOrder orderEntity = CustomerOrder.builder()
                .status(OrderStatus.PENDING)
                .totalItems(5)
                .build();

        OrderItem orderItem1 = OrderItem.builder().quantity(1).build();
        OrderItem orderItem2 = OrderItem.builder().quantity(4).build();

        when(customerRepository.findById(CUSTOMER_ID)).thenReturn(Optional.of(customer));
        when(customerOrderMapper.toEntity(request)).thenReturn(orderEntity);
        when(productRepository.findAllById(Set.of(PRODUCT_1_ID)))
                .thenReturn(List.of(product1));
        when(orderItemMapper.toEntity(itemReq1)).thenReturn(orderItem1);
        when(orderItemMapper.toEntity(itemReq2)).thenReturn(orderItem2);
        when(customerOrderRepository.save(orderEntity)).thenReturn(orderEntity);
        when(customerOrderMapper.toResponse(orderEntity)).thenReturn(
                CustomerOrderResponse.builder().id(ORDER_ID).build());

        CustomerOrderResponse response = customerOrderService.create(request);

        assertNotNull(response);
        assertEquals(2, orderEntity.getOrderItems().size());
        assertEquals(product1, orderItem1.getProduct());
        assertEquals(product1, orderItem2.getProduct());

        verify(productRepository).findAllById(Set.of(PRODUCT_1_ID));
        verify(productRepository, never()).findById(any());
    }

    @Test
    @DisplayName("create throws ResourceNotFoundException when requested product does not exist")
    void create_missingProduct_throwsResourceNotFoundException() {
        UUID missingProductId = UUID.fromString("cccccccc-cccc-cccc-cccc-cccccccccccc");
        OrderItemRequest itemReq1 = OrderItemRequest.builder().productId(PRODUCT_1_ID).quantity(1).build();
        OrderItemRequest itemReq2 = OrderItemRequest.builder().productId(missingProductId).quantity(2).build();

        CustomerOrderRequest request = CustomerOrderRequest.builder()
                .customerId(CUSTOMER_ID)
                .status(OrderStatus.PENDING)
                .totalItems(3)
                .orderItems(List.of(itemReq1, itemReq2))
                .build();

        CustomerOrder orderEntity = CustomerOrder.builder().build();

        when(customerRepository.findById(CUSTOMER_ID)).thenReturn(Optional.of(customer));
        when(customerOrderMapper.toEntity(request)).thenReturn(orderEntity);
        when(productRepository.findAllById(Set.of(PRODUCT_1_ID, missingProductId)))
                .thenReturn(List.of(product1));
        when(orderItemMapper.toEntity(itemReq1)).thenReturn(new OrderItem());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> customerOrderService.create(request));

        assertEquals("Product not found with id: " + missingProductId, exception.getMessage());
        verify(customerOrderRepository, never()).save(any());
    }

    @Test
    @DisplayName("update batches product lookup when order items are modified")
    void update_withNewOrderItems_batchesProductLookup() {
        CustomerOrder existingOrder = CustomerOrder.builder()
                .id(ORDER_ID)
                .customer(customer)
                .orderItems(new ArrayList<>())
                .build();

        OrderItemRequest itemReq1 = OrderItemRequest.builder().productId(PRODUCT_1_ID).quantity(2).build();
        OrderItemRequest itemReq2 = OrderItemRequest.builder().productId(PRODUCT_2_ID).quantity(1).build();

        CustomerOrderRequest updateRequest = CustomerOrderRequest.builder()
                .totalItems(3)
                .orderItems(List.of(itemReq1, itemReq2))
                .build();

        OrderItem orderItem1 = OrderItem.builder().quantity(2).build();
        OrderItem orderItem2 = OrderItem.builder().quantity(1).build();

        when(customerOrderRepository.findById(ORDER_ID)).thenReturn(Optional.of(existingOrder));
        when(productRepository.findAllById(Set.of(PRODUCT_1_ID, PRODUCT_2_ID)))
                .thenReturn(List.of(product1, product2));
        when(orderItemMapper.toEntity(itemReq1)).thenReturn(orderItem1);
        when(orderItemMapper.toEntity(itemReq2)).thenReturn(orderItem2);
        when(customerOrderRepository.save(existingOrder)).thenReturn(existingOrder);
        when(customerOrderMapper.toResponse(existingOrder)).thenReturn(
                CustomerOrderResponse.builder().id(ORDER_ID).build());

        CustomerOrderResponse response = customerOrderService.update(ORDER_ID, updateRequest);

        assertNotNull(response);
        verify(customerOrderMapper).updateEntity(updateRequest, existingOrder);
        verify(productRepository).findAllById(Set.of(PRODUCT_1_ID, PRODUCT_2_ID));
        verify(productRepository, never()).findById(any());
        assertEquals(2, existingOrder.getOrderItems().size());
    }

    @Test
    @DisplayName("update throws ResourceNotFoundException when an updated product does not exist")
    void update_missingProduct_throwsResourceNotFoundException() {
        CustomerOrder existingOrder = CustomerOrder.builder()
                .id(ORDER_ID)
                .customer(customer)
                .orderItems(new ArrayList<>())
                .build();

        UUID missingProductId = UUID.fromString("cccccccc-cccc-cccc-cccc-cccccccccccc");
        OrderItemRequest itemReq = OrderItemRequest.builder().productId(missingProductId).quantity(2).build();

        CustomerOrderRequest updateRequest = CustomerOrderRequest.builder()
                .orderItems(List.of(itemReq))
                .build();

        when(customerOrderRepository.findById(ORDER_ID)).thenReturn(Optional.of(existingOrder));
        when(productRepository.findAllById(Set.of(missingProductId))).thenReturn(List.of());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> customerOrderService.update(ORDER_ID, updateRequest));

        assertEquals("Product not found with id: " + missingProductId, exception.getMessage());
        verify(customerOrderRepository, never()).save(any());
    }
}
