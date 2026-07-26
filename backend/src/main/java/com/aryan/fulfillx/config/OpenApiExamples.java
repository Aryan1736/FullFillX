package com.aryan.fulfillx.config;

public final class OpenApiExamples {

    public static final String CUSTOMER_ID = "11111111-1111-1111-1111-111111111111";
    public static final String PRODUCT_ID = "22222222-2222-2222-2222-222222222222";
    public static final String WAREHOUSE_ID = "33333333-3333-3333-3333-333333333333";
    public static final String ORDER_ID = "44444444-4444-4444-4444-444444444444";
    public static final String INVENTORY_ID = "55555555-5555-5555-5555-555555555555";
    public static final String ALLOCATION_ID = "66666666-6666-6666-6666-666666666666";
    public static final String TIMESTAMP = "2026-07-26T12:00:00Z";

    public static final String CUSTOMER_REQUEST = """
            {
              "name": "Acme Logistics",
              "city": "Kolkata",
              "latitude": 22.5726,
              "longitude": 88.3639
            }
            """;

    public static final String PRODUCT_REQUEST = """
            {
              "name": "Wireless Mouse",
              "category": "Electronics",
              "weight": 0.25
            }
            """;

    public static final String WAREHOUSE_REQUEST = """
            {
              "name": "Kolkata Fulfillment Center",
              "city": "Kolkata",
              "latitude": 22.5726,
              "longitude": 88.3639,
              "capacity": 12000,
              "currentLoad": 4200,
              "active": true
            }
            """;

    public static final String INVENTORY_REQUEST = """
            {
              "warehouseId": "33333333-3333-3333-3333-333333333333",
              "productId": "22222222-2222-2222-2222-222222222222",
              "availableQuantity": 150,
              "reservedQuantity": 10
            }
            """;

    public static final String CUSTOMER_ORDER_REQUEST = """
            {
              "customerId": "11111111-1111-1111-1111-111111111111",
              "status": "PENDING",
              "totalItems": 2,
              "orderItems": [
                {
                  "productId": "22222222-2222-2222-2222-222222222222",
                  "quantity": 1
                },
                {
                  "productId": "77777777-7777-7777-7777-777777777777",
                  "quantity": 3
                }
              ]
            }
            """;

    public static final String ALLOCATION_REQUEST = """
            {
              "orderId": "44444444-4444-4444-4444-444444444444",
              "optimizationScore": 87.5,
              "shippingCost": 245.75,
              "estimatedDeliveryHours": 36,
              "allocationItems": [
                {
                  "warehouseId": "33333333-3333-3333-3333-333333333333",
                  "productId": "22222222-2222-2222-2222-222222222222",
                  "quantity": 2
                }
              ]
            }
            """;

    public static final String OPTIMIZATION_REQUEST = """
            {
              "orderId": "44444444-4444-4444-4444-444444444444",
              "destinationLatitude": 22.5726,
              "destinationLongitude": 88.3639,
              "orderLines": [
                {
                  "productId": "22222222-2222-2222-2222-222222222222",
                  "quantity": 2
                }
              ],
              "warehouseAvailabilities": [
                {
                  "warehouseId": "33333333-3333-3333-3333-333333333333",
                  "warehouseName": "Kolkata Fulfillment Center",
                  "latitude": 22.5726,
                  "longitude": 88.3639,
                  "capacity": 12000,
                  "currentLoad": 4200,
                  "availableStockByProductId": {
                    "22222222-2222-2222-2222-222222222222": 150
                  }
                }
              ],
              "optimizationWeights": {
                "distanceWeight": 0.35,
                "shippingCostWeight": 0.25,
                "inventoryWeight": 0.25,
                "warehouseLoadWeight": 0.15
              }
            }
            """;

    public static final String CUSTOMER_RESPONSE = """
            {
              "success": true,
              "message": "Customer created successfully",
              "data": {
                "id": "11111111-1111-1111-1111-111111111111",
                "name": "Acme Logistics",
                "city": "Kolkata",
                "latitude": 22.5726,
                "longitude": 88.3639,
                "createdAt": "2026-07-26T12:00:00Z",
                "updatedAt": "2026-07-26T12:00:00Z"
              },
              "timestamp": "2026-07-26T12:00:00Z"
            }
            """;

    public static final String PRODUCT_RESPONSE = """
            {
              "success": true,
              "message": "Product created successfully",
              "data": {
                "id": "22222222-2222-2222-2222-222222222222",
                "name": "Wireless Mouse",
                "category": "Electronics",
                "weight": 0.25,
                "createdAt": "2026-07-26T12:00:00Z",
                "updatedAt": "2026-07-26T12:00:00Z"
              },
              "timestamp": "2026-07-26T12:00:00Z"
            }
            """;

