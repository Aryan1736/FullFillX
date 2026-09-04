import type { AnalyticsTimeRange } from '../../hooks/useShippingCostTrend'
import { cn } from '../../utils/cn'

type AnalyticsHeaderProps = {
  timeRange: AnalyticsTimeRange
  onTimeRangeChange: (range: AnalyticsTimeRange) => void
  startDate: string
  endDate: string
  isMock?: boolean
}

const TIME_RANGES: { value: AnalyticsTimeRange; label: string; description: string }[] = [
  { value: '7D', label: '7D', description: 'Past 7 Days' },
  { value: '30D', label: '30D', description: 'Past 30 Days' },
  { value: '90D', label: '90D', description: 'Past 90 Days' },
]

export function AnalyticsHeader({
  timeRange,
  onTimeRangeChange,
  startDate,
  endDate,
  isMock = false,
}: AnalyticsHeaderProps) {
  return (
    <header className="animate-section-1 flex flex-col gap-6 border-b border-[#202027] pb-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#71717A]">
            PERFORMANCE INTELLIGENCE
          </span>
          <span className="text-[#262630]" aria-hidden="true">
            |
          </span>
          {isMock ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#D08A35]">
              <span className="size-1.5 rounded-full bg-[#D08A35]" aria-hidden="true" />
              SIMULATED TELEMETRY
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#3FA66B]">
              <span className="size-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
              LIVE TELEMETRY
            </span>
          )}
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl lg:text-5xl">
          Analytics
        </h1>

        <p className="text-sm leading-relaxed text-[#A1A1AA] sm:text-base">
          Measure fulfillment performance, shipping economics, and network health over time.
        </p>
      </div>

      {/* Range controls & Interval window */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 rounded-lg border border-[#262630] bg-[#17171B] px-3 py-1.5 text-xs text-[#71717A]">
          <span className="font-mono text-[11px] text-[#A1A1AA]">
            {startDate} <span className="text-[#71717A]">→</span> {endDate}
          </span>
        </div>

        <div
          role="group"
          aria-label="Analytics historical time range"
          className="inline-flex items-center rounded-lg border border-[#262630] bg-[#17171B] p-1 shadow-sm"
        >
          {TIME_RANGES.map((range) => {
            const isActive = timeRange === range.value
            return (
              <button
                key={range.value}
                type="button"
                onClick={() => onTimeRangeChange(range.value)}
                aria-pressed={isActive}
                title={range.description}
                className={cn(
                  'rounded px-3.5 py-1.5 font-mono text-xs font-medium transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]',
                  isActive
                    ? 'bg-[#1C1C21] font-semibold text-[#F4F4F5] shadow-xs border border-[#262630]'
                    : 'text-[#71717A] hover:text-[#F4F4F5]',
                )}
              >
                {range.label}
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
