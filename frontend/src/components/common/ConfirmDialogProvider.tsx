import { AlertTriangle } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { cn } from '../../utils/cn'

export type ConfirmDialogOptions = {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
}

type ConfirmDialogState = ConfirmDialogOptions & {
  isOpen: boolean
}

type ConfirmDialogContextValue = {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>
}

const ConfirmDialogContext = createContext<ConfirmDialogContextValue | null>(null)

const defaultState: ConfirmDialogState = {
  isOpen: false,
  title: '',
  message: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  variant: 'primary',
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<ConfirmDialogState>(defaultState)
  const resolveRef = useRef<((value: boolean) => void) | null>(null)

  const closeDialog = useCallback((confirmed: boolean) => {
    setDialog(defaultState)
    resolveRef.current?.(confirmed)
    resolveRef.current = null
  }, [])

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
      setDialog({
        isOpen: true,
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel ?? 'Confirm',
        cancelLabel: options.cancelLabel ?? 'Cancel',
        variant: options.variant ?? 'primary',
      })
    })
  }, [])

  const value = useMemo(() => ({ confirm }), [confirm])

  useEffect(() => {
    if (!dialog.isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDialog(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dialog.isOpen, closeDialog])

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}

      {dialog.isOpen ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-[#0E0E10]/80 backdrop-blur-xs transition-opacity"
            aria-label="Close dialog"
            onClick={() => closeDialog(false)}
          />

          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            className="relative w-full max-w-md rounded-xl border border-[#262630] bg-[#17171B] p-6 shadow-2xl transition-all animate-toast-enter"
          >
            <div className="flex items-start gap-3.5">
              <div
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-lg border',
                  dialog.variant === 'danger'
                    ? 'border-[#C95555]/30 bg-[#C95555]/15 text-[#C95555]'
                    : 'border-[#C4622D]/30 bg-[#C4622D]/15 text-[#C4622D]',
                )}
              >
                <AlertTriangle className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="confirm-dialog-title" className="font-display text-base font-bold tracking-tight text-[#F4F4F5]">
                  {dialog.title}
                </h2>
                <p id="confirm-dialog-description" className="mt-2 text-xs leading-relaxed text-[#A1A1AA]">
                  {dialog.message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end border-t border-[#202027] pt-4">
              <button
                type="button"
                onClick={() => closeDialog(false)}
                className="rounded border border-[#262630] bg-[#1C1C21] px-4 py-2 font-mono text-xs font-semibold text-[#A1A1AA] transition-colors hover:border-[#71717A] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
              >
                {dialog.cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => closeDialog(true)}
                className={cn(
                  'rounded px-4 py-2 font-mono text-xs font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2',
                  dialog.variant === 'danger'
                    ? 'border border-[#C95555] bg-[#C95555] hover:bg-[#A84444] focus-visible:ring-[#C95555]'
                    : 'border border-[#C4622D] bg-[#C4622D] hover:bg-[#9E4A20] focus-visible:ring-[#C4622D]',
                )}
              >
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ConfirmDialogContext.Provider>
  )
}

export function useConfirmDialog(): ConfirmDialogContextValue {
  const context = useContext(ConfirmDialogContext)
  if (!context) {
    throw new Error('useConfirmDialog must be used within ConfirmDialogProvider')
  }
  return context
}
