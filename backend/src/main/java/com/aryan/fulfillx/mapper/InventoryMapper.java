package com.aryan.fulfillx.mapper;

import com.aryan.fulfillx.constant.InventoryConstants;
import com.aryan.fulfillx.dto.request.InventoryRequest;
import com.aryan.fulfillx.dto.response.InventoryResponse;
import com.aryan.fulfillx.entity.Inventory;
import com.aryan.fulfillx.entity.Product;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface InventoryMapper {

    @Mapping(source = "warehouse.id", target = "warehouseId")
    @Mapping(source = "warehouse.name", target = "warehouseName")
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(target = "sku", expression = "java(toSku(inventory.getProduct()))")
    @Mapping(target = "lowStock", expression = "java(isLowStock(inventory))")
    InventoryResponse toResponse(Inventory inventory);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "warehouse", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Inventory toEntity(InventoryRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "warehouse", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(InventoryRequest request, @MappingTarget Inventory inventory);

    default String toSku(Product product) {
        if (product == null || product.getCategory() == null || product.getName() == null) {
            return "";
        }

        String categoryCode = product.getCategory()
                .toUpperCase()
                .replaceAll("[^A-Z0-9]", "");
        if (categoryCode.isEmpty()) {
            categoryCode = "ITEM";
        } else {
            categoryCode = categoryCode.substring(0, Math.min(4, categoryCode.length()));
        }

        String nameCode = product.getName()
                .toUpperCase()
                .replaceAll("[^A-Z0-9]+", "-")
                .replaceAll("^-|-$", "");

        return categoryCode + "-" + nameCode;
    }

    default boolean isLowStock(Inventory inventory) {
        Integer availableQuantity = inventory.getAvailableQuantity();
        return availableQuantity != null
                && availableQuantity > 0
                && availableQuantity < InventoryConstants.LOW_STOCK_THRESHOLD;
    }
}
