import { AlertCircle, BarChart3, RefreshCw } from 'lucide-react'

type AnalyticsErrorStateProps = {
  onRetry?: () => void
}

export function AnalyticsErrorState({ onRetry }: AnalyticsErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-[#C95555]/40 bg-[#17171B] p-8 text-center shadow-xl space-y-4 max-w-lg mx-auto my-12"
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#C95555]/10 border border-[#C95555]/20">
        <AlertCircle className="size-6 text-[#C95555]" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <h2 className="font-display text-lg font-bold text-[#F4F4F5]">
          Analytics unavailable
        </h2>
        <p className="text-xs text-[#A1A1AA] leading-relaxed">
          FulfillX couldn't load performance data. Please verify network connectivity and telemetry endpoints.
        </p>
      </div>

      {onRetry ? (
        <div className="pt-2">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded border border-[#C4622D] bg-[#C4622D] px-4 py-2 font-mono text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#9E4A20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
          >
            <RefreshCw className="size-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : null}
    </div>
  )
}

export function AnalyticsEmptyState() {
  return (
    <div className="rounded-xl border border-[#262630] bg-[#17171B] p-12 text-center shadow-xl space-y-4 max-w-lg mx-auto my-12">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#1C1C21] border border-[#262630]">
        <BarChart3 className="size-6 text-[#71717A]" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <h2 className="font-display text-lg font-bold text-[#F4F4F5]">
          No data for this period
        </h2>
        <p className="text-xs text-[#A1A1AA] leading-relaxed">
          Telemetry records will populate automatically as customer orders are created and fulfillment allocations are executed. Try a wider date range.
        </p>
      </div>
    </div>
  )
}
