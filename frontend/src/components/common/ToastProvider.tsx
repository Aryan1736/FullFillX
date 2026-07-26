import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import { ToastContainer, type ToastItem, type ToastVariant } from './Toast'

type ShowToastOptions = {
  variant?: ToastVariant
  durationMs?: number
}

type ToastContextValue = {
  showToast: (message: string, options?: ShowToastOptions) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

function createToastId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message: string, options?: ShowToastOptions) => {
    const toast: ToastItem = {
      id: createToastId(),
      message,
      variant: options?.variant ?? 'success',
      durationMs: options?.durationMs,
    }

    setToasts((current) => [...current.slice(-2), toast])
  }, [])

  const value = useMemo(
    () => ({
      showToast,
      dismissToast,
    }),
    [showToast, dismissToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
