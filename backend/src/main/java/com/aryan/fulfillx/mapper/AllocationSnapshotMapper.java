package com.aryan.fulfillx.mapper;

import com.aryan.fulfillx.algorithm.model.OptimizationReasoning;
import com.aryan.fulfillx.algorithm.model.PlanScoreBreakdown;
import com.aryan.fulfillx.algorithm.model.ScoreBreakdown;
import com.aryan.fulfillx.algorithm.model.WarehouseCandidate;
import com.aryan.fulfillx.entity.snapshot.AllocationPlanScoreBreakdown;
import com.aryan.fulfillx.entity.snapshot.AllocationReasoningEntry;
import com.aryan.fulfillx.entity.snapshot.AllocationScoreBreakdown;
import com.aryan.fulfillx.entity.snapshot.AllocationWarehouseSnapshot;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AllocationSnapshotMapper {

    AllocationPlanScoreBreakdown toPlanScoreBreakdownSnapshot(PlanScoreBreakdown scoreBreakdown);

    AllocationScoreBreakdown toScoreBreakdownSnapshot(ScoreBreakdown scoreBreakdown);

    AllocationReasoningEntry toReasoningSnapshot(OptimizationReasoning reasoning);

    List<AllocationReasoningEntry> toReasoningSnapshots(List<OptimizationReasoning> reasoning);

    AllocationWarehouseSnapshot toWarehouseSnapshot(WarehouseCandidate candidate);

    List<AllocationWarehouseSnapshot> toWarehouseSnapshots(List<WarehouseCandidate> candidates);
}
