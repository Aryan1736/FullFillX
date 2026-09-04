import { ArrowRight, Cpu, Loader2, RefreshCw } from 'lucide-react'

type OptimizationHeaderProps = {
  isPending: boolean
  isExecuting: boolean
  hasPendingDemand: boolean
  isSimulatingCustom: boolean
  onRunOptimization: () => void
  onToggleMode?: () => void
  onRefreshData?: () => void
  isRefreshing?: boolean
}

export function OptimizationHeader({
  isPending,
  isExecuting,
  hasPendingDemand,
  isSimulatingCustom,
  onRunOptimization,
  onToggleMode,
  onRefreshData,
  isRefreshing = false,
}: OptimizationHeaderProps) {
  const isBusy = isPending || isExecuting

  return (
    <header className="animate-section-1 flex flex-col gap-6 border-b border-[#202027] pb-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#71717A]">
            OPTIMIZATION ENGINE
          </span>
          <span className="text-[#262630]" aria-hidden="true">|</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#3FA66B]">
            <span className="size-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
            WEIGHTED GREEDY SOLVER
          </span>
          {isSimulatingCustom ? (
            <span className="rounded border border-[#262630] bg-[#17171B] px-2 py-0.5 font-mono text-[10px] text-[#A1A1AA]">
              MANUAL MANIFEST
            </span>
          ) : null}
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl lg:text-5xl">
          Optimization Decision Center
        </h1>

        <p className="text-sm leading-relaxed text-[#A1A1AA] sm:text-base">
          Evaluate pending demand against warehouse capacity, inventory, cost, and distance.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0">
        {onRefreshData ? (
          <button
            type="button"
            onClick={onRefreshData}
            disabled={isBusy || isRefreshing}
            className="inline-flex items-center gap-2 rounded border border-[#262630] bg-[#17171B] px-3.5 py-2 font-mono text-xs font-medium text-[#A1A1AA] transition-all duration-200 hover:border-[#71717A] hover:text-[#F4F4F5] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] disabled:opacity-50 disabled:hover:translate-y-0"
            title="Refresh pending demand and warehouse capacity data"
          >
            <RefreshCw className={`size-3.5 text-[#71717A] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing…' : 'Sync Queue'}</span>
          </button>
        ) : null}

        {onToggleMode ? (
          <button
            type="button"
            onClick={onToggleMode}
            disabled={isBusy}
            className="inline-flex items-center gap-2 rounded border border-[#262630] bg-[#17171B] px-3.5 py-2 font-mono text-xs font-medium text-[#A1A1AA] transition-all duration-200 hover:border-[#71717A] hover:text-[#F4F4F5] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <span>{isSimulatingCustom ? '← Pending Demand' : 'Custom Manifest Simulator'}</span>
          </button>
        ) : null}

        <button
          type="button"
          onClick={onRunOptimization}
          disabled={isBusy || (!hasPendingDemand && !isSimulatingCustom)}
          className="inline-flex items-center gap-2 rounded border border-[#C4622D] bg-[#C4622D] px-4 py-2 font-mono text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#9E4A20] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] disabled:cursor-not-allowed disabled:border-[#262630] disabled:bg-[#1C1C21] disabled:text-[#71717A] disabled:hover:translate-y-0"
        >
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              <span>Running Solver…</span>
            </>
          ) : (
            <>
              <Cpu className="size-3.5" aria-hidden="true" />
              <span>Run Optimization</span>
              <ArrowRight className="size-3 text-white/70" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </header>
  )
}