    public static final String WAREHOUSE_RESPONSE = """
            {
              "success": true,
              "message": "Warehouse created successfully",
              "data": {
                "id": "33333333-3333-3333-3333-333333333333",
                "name": "Kolkata Fulfillment Center",
                "city": "Kolkata",
                "latitude": 22.5726,
                "longitude": 88.3639,
                "capacity": 12000,
                "currentLoad": 4200,
                "active": true,
                "createdAt": "2026-07-26T12:00:00Z",
                "updatedAt": "2026-07-26T12:00:00Z"
              },
              "timestamp": "2026-07-26T12:00:00Z"
            }
            """;

    public static final String INVENTORY_RESPONSE = """
            {
              "success": true,
              "message": "Inventory record created successfully",
              "data": {
                "id": "55555555-5555-5555-5555-555555555555",
                "warehouseId": "33333333-3333-3333-3333-333333333333",
                "productId": "22222222-2222-2222-2222-222222222222",
                "availableQuantity": 150,
                "reservedQuantity": 10,
                "createdAt": "2026-07-26T12:00:00Z",
                "updatedAt": "2026-07-26T12:00:00Z"
              },
              "timestamp": "2026-07-26T12:00:00Z"
            }
            """;

    public static final String CUSTOMER_ORDER_RESPONSE = """
            {
              "success": true,
              "message": "Customer order created successfully",
              "data": {
                "id": "44444444-4444-4444-4444-444444444444",
                "customerId": "11111111-1111-1111-1111-111111111111",
                "status": "PENDING",
                "totalItems": 2,
                "orderItems": [
                  {
                    "id": "88888888-8888-8888-8888-888888888888",
                    "orderId": "44444444-4444-4444-4444-444444444444",
                    "productId": "22222222-2222-2222-2222-222222222222",
                    "quantity": 1
                  }
                ],
                "createdAt": "2026-07-26T12:00:00Z",
                "updatedAt": "2026-07-26T12:00:00Z"
              },
              "timestamp": "2026-07-26T12:00:00Z"
            }
            """;

    public static final String ALLOCATION_RESPONSE = """
            {
              "success": true,
              "message": "Allocation created successfully",
              "data": {
                "id": "66666666-6666-6666-6666-666666666666",
                "orderId": "44444444-4444-4444-4444-444444444444",
                "optimizationScore": 87.5,
                "shippingCost": 245.75,
                "estimatedDeliveryHours": 36,
                "allocationItems": [
                  {
                    "id": "99999999-9999-9999-9999-999999999999",
                    "allocationId": "66666666-6666-6666-6666-666666666666",
                    "warehouseId": "33333333-3333-3333-3333-333333333333",
                    "productId": "22222222-2222-2222-2222-222222222222",
                    "quantity": 2
                  }
                ],
                "createdAt": "2026-07-26T12:00:00Z",
                "updatedAt": "2026-07-26T12:00:00Z"
              },
              "timestamp": "2026-07-26T12:00:00Z"
            }
            """;

    public static final String ALLOCATION_DETAIL_RESPONSE = """
            {
              "success": true,
              "data": {
                "id": "66666666-6666-6666-6666-666666666666",
                "orderId": "44444444-4444-4444-4444-444444444444",
                "strategyName": "multi-factor-scoring",
                "score": 87.5,
                "scoreBreakdown": {
                  "distanceScore": 92.0,
                  "shippingCostScore": 84.0,
                  "inventoryScore": 88.0,
                  "warehouseLoadScore": 86.0
                },
                "shippingCost": 245.75,
                "eta": 36,
                "reasoning": [
                  {
                    "factor": "distance",
                    "score": 92.0,
                    "explanation": "Warehouse is closest to destination"
                  }
                ],
                "warehouses": [
                  {
                    "warehouseId": "33333333-3333-3333-3333-333333333333",
                    "warehouseName": "Kolkata Fulfillment Center",
                    "city": "Kolkata",
                    "quantityAllocated": 2
                  }
                ],
                "products": [
                  {
                    "productId": "22222222-2222-2222-2222-222222222222",
                    "productName": "Wireless Mouse",
                    "quantityAllocated": 2
                  }
                ],
                "createdAt": "2026-07-26T12:00:00Z",
                "updatedAt": "2026-07-26T12:00:00Z"
              },
              "timestamp": "2026-07-26T12:00:00Z"
            }
            """;

