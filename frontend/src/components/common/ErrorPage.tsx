import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, FileQuestion, Home, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

import { paths } from '../../routes/paths'
import { Button } from './Button'
import { cn } from '../../utils/cn'

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
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Icon className="size-8" aria-hidden="true" />
      </div>
      {code ? (
        <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-indigo-600">{code}</p>
      ) : null}
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">{description}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {showHomeLink ? (
          <Link
            to={paths.dashboard}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white',
              'transition-all duration-200 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
            )}
          >
            <Home className="size-4" aria-hidden="true" />
            Back to dashboard
          </Link>
        ) : null}
        {onRetry ? (
          <Button
            variant="secondary"
            onClick={onRetry}
            leftIcon={<RefreshCw className="size-4" aria-hidden="true" />}
          >
            Try again
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <ErrorPage
      code="404"
      title="Page not found"
      description="The page you are looking for does not exist or may have been moved. Check the URL or return to the dashboard."
      icon={FileQuestion}
    />
  )
}

export function ServerErrorPage({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorPage
      code="500"
      title="Something went wrong"
      description="An unexpected error occurred while loading this page. Please try again or return to the dashboard."
      icon={AlertTriangle}
      onRetry={onRetry}
    />
  )
}
