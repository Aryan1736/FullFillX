package com.aryan.fulfillx.mapper;

import com.aryan.fulfillx.dto.request.CustomerOrderRequest;
import com.aryan.fulfillx.dto.response.CustomerOrderResponse;
import com.aryan.fulfillx.entity.CustomerOrder;
import com.aryan.fulfillx.entity.OrderStatus;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", uses = OrderItemMapper.class)
public interface CustomerOrderMapper {

    @Mapping(source = "customer.id", target = "customerId")
    CustomerOrderResponse toResponse(CustomerOrder customerOrder);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", expression = "java(resolveStatus(request.getStatus()))")
    CustomerOrder toEntity(CustomerOrderRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(CustomerOrderRequest request, @MappingTarget CustomerOrder customerOrder);

    default OrderStatus resolveStatus(OrderStatus status) {
        return status != null ? status : OrderStatus.PENDING;
    }
}
