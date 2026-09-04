import { CheckCircle2, Filter, Info, Warehouse, XCircle } from 'lucide-react'

import type { OptimizationReasoning, ReasoningDecision } from '../../types/optimization'
import { cn } from '../../utils/cn'

type ReasoningTimelineProps = {
  reasoning: OptimizationReasoning[]
}

const decisionConfig: Record<
  ReasoningDecision,
  {
    label: string
    icon: typeof CheckCircle2
    badgeClass: string
    cardClass: string
    nodeClass: string
    isDominant?: boolean
  }
> = {
  SELECTED: {
    label: 'Decision: Selected Candidate',
    icon: CheckCircle2,
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-500/20 font-bold',
    cardClass: 'border-emerald-300/80 bg-gradient-to-r from-emerald-50/70 to-teal-50/40 shadow-xs ring-1 ring-emerald-500/10',
    nodeClass: 'bg-emerald-600 text-white ring-4 ring-emerald-100',
    isDominant: true,
  },
  REJECTED: {
    label: 'Candidate Rejected',
    icon: XCircle,
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
    cardClass: 'border-slate-200 bg-white/60 opacity-85 hover:opacity-100 transition-opacity',
    nodeClass: 'bg-rose-500 text-white ring-2 ring-rose-100',
    isDominant: false,
  },
  FILTERED: {
    label: 'Filtered Out',
    icon: Filter,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    cardClass: 'border-slate-200 bg-slate-50/50',
    nodeClass: 'bg-slate-400 text-white ring-2 ring-slate-200',
    isDominant: false,
  },
  INFO: {
    label: 'Evaluation Step',
    icon: Info,
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    cardClass: 'border-slate-200 bg-white',
    nodeClass: 'bg-indigo-600 text-white ring-2 ring-indigo-100',
    isDominant: false,
  },
}

export function ReasoningTimeline({ reasoning }: ReasoningTimelineProps) {
  if (reasoning.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-2xs">
        <p className="text-xs text-slate-500">No reasoning entries returned for this optimization run.</p>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs">
      <div className="mb-5 border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
          Optimization Decision Reasoning Trail
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Chronological solver audit trail showing candidate evaluation, constraint filtering, and selection rationale.
        </p>
      </div>

      <ol className="relative space-y-0 pl-1">
        {reasoning.map((entry, index) => {
          const config = decisionConfig[entry.decision] ?? decisionConfig.INFO
          const Icon = config.icon
          const isLast = index === reasoning.length - 1

          return (
            <li key={`${entry.decision}-${index}`} className="relative flex gap-4 pb-5 last:pb-0">
              {/* Connector line */}
              {!isLast ? (
                <span
                  className="absolute left-[13px] top-7 h-[calc(100%-12px)] w-0.5 bg-slate-200"
                  aria-hidden="true"
                />
              ) : null}

              {/* Step indicator node */}
              <span
                className={cn(
                  'relative z-10 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold shadow-2xs',
                  config.nodeClass,
                )}
                aria-hidden="true"
              >
                {index + 1}
              </span>

              {/* Content card */}
              <div
                className={cn(
                  'min-w-0 flex-1 rounded-xl border p-4 transition-all',
                  config.cardClass,
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold',
                        config.badgeClass,
                      )}
                    >
                      <Icon className="size-3.5" aria-hidden="true" />
                      {config.label}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      Step {index + 1} of {reasoning.length}
                    </span>
                  </div>

                  {entry.warehouseName ? (
                    <span className="inline-flex items-center gap-1 rounded bg-slate-100/90 px-2 py-0.5 text-xs font-medium text-slate-700">
                      <Warehouse className="size-3 text-slate-500" />
                      {entry.warehouseName}
                    </span>
                  ) : null}
                </div>

                <p
                  className={cn(
                    'mt-2.5 text-sm leading-relaxed',
                    config.isDominant
                      ? 'font-semibold text-slate-900'
                      : 'text-slate-700',
                  )}
                >
                  {entry.message}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
