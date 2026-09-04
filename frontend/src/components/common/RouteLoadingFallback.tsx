import { LoadingSpinner } from './LoadingSpinner'

export function RouteLoadingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-[50vh] items-center justify-center"
    >
      <div className="flex items-center gap-3 rounded-xl border border-[#262630] bg-[#17171B] px-5 py-3.5 shadow-xl">
        <LoadingSpinner label="Loading telemetry..." />
      </div>
    </div>
  )
}
