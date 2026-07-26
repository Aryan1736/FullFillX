package com.aryan.fulfillx.mapper;

import com.aryan.fulfillx.dto.request.AllocationRequest;
import com.aryan.fulfillx.dto.response.AllocationResponse;
import com.aryan.fulfillx.entity.Allocation;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", uses = AllocationItemMapper.class)
public interface AllocationMapper {

    @Mapping(source = "order.id", target = "orderId")
    AllocationResponse toResponse(Allocation allocation);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "allocationItems", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Allocation toEntity(AllocationRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "allocationItems", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(AllocationRequest request, @MappingTarget Allocation allocation);
}
