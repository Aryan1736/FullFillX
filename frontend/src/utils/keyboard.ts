import type { KeyboardEvent as ReactKeyboardEvent } from 'react'

export function handleRowKeyDown(
  event: ReactKeyboardEvent<HTMLElement>,
  onActivate: () => void,
): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onActivate()
  }
}
