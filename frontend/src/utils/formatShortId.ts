export function formatShortId(value: string, maxLength = 12): string {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, 8)}…`
}
