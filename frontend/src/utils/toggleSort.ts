export type SortDirection = 'asc' | 'desc'

export type SortState<TField extends string> = {
  field: TField
  direction: SortDirection
}

export function toggleSort<TField extends string>(
  current: SortState<TField>,
  field: TField,
  defaultDirection: SortDirection = 'asc',
): SortState<TField> {
  if (current.field === field) {
    return {
      field,
      direction: current.direction === 'asc' ? 'desc' : 'asc',
    }
  }

  return { field, direction: defaultDirection }
}
