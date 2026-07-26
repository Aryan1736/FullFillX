import { CheckCircle2, Filter, Info, XCircle } from 'lucide-react'

import type { OptimizationReasoning, ReasoningDecision } from '../../types/optimization'
import { cn } from '../../utils/cn'

type ReasoningTimelineProps = {
  reasoning: OptimizationReasoning[]
}

const decisionStyles: Record<
  ReasoningDecision,
  { label: string; icon: typeof CheckCircle2; badgeClass: string; dotClass: string }
> = {
  SELECTED: {
    label: 'Selected',
    icon: CheckCircle2,
    badgeClass: 'bg-emerald-100 text-emerald-700',
    dotClass: 'bg-emerald-500',
  },
  REJECTED: {
    label: 'Rejected',
    icon: XCircle,
    badgeClass: 'bg-red-100 text-red-700',
    dotClass: 'bg-red-500',
  },
  FILTERED: {
    label: 'Filtered',
    icon: Filter,
    badgeClass: 'bg-slate-100 text-slate-700',
    dotClass: 'bg-slate-400',
  },
  INFO: {
    label: 'Info',
    icon: Info,
    badgeClass: 'bg-blue-100 text-blue-700',
    dotClass: 'bg-blue-500',
  },
}

export function ReasoningTimeline({ reasoning }: ReasoningTimelineProps) {
  if (reasoning.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-slate-500">No reasoning entries returned for this optimization run.</p>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Reasoning Timeline</h2>
        <p className="mt-1 text-sm text-slate-500">
          Backend decision trail in chronological order.
        </p>
      </div>

      <ol className="relative space-y-0">
        {reasoning.map((entry, index) => {
          const style = decisionStyles[entry.decision] ?? decisionStyles.INFO
          const Icon = style.icon
          const isLast = index === reasoning.length - 1

          return (
            <li key={`${entry.decision}-${index}`} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast ? (
                <span
                  className="absolute left-[11px] top-6 h-[calc(100%-12px)] w-px bg-slate-200"
                  aria-hidden="true"
                />
              ) : null}

              <span
                className={cn('relative z-10 mt-1 size-[22px] shrink-0 rounded-full', style.dotClass)}
                aria-hidden="true"
              />

              <div className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                      style.badgeClass,
                    )}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                    {style.label}
                  </span>
                  <span className="text-xs text-slate-500">Step {index + 1}</span>
                </div>

                <p className="mt-2 text-sm text-slate-800">{entry.message}</p>

                {entry.warehouseName ? (
                  <p className="mt-2 text-xs text-slate-500">Warehouse: {entry.warehouseName}</p>
                ) : null}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
