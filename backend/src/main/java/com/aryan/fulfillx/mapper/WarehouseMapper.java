package com.aryan.fulfillx.mapper;

import com.aryan.fulfillx.dto.request.WarehouseRequest;
import com.aryan.fulfillx.dto.response.WarehouseResponse;
import com.aryan.fulfillx.entity.Warehouse;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface WarehouseMapper {

    WarehouseResponse toResponse(Warehouse warehouse);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "inventories", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "active", expression = "java(request.getActive() != null ? request.getActive() : true)")
    Warehouse toEntity(WarehouseRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "inventories", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(WarehouseRequest request, @MappingTarget Warehouse warehouse);
}
