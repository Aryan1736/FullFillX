import { Clock3, IndianRupee, Scale, Sparkles, Split } from 'lucide-react'

import { formatScore } from '../../services/optimizationService'
import type { PlanScoreBreakdown } from '../../types/optimization'

type ScoreBreakdownCardsProps = {
  scoreBreakdown: PlanScoreBreakdown
}

export function ScoreBreakdownCards({ scoreBreakdown }: ScoreBreakdownCardsProps) {
  const factors = [
    {
      title: 'Shipping Cost Efficiency',
      score: scoreBreakdown.shippingCostScore,
      icon: IndianRupee,
      barColor: 'bg-[#C4622D]',
      tag: 'Freight Economics',
      description: 'Landed carrier freight economics and route distance efficiency.',
    },
    {
      title: 'Delivery Speed (ETA)',
      score: scoreBreakdown.etaScore,
      icon: Clock3,
      barColor: 'bg-[#3FA66B]',
      tag: 'Transit Time',
      description: 'Estimated transit hours and proximity to customer destination.',
    },
    {
      title: 'Warehouse Load Balancing',
      score: scoreBreakdown.warehouseLoadScore,
      icon: Scale,
      barColor: 'bg-[#D08A35]',
      tag: 'Capacity Buffer',
      description: 'Available unreserved capacity and facility operational buffer.',
    },
    {
      title: 'Split Shipment Penalty',
      score: scoreBreakdown.splitShipmentPenalty,
      icon: Split,
      barColor: 'bg-[#71717A]',
      tag: 'Consolidation',
      description: 'Penalties incurred if multi-warehouse packaging is required.',
    },
  ]

  return (
    <section className="rounded-xl border border-[#262630] bg-[#17171B] p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#202027] pb-3.5">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
            SUB-OBJECTIVE SCORES
          </span>
          <h3 className="font-display text-base font-bold text-[#F4F4F5] sm:text-lg mt-0.5">
            Algorithmic Score Breakdown
          </h3>
          <p className="mt-0.5 text-xs text-[#A1A1AA]">
            Weighted contribution factors driving the optimal warehouse recommendation.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#A1A1AA] bg-[#1C1C21] px-2.5 py-1 rounded border border-[#262630]">
          <Sparkles className="size-3 text-[#C4622D]" />
          4 Decision Levers
        </span>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        {factors.map((factor) => {
          const Icon = factor.icon
          const scoreVal = Number(factor.score) || 0
          // Normalized percentage for visual bar (clamped 0-100)
          const barPct = Math.min(100, Math.max(5, (scoreVal / 100) * 100))

          return (
            <div
              key={factor.title}
              className="rounded-lg border border-[#202027] bg-[#1C1C21] p-4 transition-colors hover:border-[#262630]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded bg-[#17171B] border border-[#262630] text-[#C4622D]">
                    <Icon className="size-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#F4F4F5]">{factor.title}</h4>
                    <span className="font-mono text-[10px] text-[#71717A]">{factor.tag}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-base font-bold text-[#F4F4F5]">
                    {formatScore(factor.score)}
                  </span>
                  <span className="font-mono text-[10px] text-[#71717A]"> / 100</span>
                </div>
              </div>

              {/* Dark crisp progress track */}
              <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-[#262630]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${factor.barColor}`}
                  style={{ width: `${barPct}%` }}
                />
              </div>

              <p className="mt-2 text-[11px] leading-relaxed text-[#71717A]">{factor.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
