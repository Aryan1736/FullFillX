import { LoadingSpinner } from './LoadingSpinner'

export function RouteLoadingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-[50vh] items-center justify-center"
    >
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 shadow-sm">
        <LoadingSpinner label="Loading page..." />
      </div>
    </div>
  )
}
