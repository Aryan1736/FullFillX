import { Clock3, IndianRupee, Scale, Split } from 'lucide-react'

import { formatScore } from '../../services/optimizationService'
import type { PlanScoreBreakdown } from '../../types/optimization'
import { KpiCard } from '../dashboard/KpiCard'

type ScoreBreakdownCardsProps = {
  scoreBreakdown: PlanScoreBreakdown
}

export function ScoreBreakdownCards({ scoreBreakdown }: ScoreBreakdownCardsProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Score Breakdown</h2>
        <p className="mt-1 text-sm text-slate-500">Weighted factors that shaped the selected fulfillment plan.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Shipping Score"
          value={formatScore(scoreBreakdown.shippingCostScore)}
          icon={IndianRupee}
        />
        <KpiCard
          title="ETA Score"
          value={formatScore(scoreBreakdown.etaScore)}
          icon={Clock3}
        />
        <KpiCard
          title="Load Score"
          value={formatScore(scoreBreakdown.warehouseLoadScore)}
          icon={Scale}
        />
        <KpiCard
          title="Split Penalty"
          value={formatScore(scoreBreakdown.splitShipmentPenalty)}
          icon={Split}
        />
      </div>
    </section>
  )
}
