package com.aryan.fulfillx.algorithm.strategy;

import com.aryan.fulfillx.algorithm.calculator.DistanceCalculator;
import com.aryan.fulfillx.algorithm.calculator.EtaCalculator;
import com.aryan.fulfillx.algorithm.calculator.ScoreCalculator;
import com.aryan.fulfillx.algorithm.calculator.ShippingCostCalculator;
import com.aryan.fulfillx.algorithm.model.OptimizationRequest;
import com.aryan.fulfillx.algorithm.model.OptimizationRequest.OrderLine;
import com.aryan.fulfillx.algorithm.model.OptimizationRequest.WarehouseAvailability;
import com.aryan.fulfillx.algorithm.model.OptimizationResult;
import com.aryan.fulfillx.algorithm.model.PlanScoreBreakdown;
import com.aryan.fulfillx.algorithm.model.ReasoningCollector;
import com.aryan.fulfillx.algorithm.model.ScoreBreakdown;
import com.aryan.fulfillx.algorithm.model.WarehouseCandidate;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

/**
 * Weighted greedy warehouse selection strategy.
 *
 * <p>Evaluates feasible single-warehouse and split-shipment allocation plans, scoring each plan
 * with a weighted combination of shipping cost, delivery time, warehouse load, and split-shipment
 * penalties. Returns the plan with the lowest aggregate score.
 */
public final class WeightedGreedyStrategy implements OptimizationStrategy {

    private static final String STRATEGY_NAME = "WEIGHTED_GREEDY";
    private static final int SCORE_SCALE = 4;

    private final DistanceCalculator distanceCalculator;
    private final ShippingCostCalculator shippingCostCalculator;
    private final EtaCalculator etaCalculator;
    private final ScoreCalculator scoreCalculator;

    /**
     * Creates a weighted greedy strategy with the calculators required for candidate scoring.
     *
     * @param distanceCalculator calculator for warehouse-to-customer distance
     * @param shippingCostCalculator calculator for fulfillment shipping cost
     * @param etaCalculator calculator for fulfillment delivery time
     * @param scoreCalculator calculator for weighted optimization scores
     */
    public WeightedGreedyStrategy(
            DistanceCalculator distanceCalculator,
            ShippingCostCalculator shippingCostCalculator,
            EtaCalculator etaCalculator,
            ScoreCalculator scoreCalculator) {
        this.distanceCalculator = Objects.requireNonNull(distanceCalculator, "distanceCalculator must not be null");
        this.shippingCostCalculator = Objects.requireNonNull(shippingCostCalculator, "shippingCostCalculator must not be null");
        this.etaCalculator = Objects.requireNonNull(etaCalculator, "etaCalculator must not be null");
        this.scoreCalculator = Objects.requireNonNull(scoreCalculator, "scoreCalculator must not be null");
    }

    @Override
    public OptimizationResult optimize(OptimizationRequest request) {
        Objects.requireNonNull(request, "request must not be null");

        ReasoningCollector reasoning = new ReasoningCollector();
        List<WarehouseAvailability> eligibleWarehouses = filterEligibleWarehouses(request, reasoning);
        if (eligibleWarehouses.isEmpty()) {
            reasoning.addInfo("No warehouses can fulfill any requested product.");
            return emptyResult(reasoning);
        }
        if (!isCollectivelyFulfillable(eligibleWarehouses, request.getOrderLines())) {
            reasoning.addInfo("Requested quantities exceed collective inventory across eligible warehouses.");
            return emptyResult(reasoning);
        }

        List<AllocationPlan> candidatePlans = buildCandidatePlans(request, eligibleWarehouses, reasoning);
        if (candidatePlans.isEmpty()) {
            reasoning.addInfo("No feasible allocation plans could be constructed.");
            return emptyResult(reasoning);
        }

        List<ScoredPlan> scoredPlans = candidatePlans.stream()
                .map(plan -> scorePlan(plan, request, eligibleWarehouses))
                .toList();
        ScoredPlan bestPlan = scoredPlans.stream()
                .min(Comparator.comparing(ScoredPlan::score))
                .orElseThrow();
        recordPlanSelectionReasoning(scoredPlans, bestPlan, reasoning);

        return toOptimizationResult(bestPlan, request, eligibleWarehouses, reasoning, scoredPlans);
    }

