import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from './Button'

type PaginationProps = {
  page: number
  pageSize: number
  totalElements: number
  totalPages: number
  isFirst: boolean
  isLast: boolean
  isFetching?: boolean
  onPageChange: (page: number) => void
  itemLabel?: string
}

export function Pagination({
  page,
  pageSize,
  totalElements,
  totalPages,
  isFirst,
  isLast,
  isFetching = false,
  onPageChange,
  itemLabel = 'records',
}: PaginationProps) {
  const pageStart = totalElements === 0 ? 0 : page * pageSize + 1
  const pageEnd = Math.min((page + 1) * pageSize, totalElements)

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-slate-600">
        Showing {pageStart}–{pageEnd} of {totalElements} {itemLabel}
        {isFetching ? ' · Updating…' : ''}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(Math.max(page - 1, 0))}
          disabled={isFirst}
          aria-label="Previous page"
          leftIcon={<ChevronLeft className="size-4" aria-hidden="true" />}
        >
          Previous
        </Button>
        <span className="px-2 text-sm text-slate-600" aria-live="polite">
          Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={isLast}
          aria-label="Next page"
          rightIcon={<ChevronRight className="size-4" aria-hidden="true" />}
        >
          Next
        </Button>
      </div>
    </nav>
  )
}
