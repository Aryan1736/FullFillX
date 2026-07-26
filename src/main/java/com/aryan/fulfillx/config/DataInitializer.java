package com.aryan.fulfillx.config;

import com.aryan.fulfillx.entity.Customer;
import com.aryan.fulfillx.entity.CustomerOrder;
import com.aryan.fulfillx.entity.Inventory;
import com.aryan.fulfillx.entity.OrderItem;
import com.aryan.fulfillx.entity.OrderStatus;
import com.aryan.fulfillx.entity.Product;
import com.aryan.fulfillx.entity.Warehouse;
import com.aryan.fulfillx.repository.CustomerOrderRepository;
import com.aryan.fulfillx.repository.CustomerRepository;
import com.aryan.fulfillx.repository.InventoryRepository;
import com.aryan.fulfillx.repository.ProductRepository;
import com.aryan.fulfillx.repository.WarehouseRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private static final int WAREHOUSE_COUNT = 5;
    private static final int PRODUCT_COUNT = 20;
    private static final int CUSTOMER_COUNT = 10;
    private static final int ORDER_COUNT = 30;

    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final CustomerRepository customerRepository;
    private final CustomerOrderRepository customerOrderRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (warehouseRepository.count() > 0) {
            log.info("Database already populated, skipping demo data initialization");
            return;
        }

        log.info("Initializing demo data");

        List<Warehouse> warehouses = warehouseRepository.saveAll(createWarehouses());
        List<Product> products = productRepository.saveAll(createProducts());
        inventoryRepository.saveAll(createInventories(warehouses, products));
        List<Customer> customers = customerRepository.saveAll(createCustomers());
        customerOrderRepository.saveAll(createOrders(customers, products));

        log.info(
                "Demo data initialized: {} warehouses, {} products, {} inventory rows, {} customers, {} orders",
                WAREHOUSE_COUNT,
                PRODUCT_COUNT,
                WAREHOUSE_COUNT * PRODUCT_COUNT,
                CUSTOMER_COUNT,
                ORDER_COUNT);
    }

    private List<Warehouse> createWarehouses() {
        return List.of(
                warehouse("Kolkata Fulfillment Center", "Kolkata", 22.5726, 88.3639, 12_000),
                warehouse("Delhi North Hub", "Delhi", 28.6139, 77.2090, 15_000),
                warehouse("Bangalore Tech Park Warehouse", "Bangalore", 12.9716, 77.5946, 14_000),
                warehouse("Hyderabad Logistics Hub", "Hyderabad", 17.3850, 78.4867, 11_000),
                warehouse("Bhubaneswar East Distribution Center", "Bhubaneswar", 20.2961, 85.8245, 8_000));
    }

    private Warehouse warehouse(String name, String city, double latitude, double longitude, int capacity) {
        return Warehouse.builder()
                .name(name)
                .city(city)
                .latitude(latitude)
                .longitude(longitude)
                .capacity(capacity)
                .currentLoad(0)
                .active(true)
                .build();
    }

    private List<Product> createProducts() {
        return List.of(
                product("Wireless Mouse", "Electronics", "0.120"),
                product("USB-C Hub", "Electronics", "0.180"),
                product("Bluetooth Speaker", "Electronics", "0.650"),
                product("Smart Watch", "Electronics", "0.045"),
                product("Power Bank 20000mAh", "Electronics", "0.390"),
                product("Coffee Maker", "Home & Kitchen", "2.800"),
                product("Air Fryer 4L", "Home & Kitchen", "4.200"),
                product("Blender Pro", "Home & Kitchen", "1.950"),
                product("Dinner Set 24-Piece", "Home & Kitchen", "8.500"),
                product("Vacuum Flask 1L", "Home & Kitchen", "0.520"),
                product("Yoga Mat", "Sports", "1.100"),
                product("Dumbbell Set 10kg", "Sports", "20.000"),
                product("Running Shoes", "Sports", "0.780"),
                product("Cricket Bat", "Sports", "1.250"),
                product("Football Size 5", "Sports", "0.430"),
                product("Cotton T-Shirt", "Clothing", "0.220"),
                product("Denim Jeans", "Clothing", "0.680"),
                product("Winter Jacket", "Clothing", "1.150"),
                product("Running Shorts", "Clothing", "0.190"),
                product("Java Programming Guide", "Books", "0.950"));
    }

    private Product product(String name, String category, String weight) {
        return Product.builder()
                .name(name)
                .category(category)
                .weight(new BigDecimal(weight))
                .build();
    }

    private List<Inventory> createInventories(List<Warehouse> warehouses, List<Product> products) {
        List<Inventory> inventories = new ArrayList<>();

        for (Warehouse warehouse : warehouses) {
            int warehouseLoad = 0;

            for (Product product : products) {
                int availableQuantity = randomInt(25, 450);
                int reservedQuantity = randomInt(0, Math.min(40, availableQuantity / 4));
                warehouseLoad += availableQuantity + reservedQuantity;

                inventories.add(Inventory.builder()
                        .warehouse(warehouse)
                        .product(product)
                        .availableQuantity(availableQuantity)
                        .reservedQuantity(reservedQuantity)
                        .build());
            }

            warehouse.setCurrentLoad(Math.min(warehouseLoad, warehouse.getCapacity()));
        }

        warehouseRepository.saveAll(warehouses);
        return inventories;
    }

    private List<Customer> createCustomers() {
        return List.of(
                customer("Ananya Sharma", "Mumbai", 19.0760, 72.8777),
                customer("Rahul Verma", "Pune", 18.5204, 73.8567),
                customer("Priya Nair", "Chennai", 13.0827, 80.2707),
                customer("Arjun Mehta", "Ahmedabad", 23.0225, 72.5714),
                customer("Sneha Reddy", "Visakhapatnam", 17.6868, 83.2185),
                customer("Vikram Singh", "Jaipur", 26.9124, 75.7873),
                customer("Kavya Iyer", "Kochi", 9.9312, 76.2673),
                customer("Rohan Das", "Guwahati", 26.1445, 91.7362),
                customer("Meera Patel", "Surat", 21.1702, 72.8311),
                customer("Aditya Khanna", "Chandigarh", 30.7333, 76.7794));
    }

    private Customer customer(String name, String city, double latitude, double longitude) {
        return Customer.builder()
                .name(name)
                .city(city)
                .latitude(latitude)
                .longitude(longitude)
                .build();
    }

    private List<CustomerOrder> createOrders(List<Customer> customers, List<Product> products) {
        List<CustomerOrder> orders = new ArrayList<>();
        OrderStatus[] statuses = OrderStatus.values();

        for (int i = 0; i < ORDER_COUNT; i++) {
            Customer customer = customers.get(randomInt(0, customers.size() - 1));
            int itemCount = randomInt(1, 4);
            List<Product> shuffledProducts = new ArrayList<>(products);
            Collections.shuffle(shuffledProducts);

            List<OrderItem> orderItems = new ArrayList<>();
            int totalItems = 0;

            for (int j = 0; j < itemCount; j++) {
                int quantity = randomInt(1, 5);
                totalItems += quantity;

                orderItems.add(OrderItem.builder()
                        .product(shuffledProducts.get(j))
                        .quantity(quantity)
                        .build());
            }

            CustomerOrder order = CustomerOrder.builder()
                    .customer(customer)
                    .status(statuses[randomInt(0, statuses.length - 1)])
                    .totalItems(totalItems)
                    .build();

            for (OrderItem orderItem : orderItems) {
                orderItem.setOrder(order);
                order.getOrderItems().add(orderItem);
            }

            orders.add(order);
        }

        return orders;
    }

    private int randomInt(int minInclusive, int maxInclusive) {
        return ThreadLocalRandom.current().nextInt(minInclusive, maxInclusive + 1);
    }
}