    private List<WarehouseAvailability> filterEligibleWarehouses(
            OptimizationRequest request, ReasoningCollector reasoning) {
        List<WarehouseAvailability> eligibleWarehouses = new ArrayList<>();

        for (WarehouseAvailability warehouse : request.getWarehouseAvailabilities()) {
            if (canFulfillAnyRequestedProduct(warehouse, request.getOrderLines())) {
                eligibleWarehouses.add(warehouse);
            } else {
                reasoning.addFiltered(
                        warehouse,
                        "Excluded because no requested product has available stock at this warehouse.");
            }
        }

        return eligibleWarehouses;
    }

    private boolean canFulfillAnyRequestedProduct(WarehouseAvailability warehouse, List<OrderLine> orderLines) {
        return orderLines.stream()
                .anyMatch(line -> availableStock(warehouse, line.productId()) > 0);
    }

    private boolean isCollectivelyFulfillable(List<WarehouseAvailability> warehouses, List<OrderLine> orderLines) {
        for (OrderLine orderLine : orderLines) {
            int totalAvailable = warehouses.stream()
                    .mapToInt(warehouse -> availableStock(warehouse, orderLine.productId()))
                    .sum();
            if (totalAvailable < orderLine.quantity()) {
                return false;
            }
        }
        return true;
    }

    private List<AllocationPlan> buildCandidatePlans(
            OptimizationRequest request,
            List<WarehouseAvailability> eligibleWarehouses,
            ReasoningCollector reasoning) {
        List<AllocationPlan> candidatePlans = new ArrayList<>();

        for (WarehouseAvailability warehouse : eligibleWarehouses) {
            if (canFulfillEntireOrder(warehouse, request.getOrderLines())) {
                candidatePlans.add(buildSingleWarehousePlan(warehouse, request.getOrderLines()));
                reasoning.addInfo(String.format(
                        "Single-warehouse plan candidate added for %s because it can fulfill the entire order.",
                        warehouse.warehouseName()));
            }
        }

        buildGreedySplitPlan(request, eligibleWarehouses, reasoning).ifPresent(plan -> {
            candidatePlans.add(plan);
            reasoning.addInfo("Split-shipment plan candidate added to cover remaining multi-warehouse allocations.");
        });

        return candidatePlans;
    }

    private boolean canFulfillEntireOrder(WarehouseAvailability warehouse, List<OrderLine> orderLines) {
        return orderLines.stream()
                .allMatch(line -> availableStock(warehouse, line.productId()) >= line.quantity());
    }

    private AllocationPlan buildSingleWarehousePlan(WarehouseAvailability warehouse, List<OrderLine> orderLines) {
        Map<UUID, Map<UUID, Integer>> allocationsByWarehouseId = new LinkedHashMap<>();
        Map<UUID, Integer> allocationsByProductId = new LinkedHashMap<>();

        for (OrderLine orderLine : orderLines) {
            allocationsByProductId.put(orderLine.productId(), orderLine.quantity());
        }

        allocationsByWarehouseId.put(warehouse.warehouseId(), allocationsByProductId);
        return new AllocationPlan(allocationsByWarehouseId);
    }

    private Optional<AllocationPlan> buildGreedySplitPlan(
            OptimizationRequest request,
            List<WarehouseAvailability> eligibleWarehouses,
            ReasoningCollector reasoning) {
        Map<UUID, Map<UUID, Integer>> remainingStockByWarehouseId = copyStockSnapshot(eligibleWarehouses);
        AllocationPlanBuilder planBuilder = new AllocationPlanBuilder();

        for (OrderLine orderLine : request.getOrderLines()) {
            int remainingQuantity = orderLine.quantity();

            while (remainingQuantity > 0) {
                WarehouseAvailability selectedWarehouse = selectBestWarehouseForProduct(
                                orderLine.productId(),
                                remainingQuantity,
                                remainingStockByWarehouseId,
                                eligibleWarehouses,
                                request,
                                reasoning)
                        .orElse(null);

                if (selectedWarehouse == null) {
                    return Optional.empty();
                }

                int availableQuantity = remainingStockByWarehouseId
                        .get(selectedWarehouse.warehouseId())
                        .getOrDefault(orderLine.productId(), 0);
                int allocatedQuantity = Math.min(remainingQuantity, availableQuantity);

                planBuilder.addAllocation(
                        selectedWarehouse.warehouseId(), orderLine.productId(), allocatedQuantity);
                decrementStock(
                        remainingStockByWarehouseId,
                        selectedWarehouse.warehouseId(),
                        orderLine.productId(),
                        allocatedQuantity);
                remainingQuantity -= allocatedQuantity;
            }
        }

        return Optional.of(planBuilder.build());
    }