    public static final String OPTIMIZATION_RESPONSE = """
            {
              "success": true,
              "message": "Optimization completed successfully",
              "data": {
                "strategyName": "multi-factor-scoring",
                "warehouseCandidates": [
                  {
                    "warehouseId": "33333333-3333-3333-3333-333333333333",
                    "warehouseName": "Kolkata Fulfillment Center",
                    "score": 87.5,
                    "distanceKm": 12.4,
                    "shippingCost": 245.75,
                    "estimatedDeliveryHours": 36,
                    "canFulfillEntireOrder": true
                  }
                ],
                "optimizationScore": 87.5,
                "totalShippingCost": 245.75,
                "estimatedDeliveryHours": 36,
                "scoreBreakdown": {
                  "distanceScore": 92.0,
                  "shippingCostScore": 84.0,
                  "inventoryScore": 88.0,
                  "warehouseLoadScore": 86.0
                },
                "reasoning": [
                  {
                    "factor": "distance",
                    "score": 92.0,
                    "explanation": "Warehouse is closest to destination"
                  }
                ],
                "selectedWarehouses": ["33333333-3333-3333-3333-333333333333"],
                "estimatedSavings": 54.25
              },
              "timestamp": "2026-07-26T12:00:00Z"
            }
            """;

    public static final String PAGE_RESPONSE = """
            {
              "success": true,
              "data": {
                "content": [
                  {
                    "id": "11111111-1111-1111-1111-111111111111",
                    "name": "Acme Logistics",
                    "city": "Kolkata",
                    "latitude": 22.5726,
                    "longitude": 88.3639,
                    "createdAt": "2026-07-26T12:00:00Z",
                    "updatedAt": "2026-07-26T12:00:00Z"
                  }
                ],
                "page": 0,
                "size": 20,
                "totalElements": 1,
                "totalPages": 1,
                "first": true,
                "last": true,
                "sort": "name: ASC"
              },
              "timestamp": "2026-07-26T12:00:00Z"
            }
            """;

    public static final String ANALYTICS_RESPONSE = """
            {
              "success": true,
              "data": {
                "totalOrders": 30,
                "totalWarehouses": 5,
                "totalProducts": 20,
                "inventoryUtilization": 62.5,
                "warehouseUtilization": 58.3,
                "averageShippingCost": 312.40,
                "averageETA": 42.0,
                "totalSplitShipments": 4
              },
              "timestamp": "2026-07-26T12:00:00Z"
            }
            """;

    public static final String WAREHOUSE_UTILIZATION_RESPONSE = """
            {
              "success": true,
              "data": {
                "averageUtilization": 58.3,
                "warehouses": [
                  {
                    "warehouseId": "33333333-3333-3333-3333-333333333333",
                    "warehouseName": "Kolkata Fulfillment Center",
                    "city": "Kolkata",
                    "capacity": 12000,
                    "currentLoad": 4200,
                    "utilizationPercent": 35.0
                  }
                ]
              },
              "timestamp": "2026-07-26T12:00:00Z"
            }
            """;

    public static final String INVENTORY_STATUS_RESPONSE = """
            {
              "success": true,
              "data": {
                "totalRecords": 100,
                "inStockCount": 82,
                "lowStockCount": 12,
                "outOfStockCount": 6,
                "items": [
                  {
                    "productId": "22222222-2222-2222-2222-222222222222",
                    "productName": "Wireless Mouse",
                    "warehouseId": "33333333-3333-3333-3333-333333333333",
                    "warehouseName": "Kolkata Fulfillment Center",
                    "availableQuantity": 150,
                    "status": "IN_STOCK"
                  }
                ]
              },
              "timestamp": "2026-07-26T12:00:00Z"
            }
            """;

    public static final String SHIPPING_COST_ANALYSIS_RESPONSE = """
            {
              "success": true,
              "data": {
                "averageShippingCost": 312.40,
                "minShippingCost": 89.50,
                "maxShippingCost": 1240.00,
                "totalShippingCost": 9372.00,
                "allocationCount": 30
              },
              "timestamp": "2026-07-26T12:00:00Z"
            }
            """;

    public static final String VALIDATION_ERROR_RESPONSE = """
            {
              "success": false,
              "message": "Validation failed",
              "status": 400,
              "timestamp": "2026-07-26T12:00:00Z",
              "path": "/api/v1/customers",
              "errors": [
                {
                  "field": "name",
                  "message": "Customer name is required",
                  "rejectedValue": null
                }
              ]
            }
            """;

    public static final String NOT_FOUND_ERROR_RESPONSE = """
            {
              "success": false,
              "message": "Customer not found with id: 11111111-1111-1111-1111-111111111111",
              "status": 404,
              "timestamp": "2026-07-26T12:00:00Z",
              "path": "/api/v1/customers/11111111-1111-1111-1111-111111111111",
              "errors": []
            }
            """;

    private OpenApiExamples() {
    }
}
