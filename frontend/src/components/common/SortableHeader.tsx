import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

import type { SortDirection, SortState } from '../../utils/toggleSort'
import { cn } from '../../utils/cn'

type SortableHeaderProps<TField extends string> = {
  label: string
  field: TField
  sort: SortState<TField>
  onSortChange: (field: TField) => void
  className?: string
}

function toAriaSort(direction: SortDirection | null): 'ascending' | 'descending' | 'none' {
  if (direction === 'asc') {
    return 'ascending'
  }
  if (direction === 'desc') {
    return 'descending'
  }
  return 'none'
}

export function SortableHeader<TField extends string>({
  label,
  field,
  sort,
  onSortChange,
  className,
}: SortableHeaderProps<TField>) {
  const isActive = sort.field === field
  const Icon = !isActive ? ArrowUpDown : sort.direction === 'asc' ? ArrowUp : ArrowDown
  const ariaSort = toAriaSort(isActive ? sort.direction : null)

  return (
    <th scope="col" className={className} aria-sort={ariaSort}>
      <button
        type="button"
        onClick={() => onSortChange(field)}
        className="inline-flex items-center gap-1.5 text-left font-medium text-slate-600 transition-colors hover:text-slate-900"
        aria-label={`Sort by ${label}, ${isActive ? sort.direction : 'not sorted'}`}
      >
        {label}
        <Icon className={cn('size-3.5', isActive ? 'text-slate-900' : 'text-slate-400')} aria-hidden="true" />
      </button>
    </th>
  )
}
