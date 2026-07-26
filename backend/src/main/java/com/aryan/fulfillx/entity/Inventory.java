package com.aryan.fulfillx.entity;

import com.aryan.fulfillx.exception.InsufficientInventoryException;
import com.aryan.fulfillx.exception.InvalidInventoryStateException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(
        name = "inventories",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_inventory_warehouse_product",
                columnNames = {"warehouse_id", "product_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"warehouse", "product"})
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull
    @Min(0)
    @Column(name = "available_quantity", nullable = false)
    private Integer availableQuantity;

    @NotNull
    @Min(0)
    @Column(name = "reserved_quantity", nullable = false)
    private Integer reservedQuantity;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public void validateReservedQuantity() {
        UUID warehouseId = warehouse.getId();
        UUID productId = product.getId();

        if (reservedQuantity == null) {
            throw new InvalidInventoryStateException(warehouseId, productId, "reserved quantity is null");
        }
        if (reservedQuantity < 0) {
            throw new InvalidInventoryStateException(
                    warehouseId, productId, "reserved quantity must not be negative");
        }
    }

    public void validateAvailableForReservation(int quantity) {
        Objects.requireNonNull(availableQuantity, "availableQuantity must not be null");
        validateReservedQuantity();

        UUID warehouseId = warehouse.getId();
        UUID productId = product.getId();

        if (quantity <= 0) {
            throw new InvalidInventoryStateException(warehouseId, productId, "reservation quantity must be positive");
        }
        if (availableQuantity < quantity) {
            throw new InsufficientInventoryException(warehouseId, productId, quantity, availableQuantity);
        }
    }

    public void reserve(int quantity) {
        validateAvailableForReservation(quantity);

        availableQuantity -= quantity;
        reservedQuantity += quantity;
        assertNonNegativeQuantities();
    }

    private void assertNonNegativeQuantities() {
        UUID warehouseId = warehouse.getId();
        UUID productId = product.getId();

        if (availableQuantity < 0) {
            throw new InvalidInventoryStateException(warehouseId, productId, "available quantity became negative");
        }
        if (reservedQuantity < 0) {
            throw new InvalidInventoryStateException(warehouseId, productId, "reserved quantity became negative");
        }
    }
}
