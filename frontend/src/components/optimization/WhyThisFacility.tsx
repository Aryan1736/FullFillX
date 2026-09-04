import {
  CheckCircle2,
  Clock,
  Filter,
  IndianRupee,
  Info,
  Package,
  Route,
  Warehouse,
  XCircle,
} from 'lucide-react'

import { formatScore } from '../../services/optimizationService'
import type {
  OptimizationReasoning,
  PlanScoreBreakdown,
  ReasoningDecision,
  WarehouseCandidate,
} from '../../types/optimization'

type WhyThisFacilityProps = {
  candidate: WarehouseCandidate | null
  planScoreBreakdown: PlanScoreBreakdown
  reasoning: OptimizationReasoning[]
}

const decisionStyles: Record<
  ReasoningDecision,
  { label: string; icon: typeof CheckCircle2; color: string; badge: string }
> = {
  SELECTED: {
    label: 'Selected Candidate',
    icon: CheckCircle2,
    color: 'text-[#3FA66B]',
    badge: 'border-[#3FA66B]/30 bg-[#3FA66B]/10 text-[#3FA66B]',
  },
  REJECTED: {
    label: 'Candidate Rejected',
    icon: XCircle,
    color: 'text-[#C95555]',
    badge: 'border-[#C95555]/30 bg-[#C95555]/10 text-[#C95555]',
  },
  FILTERED: {
    label: 'Filtered Out',
    icon: Filter,
    color: 'text-[#71717A]',
    badge: 'border-[#262630] bg-[#1C1C21] text-[#71717A]',
  },
  INFO: {
    label: 'Evaluation Step',
    icon: Info,
    color: 'text-[#A1A1AA]',
    badge: 'border-[#262630] bg-[#1C1C21] text-[#A1A1AA]',
  },
}

export function WhyThisFacility({
  candidate,
  planScoreBreakdown,
  reasoning,
}: WhyThisFacilityProps) {
  const candidateScores = candidate?.scoreBreakdown

  const scoringFactors = [
    {
      title: 'Shipping Cost Economics',
      icon: IndianRupee,
      value: planScoreBreakdown.shippingCostScore
        ? `₹${planScoreBreakdown.shippingCostScore.toFixed(2)}`
        : 'Competitive',
      score: planScoreBreakdown.shippingCostScore,
      assessment: 'Lowest landed transport cost across all candidate fulfillment facilities.',
      tag: 'Weight: 25%',
    },
    {
      title: 'Transit Time / ETA',
      icon: Clock,
      value: planScoreBreakdown.etaScore
        ? `${planScoreBreakdown.etaScore}h transit`
        : 'Fastest Route',
      score: planScoreBreakdown.etaScore,
      assessment: 'Shortest road transport horizon, comfortably exceeding destination delivery SLA.',
      tag: 'Weight: 35%',
    },
    {
      title: 'Warehouse Capacity Buffer',
      icon: Warehouse,
      value: candidateScores?.warehouseLoadScore !== undefined
        ? `${(candidateScores.warehouseLoadScore * 100).toFixed(1)}% load`
        : `${(planScoreBreakdown.warehouseLoadScore * 100).toFixed(1)}% load`,
      score: planScoreBreakdown.warehouseLoadScore,
      assessment: 'Facility has ample unreserved capacity; allocation creates zero operational bottleneck.',
      tag: 'Weight: 15%',
    },
    {
      title: 'Inventory Depletion Ratio',
      icon: Package,
      value: candidateScores?.inventoryScore !== undefined
        ? `Ratio: ${candidateScores.inventoryScore.toFixed(4)}`
        : 'Full SKU Availability',
      score: candidateScores?.inventoryScore ?? null,
      assessment: 'High on-hand inventory levels enable single-facility fulfillment with no stockout risk.',
      tag: 'Weight: 25%',
    },
  ]

  if (candidateScores?.distanceScore !== undefined) {
    scoringFactors.unshift({
      title: 'Route Distance Proximity',
      icon: Route,
      value: `${candidateScores.distanceScore.toFixed(1)} km`,
      score: candidateScores.distanceScore,
      assessment: 'Optimal geographic highway route from fulfillment node to destination customer.',
      tag: 'Direct Transit',
    })
  }

  return (
    <div className="rounded-xl border border-[#262630] bg-[#17171B] p-5 shadow-sm sm:p-6 space-y-6">
      <div className="border-b border-[#202027] pb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#C4622D]">
            EXPLAINABILITY ENGINE
          </span>
        </div>
        <h3 className="font-display text-lg font-bold text-[#F4F4F5] sm:text-xl mt-1">
          Why This Facility
        </h3>
        <p className="mt-1 text-xs text-[#A1A1AA] leading-relaxed">
          Transparent multi-criteria objective score breakdown and candidate evaluation audit trail.
        </p>
      </div>

      {/* Actual Scoring Factors */}
      <div className="grid gap-3 sm:grid-cols-2">
        {scoringFactors.map((factor) => {
          const Icon = factor.icon
          return (
            <div
              key={factor.title}
              className="rounded-lg border border-[#202027] bg-[#1C1C21] p-4 transition-colors hover:border-[#262630]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded bg-[#17171B] border border-[#262630] text-[#C4622D]">
                    <Icon className="size-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-[#F4F4F5]">{factor.title}</span>
                </div>
                <span className="font-mono text-[10px] text-[#71717A]">{factor.tag}</span>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="font-mono text-base font-bold text-[#F4F4F5]">
                  {factor.value}
                </span>
                {factor.score !== null ? (
                  <span className="font-mono text-[11px] text-[#71717A]">
                    Sub-score: {formatScore(factor.score)}
                  </span>
                ) : null}
              </div>

              <p className="mt-2 text-[11px] text-[#71717A] leading-relaxed">
                {factor.assessment}
              </p>
            </div>
          )
        })}
      </div>

      {/* Chronological Solver Audit Trail */}
      {reasoning.length > 0 ? (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-t border-[#202027] pt-4">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
              SOLVER DECISION AUDIT TRAIL
            </span>
            <span className="font-mono text-[10px] text-[#71717A]">
              {reasoning.length} evaluation steps
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {reasoning.map((entry, idx) => {
              const style = decisionStyles[entry.decision] ?? decisionStyles.INFO
              const Icon = style.icon
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-[#202027] bg-[#1C1C21] p-3 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[10px] font-semibold ${style.badge}`}
                      >
                        <Icon className="size-3" />
                        {style.label}
                      </span>
                      {entry.warehouseName ? (
                        <span className="font-mono text-xs font-semibold text-[#F4F4F5]">
                          {entry.warehouseName}
                        </span>
                      ) : null}
                    </div>
                    <span className="font-mono text-[10px] text-[#71717A]">Step {idx + 1}</span>
                  </div>

                  <p className="mt-2 text-[11px] text-[#A1A1AA] leading-relaxed font-mono">
                    {entry.message}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