    private Optional<WarehouseAvailability> selectBestWarehouseForProduct(
            UUID productId,
            int requestedQuantity,
            Map<UUID, Map<UUID, Integer>> remainingStockByWarehouseId,
            List<WarehouseAvailability> eligibleWarehouses,
            OptimizationRequest request,
            ReasoningCollector reasoning) {
        List<ScoredWarehouseLeg> candidateLegs = new ArrayList<>();

        for (WarehouseAvailability warehouse : eligibleWarehouses) {
            int availableQuantity = remainingStockByWarehouseId
                    .getOrDefault(warehouse.warehouseId(), Map.of())
                    .getOrDefault(productId, 0);
            if (availableQuantity <= 0) {
                continue;
            }

            int allocationQuantity = Math.min(requestedQuantity, availableQuantity);
            BigDecimal legScore = greedySelectionScore(warehouse, productId, allocationQuantity, request);
            candidateLegs.add(new ScoredWarehouseLeg(warehouse, allocationQuantity, legScore));
        }

        if (candidateLegs.isEmpty()) {
            return Optional.empty();
        }

        ScoredWarehouseLeg bestLeg = candidateLegs.stream()
                .min(Comparator.comparing(ScoredWarehouseLeg::score))
                .orElseThrow();

        for (ScoredWarehouseLeg candidateLeg : candidateLegs) {
            WarehouseAvailability warehouse = candidateLeg.warehouse();
            if (candidateLeg == bestLeg) {
                reasoning.addSelected(
                        warehouse.warehouseId(),
                        warehouse.warehouseName(),
                        productId,
                        String.format(
                                "Allocated %d unit(s): leg score %.4f is lowest among %d candidate warehouse(s).",
                                candidateLeg.allocationQuantity(),
                                candidateLeg.score(),
                                candidateLegs.size()));
            } else {
                reasoning.addRejected(
                        warehouse.warehouseId(),
                        warehouse.warehouseName(),
                        productId,
                        String.format(
                                "Leg score %.4f exceeds selected warehouse score %.4f for %d unit(s).",
                                candidateLeg.score(),
                                bestLeg.score(),
                                candidateLeg.allocationQuantity()));
            }
        }

        return Optional.of(bestLeg.warehouse());
    }

    private BigDecimal greedySelectionScore(
            WarehouseAvailability warehouse,
            UUID productId,
            int quantity,
            OptimizationRequest request) {
        BigDecimal shippingCost = computeShippingCost(warehouse, request, quantity);
        BigDecimal warehouseLoadPenalty = computeWarehouseLoadPenalty(warehouse, quantity);
        int estimatedDeliveryHours = computeEstimatedDeliveryHours(warehouse, request);

        return scoreCalculator.scoreWarehouseLeg(shippingCost, estimatedDeliveryHours, warehouseLoadPenalty);
    }

