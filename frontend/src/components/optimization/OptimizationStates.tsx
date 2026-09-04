import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { paths } from '../../routes/paths'

type ReadyForOptimizationProps = {
  pendingCount: number
  onRunOptimization: () => void
  isSubmitting?: boolean
}

export function ReadyForOptimizationState({
  pendingCount,
  onRunOptimization,
  isSubmitting = false,
}: ReadyForOptimizationProps) {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center rounded-xl border border-[#262630] bg-[#17171B] p-8 text-center shadow-sm sm:p-12">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-[#C4622D]/30 bg-[#C4622D]/10 text-[#C4622D]">
        <Cpu className="size-7" />
      </div>

      <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#C4622D]">
        DECISION ENGINE READY
      </span>

      <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-3xl">
        READY FOR OPTIMIZATION
      </h2>

      <p className="mt-2 max-w-md text-sm text-[#A1A1AA] leading-relaxed">
        <strong className="text-[#F4F4F5] font-mono">{pendingCount}</strong> {pendingCount === 1 ? 'order is' : 'orders are'} waiting for warehouse routing.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRunOptimization}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded border border-[#C4622D] bg-[#C4622D] px-5 py-2.5 font-mono text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#9E4A20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
        >
          <span>Run Optimization</span>
          <ArrowRight className="size-3.5" />
        </button>

        <Link
          to={paths.orders}
          className="inline-flex items-center gap-2 rounded border border-[#262630] bg-[#1C1C21] px-4 py-2.5 font-mono text-xs font-medium text-[#A1A1AA] transition-colors hover:border-[#71717A] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
        >
          <span>View Orders</span>
          <ArrowRight className="size-3 text-[#71717A]" />
        </Link>
      </div>
    </div>
  )
}

type NetworkOptimizedProps = {
  onSimulateCustom?: () => void
}

export function NetworkOptimizedState({ onSimulateCustom }: NetworkOptimizedProps) {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center rounded-xl border border-[#262630] bg-[#17171B] p-8 text-center shadow-sm sm:p-12">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-[#3FA66B]/30 bg-[#3FA66B]/10 text-[#3FA66B]">
        <CheckCircle2 className="size-7" />
      </div>

      <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#3FA66B]">
        ALL DEMAND ROUTED
      </span>

      <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-3xl">
        NETWORK OPTIMIZED
      </h2>

      <p className="mt-2 max-w-md text-sm text-[#A1A1AA] leading-relaxed">
        No pending orders currently require warehouse routing.
      </p>

      {onSimulateCustom ? (
        <div className="mt-6">
          <button
            type="button"
            onClick={onSimulateCustom}
            className="inline-flex items-center gap-2 rounded border border-[#262630] bg-[#1C1C21] px-4 py-2.5 font-mono text-xs font-medium text-[#A1A1AA] transition-colors hover:border-[#71717A] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
          >
            <Sparkles className="size-3.5 text-[#C4622D]" />
            <span>Simulate Custom Manifest</span>
          </button>
        </div>
      ) : null}
    </div>
  )
}

export function OptimizationRunningState() {
  return (
    <div className="flex min-h-[440px] flex-col items-center justify-center rounded-xl border border-[#262630] bg-[#17171B] p-8 text-center shadow-sm sm:p-12">
      <div className="relative mb-6">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-[#C4622D]/40 bg-[#C4622D]/15 text-[#C4622D] shadow-lg">
          <Cpu className="size-8 animate-pulse text-[#C4622D]" />
        </div>
        <span className="absolute -top-1 -right-1 flex size-3.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#C4622D] opacity-75"></span>
          <span className="relative inline-flex size-3.5 rounded-full bg-[#C4622D]"></span>
        </span>
      </div>

      <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#C4622D]">
        SOLVER RUNNING
      </span>

      <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[#F4F4F5]">
        RUNNING OPTIMIZATION
      </h2>

      <p className="mt-2 max-w-md text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
        Evaluating inventory, facility capacity, shipping cost, and distance...
      </p>

      {/* Structured animated solver audit steps */}
      <div className="mt-6 w-full max-w-xs space-y-2.5 rounded-lg border border-[#202027] bg-[#1C1C21] p-4 text-left font-mono text-xs">
        <div className="flex items-center gap-2 text-[#C4622D]">
          <span className="size-1.5 rounded-full bg-[#C4622D] animate-ping" />
          <span className="font-medium">Evaluating candidate facility nodes</span>
        </div>
        <div className="flex items-center gap-2 text-[#71717A]">
          <span className="size-1.5 rounded-full bg-[#71717A]" />
          <span>Computing multi-factor objective weights</span>
        </div>
        <div className="flex items-center gap-2 text-[#71717A]">
          <span className="size-1.5 rounded-full bg-[#71717A]" />
          <span>Auditing inventory constraints & stock headroom</span>
        </div>
      </div>
    </div>
  )
}

type OptimizationErrorAlertProps = {
  message: string
  onRetry?: () => void
  onDismiss?: () => void
}

export function OptimizationErrorAlert({
  message,
  onRetry,
  onDismiss,
}: OptimizationErrorAlertProps) {
  return (
    <div
      className="rounded-xl border border-[#C95555]/40 bg-[#C95555]/10 p-5 shadow-sm"
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-[#C95555]" aria-hidden="true" />
          <div className="space-y-1">
            <h3 className="font-display text-sm font-bold text-[#F4F4F5]">
              Optimization unavailable
            </h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              FulfillX could not complete the optimization run.
            </p>
            <p className="font-mono text-xs text-[#C95555] pt-1">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 rounded border border-[#C95555]/40 bg-[#17171B] px-3 py-1.5 font-mono text-xs font-medium text-[#F4F4F5] transition-colors hover:bg-[#C95555]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C95555]"
            >
              <RefreshCw className="size-3" />
              <span>Retry</span>
            </button>
          ) : null}

          {onDismiss ? (
            <button
              type="button"
              onClick={onDismiss}
              className="rounded px-2.5 py-1.5 font-mono text-xs text-[#71717A] hover:text-[#F4F4F5]"
            >
              Dismiss
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function OptimizationOptionsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-[#C95555]/40 bg-[#17171B] p-6 text-center shadow-sm">
      <AlertCircle className="mx-auto size-8 text-[#C95555]" />
      <h3 className="mt-3 font-display text-sm font-bold text-[#F4F4F5]">
        Unable to load optimization options
      </h3>
      <p className="mt-1 text-xs text-[#A1A1AA]">
        Customer and product catalog data is required before running fulfillment optimization.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded border border-[#262630] bg-[#1C1C21] px-4 py-2 font-mono text-xs font-semibold text-[#F4F4F5] hover:border-[#71717A]"
      >
        <RefreshCw className="size-3.5" />
        <span>Retry Loading</span>
      </button>
    </div>
  )
}
