import { CheckCircle2, Loader2, Play, ShieldAlert } from 'lucide-react'

type CommitExecutionCardProps = {
  isExecuting: boolean
  isExecuted: boolean
  onExecute: () => void
  disabled?: boolean
}

export function CommitExecutionCard({
  isExecuting,
  isExecuted,
  onExecute,
  disabled = false,
}: CommitExecutionCardProps) {
  return (
    <div className="rounded-xl border border-[#262630] bg-[#17171B] p-6 shadow-sm space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#202027] pb-4">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#C4622D]">
            DECISION TO ACTION BRIDGE
          </span>
          <h3 className="font-display text-base font-bold text-[#F4F4F5] sm:text-lg mt-0.5">
            Allocation Execution
          </h3>
          <p className="mt-1 text-xs text-[#A1A1AA]">
            {isExecuted
              ? 'Operational state committed. Inventory has been reserved and warehouse load incremented.'
              : 'This will reserve inventory, update warehouse load, and create the allocation.'}
          </p>
        </div>

        <div className="shrink-0">
          {isExecuted ? (
            <div className="inline-flex items-center gap-2 rounded-lg border border-[#3FA66B]/40 bg-[#3FA66B]/15 px-4 py-2.5 font-mono text-xs font-semibold text-[#3FA66B]">
              <CheckCircle2 className="size-4 text-[#3FA66B]" />
              Allocation Committed
            </div>
          ) : (
            <button
              type="button"
              onClick={onExecute}
              disabled={disabled || isExecuting}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded border border-[#C4622D] bg-[#C4622D] px-5 py-2.5 font-mono text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#9E4A20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] disabled:cursor-not-allowed disabled:border-[#262630] disabled:bg-[#1C1C21] disabled:text-[#71717A]"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  <span>Committing & Reserving…</span>
                </>
              ) : (
                <>
                  <Play className="size-3.5 fill-current" aria-hidden="true" />
                  <span>Commit & Execute</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* State Callout Strip */}
      <div className="flex items-start gap-3 rounded-lg border border-[#202027] bg-[#1C1C21] p-3.5 text-xs">
        <ShieldAlert className="size-4 shrink-0 text-[#C4622D] mt-0.5" />
        <div className="text-[#A1A1AA] leading-relaxed">
          {isExecuted ? (
            <span className="text-[#3FA66B] font-medium">
              Network state updated. Orders marked ALLOCATED and available stock decremented across assigned hubs.
            </span>
          ) : (
            <span>
              <strong className="text-[#F4F4F5]">Simulation Mode:</strong> Until committed, this recommendation represents a multi-criteria mathematical simulation. No inventory reservations or capacity adjustments have occurred.
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