    private ScoredPlan scorePlan(
            AllocationPlan plan,
            OptimizationRequest request,
            List<WarehouseAvailability> eligibleWarehouses) {
        Map<UUID, WarehouseAvailability> warehousesById = indexWarehousesById(eligibleWarehouses);

        BigDecimal totalShippingCost = BigDecimal.ZERO;
        int maxEstimatedDeliveryHours = 0;
        BigDecimal totalWarehouseLoadPenalty = BigDecimal.ZERO;

        for (Map.Entry<UUID, Map<UUID, Integer>> warehouseAllocation : plan.allocationsByWarehouseId().entrySet()) {
            WarehouseAvailability warehouse = warehousesById.get(warehouseAllocation.getKey());
            int itemCount = totalAllocatedQuantity(warehouseAllocation.getValue());

            BigDecimal shippingCost = computeShippingCost(warehouse, request, itemCount);
            int estimatedDeliveryHours = computeEstimatedDeliveryHours(warehouse, request);
            BigDecimal warehouseLoadPenalty = computeWarehouseLoadPenalty(warehouse, itemCount);

            totalShippingCost = totalShippingCost.add(shippingCost);
            maxEstimatedDeliveryHours = Math.max(maxEstimatedDeliveryHours, estimatedDeliveryHours);
            totalWarehouseLoadPenalty = totalWarehouseLoadPenalty.add(warehouseLoadPenalty);
        }

        PlanScoreBreakdown scoreBreakdown = scoreCalculator.scorePlanBreakdown(
                totalShippingCost,
                maxEstimatedDeliveryHours,
                totalWarehouseLoadPenalty,
                plan.warehouseCount());

        return new ScoredPlan(
                plan,
                scoreBreakdown.getTotalScore(),
                scoreBreakdown,
                totalShippingCost,
                maxEstimatedDeliveryHours,
                totalWarehouseLoadPenalty);
    }

    private void recordPlanSelectionReasoning(
            List<ScoredPlan> scoredPlans, ScoredPlan bestPlan, ReasoningCollector reasoning) {
        String bestPlanDescription = describePlan(bestPlan.plan());

        for (ScoredPlan scoredPlan : scoredPlans) {
            if (scoredPlan == bestPlan) {
                reasoning.addSelected(
                        null,
                        null,
                        null,
                        String.format(
                                "Selected fulfillment plan (%s) with optimization score %.4f.",
                                bestPlanDescription,
                                scoredPlan.score()));
            } else {
                reasoning.addRejected(
                        null,
                        null,
                        null,
                        String.format(
                                "Rejected fulfillment plan (%s): score %.4f exceeds winning score %.4f.",
                                describePlan(scoredPlan.plan()),
                                scoredPlan.score(),
                                bestPlan.score()));
            }
        }
    }

    private String describePlan(AllocationPlan plan) {
        if (plan.warehouseCount() == 1) {
            UUID warehouseId = plan.allocationsByWarehouseId().keySet().iterator().next();
            return "single warehouse " + warehouseId;
        }
        return plan.warehouseCount() + " warehouses";
    }

    private BigDecimal computeShippingCost(
            WarehouseAvailability warehouse, OptimizationRequest request, int itemCount) {
        double distanceKilometers = computeDistanceKilometers(warehouse, request);
        return shippingCostCalculator.calculateShippingCost(distanceKilometers, itemCount);
    }

    private int computeEstimatedDeliveryHours(WarehouseAvailability warehouse, OptimizationRequest request) {
        double distanceKilometers = computeDistanceKilometers(warehouse, request);
        return etaCalculator.calculateEtaHours(distanceKilometers);
    }

    private double computeDistanceKilometers(WarehouseAvailability warehouse, OptimizationRequest request) {
        return distanceCalculator.calculateDistance(
                warehouse.latitude(),
                warehouse.longitude(),
                request.getDestinationLatitude(),
                request.getDestinationLongitude());
    }

    private BigDecimal computeWarehouseLoadPenalty(WarehouseAvailability warehouse, int allocatedItemCount) {
        if (warehouse.capacity() <= 0) {
            return BigDecimal.ONE;
        }

        int projectedLoad = warehouse.currentLoad() + allocatedItemCount;
        return BigDecimal.valueOf(projectedLoad)
                .divide(BigDecimal.valueOf(warehouse.capacity()), SCORE_SCALE, RoundingMode.HALF_UP);
    }

