import { Award, CheckCircle2, Warehouse } from 'lucide-react'

import { formatScore } from '../../services/optimizationService'

type CandidateEntry = {
  rank: number
  warehouseId: string
  warehouseName: string
  city?: string
  score: number
  isRecommended: boolean
  shippingCost?: number
  estimatedDeliveryHours?: number
  reason: string
}

type CandidateRankingsProps = {
  candidates: CandidateEntry[]
}

export function CandidateRankings({ candidates }: CandidateRankingsProps) {
  if (candidates.length === 0) {
    return null
  }

  return (
    <div className="rounded-xl border border-[#262630] bg-[#17171B] p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#202027] pb-3">
        <div className="flex items-center gap-2">
          <Warehouse className="size-4 text-[#C4622D]" />
          <h3 className="font-display text-sm font-bold text-[#F4F4F5]">
            Candidate Facilities
          </h3>
        </div>
        <span className="font-mono text-[10px] text-[#71717A]">
          {candidates.length} Hubs Benchmarked
        </span>
      </div>

      <div className="space-y-2">
        {candidates.map((candidate) => {
          const rankFormatted = String(candidate.rank).padStart(2, '0')
          return (
            <div
              key={candidate.warehouseId}
              className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                candidate.isRecommended
                  ? 'border-[#C4622D]/40 bg-[#C4622D]/10'
                  : 'border-[#262630] bg-[#1C1C21]/60 hover:border-[#71717A]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`font-mono text-xs font-bold ${
                    candidate.isRecommended ? 'text-[#C4622D]' : 'text-[#71717A]'
                  }`}
                >
                  {rankFormatted}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs text-[#F4F4F5] truncate">
                      {candidate.warehouseName}
                    </span>
                    {candidate.city ? (
                      <span className="text-[10px] text-[#71717A] hidden sm:inline">
                        ({candidate.city})
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    {candidate.isRecommended ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[#C4622D]">
                        <CheckCircle2 className="size-2.5" />
                        Recommended
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-[#71717A]">
                        Alternative
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono shrink-0 pl-3">
                <div className="text-xs font-bold text-[#F4F4F5]">
                  Score: {formatScore(candidate.score)}
                </div>
                {candidate.isRecommended ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#3FA66B]">
                    <Award className="size-2.5" />
                    Optimal
                  </span>
                ) : (
                  <span className="text-[10px] text-[#71717A]">
                    +{formatScore(candidate.score - candidates[0].score)}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
