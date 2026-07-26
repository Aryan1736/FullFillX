package com.aryan.fulfillx.entity;

import com.aryan.fulfillx.entity.snapshot.AllocationPlanScoreBreakdown;
import com.aryan.fulfillx.entity.snapshot.AllocationReasoningEntry;
import com.aryan.fulfillx.entity.snapshot.AllocationWarehouseSnapshot;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
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
@Table(name = "allocations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = "allocationItems")
public class Allocation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private CustomerOrder order;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    @Column(name = "optimization_score", nullable = false, precision = 12, scale = 4)
    private BigDecimal optimizationScore;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    @Column(name = "shipping_cost", nullable = false, precision = 12, scale = 2)
    private BigDecimal shippingCost;

    @NotNull
    @Min(0)
    @Column(name = "estimated_delivery_hours", nullable = false)
    private Integer estimatedDeliveryHours;

    @Column(name = "strategy_name")
    private String strategyName;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "score_breakdown", columnDefinition = "jsonb")
    private AllocationPlanScoreBreakdown scoreBreakdown;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "reasoning", columnDefinition = "jsonb")
    private List<AllocationReasoningEntry> reasoning;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "warehouse_snapshots", columnDefinition = "jsonb")
    private List<AllocationWarehouseSnapshot> warehouseSnapshots;

    @OneToMany(mappedBy = "allocation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<AllocationItem> allocationItems = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
