import { AlertTriangle } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { Button } from './Button'
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
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px] transition-opacity"
            aria-label="Close dialog"
            onClick={() => closeDialog(false)}
          />

          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl transition-all animate-toast-enter"
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-full',
                  dialog.variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600',
                )}
              >
                <AlertTriangle className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="confirm-dialog-title" className="text-lg font-semibold tracking-tight text-slate-900">
                  {dialog.title}
                </h2>
                <p id="confirm-dialog-description" className="mt-2 text-sm leading-relaxed text-slate-600">
                  {dialog.message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => closeDialog(false)}>
                {dialog.cancelLabel}
              </Button>
              <Button
                variant={dialog.variant === 'danger' ? 'danger' : 'primary'}
                onClick={() => closeDialog(true)}
              >
                {dialog.confirmLabel}
              </Button>
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
