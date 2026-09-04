import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, FileQuestion, Home, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

import { paths } from '../../routes/paths'

type ErrorPageProps = {
  code?: string
  title: string
  description: string
  icon?: LucideIcon
  showHomeLink?: boolean
  onRetry?: () => void
}

export function ErrorPage({
  code,
  title,
  description,
  icon: Icon = FileQuestion,
  showHomeLink = true,
  onRetry,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center text-[#F4F4F5]">
      <div className="flex size-16 items-center justify-center rounded-2xl border border-[#262630] bg-[#17171B] text-[#A1A1AA] shadow-xl">
        <Icon className="size-8 text-[#C4622D]" aria-hidden="true" />
      </div>
      {code ? (
        <p className="mt-6 font-mono text-xs font-semibold uppercase tracking-widest text-[#C4622D]">{code}</p>
      ) : null}
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-3xl">{title}</h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#A1A1AA] sm:text-base">{description}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {showHomeLink ? (
          <Link
            to={paths.dashboard}
            className="inline-flex items-center justify-center gap-2 rounded border border-[#C4622D] bg-[#C4622D] px-4 py-2 font-mono text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#9E4A20] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
          >
            <Home className="size-4" aria-hidden="true" />
            <span>Back to Dashboard</span>
          </Link>
        ) : null}
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded border border-[#262630] bg-[#17171B] px-4 py-2 font-mono text-xs font-semibold text-[#F4F4F5] transition-all duration-200 hover:bg-[#1C1C21] hover:border-[#71717A] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
          >
            <RefreshCw className="size-4 text-[#71717A]" aria-hidden="true" />
            <span>Try Again</span>
          </button>
        ) : null}
      </div>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <ErrorPage
      code="404"
      title="Page Not Found"
      description="The operational route you requested does not exist or may have been relocated. Review the primary navigation or return to operations."
      icon={FileQuestion}
    />
  )
}

export function ServerErrorPage({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorPage
      code="500"
      title="System Execution Error"
      description="An unexpected error occurred while communicating with backend logistics services. Please retry or re-sync telemetry."
      icon={AlertTriangle}
      onRetry={onRetry}
    />
  )
}
