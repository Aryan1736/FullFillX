package com.aryan.fulfillx.util;

import com.aryan.fulfillx.constant.InventoryConstants;
import com.aryan.fulfillx.entity.Inventory;

public final class InventoryStatusResolver {

    private InventoryStatusResolver() {
    }

    public static String resolveStatus(int availableQuantity) {
        if (availableQuantity == 0) {
            return "OUT_OF_STOCK";
        }
        if (availableQuantity < InventoryConstants.LOW_STOCK_THRESHOLD) {
            return "LOW_STOCK";
        }
        return "IN_STOCK";
    }

    public static boolean isLowStock(Inventory inventory) {
        Integer availableQuantity = inventory.getAvailableQuantity();
        return availableQuantity != null
                && availableQuantity > 0
                && availableQuantity < InventoryConstants.LOW_STOCK_THRESHOLD;
    }
}
