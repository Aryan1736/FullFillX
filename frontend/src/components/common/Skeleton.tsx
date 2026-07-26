import { cn } from '../../utils/cn'

type SkeletonProps = {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden="true" className={cn('animate-skeleton rounded-md bg-slate-200', className)} />
}

type TableSkeletonProps = {
  rows?: number
  columns?: number
  showMobileCards?: boolean
}

export function TableSkeleton({ rows = 6, columns = 6, showMobileCards = false }: TableSkeletonProps) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading table data">
      <div className={cn('overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm', showMobileCards && 'hidden md:block')}>
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0">
            {Array.from({ length: columns }).map((__, cellIndex) => (
              <Skeleton key={cellIndex} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>

      {showMobileCards ? (
        <div className="grid gap-4 md:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-3 h-4 w-24" />
              <div className="mt-4 grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((__, cellIndex) => (
                  <Skeleton key={cellIndex} className="h-4" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

type CardGridSkeletonProps = {
  count?: number
  columns?: string
}

export function CardGridSkeleton({ count = 4, columns = 'sm:grid-cols-2 xl:grid-cols-4' }: CardGridSkeletonProps) {
  return (
    <div className={cn('grid gap-4', columns)} aria-busy="true" aria-label="Loading cards">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="size-10 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

type ChartGridSkeletonProps = {
  count?: number
}

export function ChartGridSkeleton({ count = 4 }: ChartGridSkeletonProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2" aria-busy="true" aria-label="Loading charts">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-72 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export function MapSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading map">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Skeleton className="h-[min(70vh,560px)] min-h-[320px] rounded-xl" />
        <Skeleton className="h-[min(70vh,560px)] min-h-[320px] rounded-xl" />
      </div>
    </div>
  )
}
