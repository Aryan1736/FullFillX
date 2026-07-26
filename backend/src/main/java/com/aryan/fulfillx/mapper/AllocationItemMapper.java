package com.aryan.fulfillx.mapper;

import com.aryan.fulfillx.dto.request.AllocationItemRequest;
import com.aryan.fulfillx.dto.response.AllocationItemResponse;
import com.aryan.fulfillx.entity.AllocationItem;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface AllocationItemMapper {

    @Mapping(source = "allocation.id", target = "allocationId")
    @Mapping(source = "warehouse.id", target = "warehouseId")
    @Mapping(source = "product.id", target = "productId")
    AllocationItemResponse toResponse(AllocationItem allocationItem);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "allocation", ignore = true)
    @Mapping(target = "warehouse", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    AllocationItem toEntity(AllocationItemRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "allocation", ignore = true)
    @Mapping(target = "warehouse", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(AllocationItemRequest request, @MappingTarget AllocationItem allocationItem);
}