    private OptimizationResult toOptimizationResult(
            ScoredPlan bestPlan,
            OptimizationRequest request,
            List<WarehouseAvailability> eligibleWarehouses,
            ReasoningCollector reasoning,
            List<ScoredPlan> scoredPlans) {
        Map<UUID, WarehouseAvailability> warehousesById = indexWarehousesById(eligibleWarehouses);
        List<WarehouseCandidate> warehouseCandidates = new ArrayList<>();
        List<UUID> selectedWarehouses = new ArrayList<>();

        for (Map.Entry<UUID, Map<UUID, Integer>> warehouseAllocation :
                bestPlan.plan().allocationsByWarehouseId().entrySet()) {
            UUID warehouseId = warehouseAllocation.getKey();
            WarehouseAvailability warehouse = warehousesById.get(warehouseId);
            warehouseCandidates.add(createWarehouseCandidate(
                    warehouse, warehouseAllocation.getValue(), request));
            selectedWarehouses.add(warehouseId);
        }

        return new OptimizationResult(
                STRATEGY_NAME,
                warehouseCandidates,
                bestPlan.score(),
                bestPlan.totalShippingCost(),
                bestPlan.maxEstimatedDeliveryHours(),
                bestPlan.scoreBreakdown(),
                reasoning.toList(),
                selectedWarehouses,
                computeEstimatedSavings(scoredPlans, bestPlan));
    }

    private BigDecimal computeEstimatedSavings(List<ScoredPlan> scoredPlans, ScoredPlan bestPlan) {
        if (scoredPlans.size() <= 1) {
            return null;
        }

        BigDecimal worstShippingCost = scoredPlans.stream()
                .map(ScoredPlan::totalShippingCost)
                .max(BigDecimal::compareTo)
                .orElse(bestPlan.totalShippingCost());
        BigDecimal savings = worstShippingCost.subtract(bestPlan.totalShippingCost());
        if (savings.compareTo(BigDecimal.ZERO) <= 0) {
            return null;
        }
        return savings.setScale(SCORE_SCALE, RoundingMode.HALF_UP);
    }

    private WarehouseCandidate createWarehouseCandidate(
            WarehouseAvailability warehouse,
            Map<UUID, Integer> allocatedQuantitiesByProductId,
            OptimizationRequest request) {
        int itemCount = totalAllocatedQuantity(allocatedQuantitiesByProductId);
        BigDecimal shippingCost = computeShippingCost(warehouse, request, itemCount);
        int estimatedDeliveryHours = computeEstimatedDeliveryHours(warehouse, request);
        double distanceKilometers = computeDistanceKilometers(warehouse, request);
        BigDecimal warehouseLoadPenalty = computeWarehouseLoadPenalty(warehouse, itemCount);
        BigDecimal inventoryPenalty = computeInventoryPenalty(warehouse, allocatedQuantitiesByProductId);
        ScoreBreakdown scoreBreakdown = scoreCalculator.scoreWarehouseBreakdown(
                distanceKilometers,
                shippingCost,
                estimatedDeliveryHours,
                warehouseLoadPenalty,
                inventoryPenalty);

        return new WarehouseCandidate(
                warehouse.warehouseId(),
                warehouse.warehouseName(),
                allocatedQuantitiesByProductId,
                shippingCost,
                estimatedDeliveryHours,
                scoreBreakdown);
    }

    private BigDecimal computeInventoryPenalty(
            WarehouseAvailability warehouse, Map<UUID, Integer> allocatedQuantitiesByProductId) {
        BigDecimal inventoryPenalty = BigDecimal.ZERO;

        for (Map.Entry<UUID, Integer> allocation : allocatedQuantitiesByProductId.entrySet()) {
            int availableStock = availableStock(warehouse, allocation.getKey());
            if (availableStock <= 0) {
                continue;
            }

            BigDecimal depletionRatio = BigDecimal.valueOf(allocation.getValue())
                    .divide(BigDecimal.valueOf(availableStock), SCORE_SCALE, RoundingMode.HALF_UP);
            inventoryPenalty = inventoryPenalty.add(depletionRatio);
        }

        return inventoryPenalty;
    }

    private Map<UUID, WarehouseAvailability> indexWarehousesById(List<WarehouseAvailability> warehouses) {
        Map<UUID, WarehouseAvailability> warehousesById = new HashMap<>();
        for (WarehouseAvailability warehouse : warehouses) {
            warehousesById.put(warehouse.warehouseId(), warehouse);
        }
        return warehousesById;
    }

