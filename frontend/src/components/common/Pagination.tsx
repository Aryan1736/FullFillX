import { ChevronLeft, ChevronRight } from 'lucide-react'

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
  variant?: 'light' | 'dark'
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
      className="flex flex-col gap-3 rounded-xl border border-[#262630] bg-[#17171B] px-5 py-3 shadow-xl sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="font-mono text-xs text-[#71717A]">
        Showing <span className="text-[#F4F4F5]">{pageStart}–{pageEnd}</span> of{' '}
        <span className="text-[#F4F4F5]">{totalElements}</span> {itemLabel}
        {isFetching ? ' · Updating…' : ''}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(page - 1, 0))}
          disabled={isFirst}
          aria-label="Previous page"
          className="inline-flex items-center gap-1.5 rounded border border-[#262630] bg-[#1C1C21] px-3 py-1.5 font-mono text-xs font-medium text-[#F4F4F5] transition-all duration-200 hover:border-[#71717A] hover:bg-[#262630] hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
        >
          <ChevronLeft className="size-3.5 text-[#71717A]" aria-hidden="true" />
          <span>Previous</span>
        </button>
        <span className="px-2 font-mono text-xs text-[#71717A]" aria-live="polite">
          Page <span className="text-[#F4F4F5]">{totalPages === 0 ? 0 : page + 1}</span> of{' '}
          <span className="text-[#F4F4F5]">{totalPages}</span>
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={isLast}
          aria-label="Next page"
          className="inline-flex items-center gap-1.5 rounded border border-[#262630] bg-[#1C1C21] px-3 py-1.5 font-mono text-xs font-medium text-[#F4F4F5] transition-all duration-200 hover:border-[#71717A] hover:bg-[#262630] hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
        >
          <span>Next</span>
          <ChevronRight className="size-3.5 text-[#71717A]" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}
