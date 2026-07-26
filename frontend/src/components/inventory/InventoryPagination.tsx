import { ChevronLeft, ChevronRight } from 'lucide-react'

type InventoryPaginationProps = {
  page: number
  pageSize: number
  totalElements: number
  totalPages: number
  isFirst: boolean
  isLast: boolean
  isFetching?: boolean
  onPageChange: (page: number) => void
}

export function InventoryPagination({
  page,
  pageSize,
  totalElements,
  totalPages,
  isFirst,
  isLast,
  isFetching = false,
  onPageChange,
}: InventoryPaginationProps) {
  const pageStart = totalElements === 0 ? 0 : page * pageSize + 1
  const pageEnd = Math.min((page + 1) * pageSize, totalElements)

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Showing {pageStart}-{pageEnd} of {totalElements} records
        {isFetching ? ' · Updating...' : ''}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(page - 1, 0))}
          disabled={isFirst}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Previous
        </button>
        <span className="px-2 text-sm text-slate-600">
          Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={isLast}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