    private Map<UUID, Map<UUID, Integer>> copyStockSnapshot(List<WarehouseAvailability> warehouses) {
        Map<UUID, Map<UUID, Integer>> stockSnapshot = new HashMap<>();
        for (WarehouseAvailability warehouse : warehouses) {
            stockSnapshot.put(warehouse.warehouseId(), new HashMap<>(warehouse.availableStockByProductId()));
        }
        return stockSnapshot;
    }

    private void decrementStock(
            Map<UUID, Map<UUID, Integer>> stockByWarehouseId,
            UUID warehouseId,
            UUID productId,
            int quantity) {
        stockByWarehouseId
                .get(warehouseId)
                .merge(productId, -quantity, (current, delta) -> Math.max(0, current + delta));
    }

    private int availableStock(WarehouseAvailability warehouse, UUID productId) {
        return warehouse.availableStockByProductId().getOrDefault(productId, 0);
    }

    private int totalAllocatedQuantity(Map<UUID, Integer> allocatedQuantitiesByProductId) {
        return allocatedQuantitiesByProductId.values().stream().mapToInt(Integer::intValue).sum();
    }

    private OptimizationResult emptyResult(ReasoningCollector reasoning) {
        PlanScoreBreakdown emptyBreakdown = new PlanScoreBreakdown(
                BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
        return new OptimizationResult(
                STRATEGY_NAME,
                List.of(),
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                0,
                emptyBreakdown,
                reasoning.toList(),
                List.of(),
                null);
    }

    public DistanceCalculator getDistanceCalculator() {
        return distanceCalculator;
    }

    public ShippingCostCalculator getShippingCostCalculator() {
        return shippingCostCalculator;
    }

    public EtaCalculator getEtaCalculator() {
        return etaCalculator;
    }

    public ScoreCalculator getScoreCalculator() {
        return scoreCalculator;
    }

    private record AllocationPlan(Map<UUID, Map<UUID, Integer>> allocationsByWarehouseId) {

        private AllocationPlan {
            Objects.requireNonNull(allocationsByWarehouseId, "allocationsByWarehouseId must not be null");
        }

        int warehouseCount() {
            return allocationsByWarehouseId.size();
        }
    }

    private record ScoredPlan(
            AllocationPlan plan,
            BigDecimal score,
            PlanScoreBreakdown scoreBreakdown,
            BigDecimal totalShippingCost,
            int maxEstimatedDeliveryHours,
            BigDecimal totalWarehouseLoadPenalty) {

        private ScoredPlan {
            Objects.requireNonNull(plan, "plan must not be null");
            Objects.requireNonNull(score, "score must not be null");
            Objects.requireNonNull(scoreBreakdown, "scoreBreakdown must not be null");
            Objects.requireNonNull(totalShippingCost, "totalShippingCost must not be null");
            Objects.requireNonNull(totalWarehouseLoadPenalty, "totalWarehouseLoadPenalty must not be null");
        }
    }

    private record ScoredWarehouseLeg(
            WarehouseAvailability warehouse, int allocationQuantity, BigDecimal score) {

        private ScoredWarehouseLeg {
            Objects.requireNonNull(warehouse, "warehouse must not be null");
            Objects.requireNonNull(score, "score must not be null");
        }
    }

    private static final class AllocationPlanBuilder {

        private final Map<UUID, Map<UUID, Integer>> allocationsByWarehouseId = new LinkedHashMap<>();

        void addAllocation(UUID warehouseId, UUID productId, int quantity) {
            allocationsByWarehouseId
                    .computeIfAbsent(warehouseId, ignored -> new LinkedHashMap<>())
                    .merge(productId, quantity, Integer::sum);
        }

        AllocationPlan build() {
            Map<UUID, Map<UUID, Integer>> immutableAllocations = new LinkedHashMap<>();
            allocationsByWarehouseId.forEach((warehouseId, productAllocations) ->
                    immutableAllocations.put(warehouseId, Map.copyOf(productAllocations)));
            return new AllocationPlan(immutableAllocations);
        }
    }
}
