import { Cpu, ShieldCheck } from 'lucide-react'

type StrategyCardProps = {
  strategyName: string
  candidateCount?: number
  isExecuted?: boolean
}

export function StrategyCard({
  strategyName,
  candidateCount,
  isExecuted = false,
}: StrategyCardProps) {
  const factors = [
    { name: 'Distance', weight: '35%', desc: 'Warehouse-to-destination Haversine distance in km' },
    { name: 'Shipping Cost', weight: '25%', desc: 'Distance × aggregate line weight carrier economics' },
    { name: 'Inventory Depletion', weight: '25%', desc: 'Allocated vs available on-hand stock ratio' },
    { name: 'Warehouse Load', weight: '15%', desc: 'Projected load ratio vs maximum facility capacity' },
  ]

  return (
    <div className="rounded-xl border border-[#262630] bg-[#17171B] p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#202027] pb-3.5">
        <div className="flex items-center gap-2">
          <Cpu className="size-4 text-[#C4622D]" />
          <h3 className="font-display text-sm font-bold text-[#F4F4F5]">
            Optimization Strategy
          </h3>
        </div>
        <span className="font-mono text-[10px] font-semibold text-[#3FA66B] bg-[#3FA66B]/10 border border-[#3FA66B]/20 px-2 py-0.5 rounded">
          ACTIVE SOLVER
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-bold text-[#F4F4F5]">
              {strategyName === 'WEIGHTED_GREEDY' ? 'WEIGHTED GREEDY' : strategyName}
            </span>
            <span className="font-mono text-[11px] text-[#71717A]">
              Objective: Minimize Aggregate Score
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-[#A1A1AA]">
            Ranks fulfillment candidates using inventory availability, shipping cost, warehouse utilization, and distance.
          </p>
        </div>

        {/* Real Factor Weights Breakdown */}
        <div className="rounded-lg border border-[#202027] bg-[#1C1C21] p-3 space-y-2.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#71717A] block">
            OBJECTIVE FUNCTION WEIGHTS
          </span>

          <div className="grid grid-cols-2 gap-2">
            {factors.map((factor) => (
              <div
                key={factor.name}
                className="rounded border border-[#262630] bg-[#17171B] p-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#F4F4F5]">{factor.name}</span>
                  <span className="font-mono text-xs font-bold text-[#C4622D]">{factor.weight}</span>
                </div>
                <p className="mt-1 text-[10px] leading-tight text-[#71717A]">{factor.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Architecture Info */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-[11px] text-[#71717A]">
          {candidateCount ? (
            <span>Candidates evaluated: <strong className="text-[#F4F4F5]">{candidateCount}</strong></span>
          ) : null}
          <span>
            State:{' '}
            <strong className={isExecuted ? 'text-[#3FA66B]' : 'text-[#A1A1AA]'}>
              {isExecuted ? 'COMMITTED' : 'SIMULATION'}
            </strong>
          </span>
          <span className="inline-flex items-center gap-1 text-[#3FA66B]">
            <ShieldCheck className="size-3" />
            Deterministic
          </span>
        </div>
      </div>
    </div>
  )
}
