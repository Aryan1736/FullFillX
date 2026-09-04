import { AlertCircle, RefreshCw } from 'lucide-react'

type ErrorStateProps = {
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this data. Please try again.',
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-[#C95555]/30 bg-[#17171B] p-8 text-center text-[#F4F4F5] shadow-xl"
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-[#C95555]/30 bg-[#C95555]/10 text-[#C95555]">
        <AlertCircle className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 font-display text-base font-bold tracking-tight text-[#F4F4F5]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#A1A1AA]">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded border border-[#262630] bg-[#1C1C21] px-4 py-2 font-mono text-xs font-semibold text-[#F4F4F5] transition-all duration-200 hover:border-[#71717A] hover:bg-[#202027] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
        >
          <RefreshCw className="size-3.5 text-[#71717A]" aria-hidden="true" />
          <span>{retryLabel}</span>
        </button>
      ) : null}
    </div>
  )
}
