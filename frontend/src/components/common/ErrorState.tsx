import { AlertCircle, RefreshCw } from 'lucide-react'

import { Button } from './Button'

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
      className="rounded-xl border border-red-200 bg-red-50 p-8 text-center transition-colors"
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertCircle className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold tracking-tight text-red-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-red-700">{message}</p>
      {onRetry ? (
        <Button
          variant="danger"
          className="mt-5"
          onClick={onRetry}
          leftIcon={<RefreshCw className="size-4" aria-hidden="true" />}
        >
          {retryLabel}
        </Button>
      ) : null}
    </div>
  )
}
