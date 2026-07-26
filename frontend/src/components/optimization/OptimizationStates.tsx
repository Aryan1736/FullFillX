import { AlertCircle, Sparkles } from 'lucide-react'

import { EmptyState } from '../common/EmptyState'
import { ErrorState } from '../common/ErrorState'
import { LoadingSpinner } from '../common/LoadingSpinner'

type OptimizationErrorAlertProps = {
  message: string
  onDismiss?: () => void
}

export function OptimizationErrorAlert({ message, onDismiss }: OptimizationErrorAlertProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4" role="alert">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-red-900">Optimization failed</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
        </div>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg px-2 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Dismiss
          </button>
        ) : null}
      </div>
    </div>
  )
}

type OptimizationResultsPlaceholderProps = {
  isRunning: boolean
}

export function OptimizationResultsPlaceholder({ isRunning }: OptimizationResultsPlaceholderProps) {
  if (isRunning) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <LoadingSpinner label="Running optimization…" />
      </div>
    )
  }

  return (
    <EmptyState
      icon={Sparkles}
      title="No results yet"
      description="Configure the simulation on the left and run optimization to see allocation decisions, scoring, and reasoning here."
      className="min-h-[320px] flex flex-col justify-center"
    />
  )
}

type OptimizationOptionsErrorProps = {
  onRetry: () => void
}

export function OptimizationOptionsError({ onRetry }: OptimizationOptionsErrorProps) {
  return (
    <ErrorState
      title="Unable to load simulation options"
      message="Customer and product data is required before running optimization."
      onRetry={onRetry}
    />
  )
}
