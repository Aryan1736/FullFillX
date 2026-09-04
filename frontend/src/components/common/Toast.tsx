import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '../../utils/cn'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export type ToastItem = {
  id: string
  message: string
  variant: ToastVariant
  durationMs?: number
}

type ToastProps = {
  toast: ToastItem
  onDismiss: (id: string) => void
}

const variantStyles: Record<ToastVariant, { container: string; icon: typeof CheckCircle2 }> = {
  success: {
    container: 'border-[#3FA66B]/40 bg-[#17171B] text-[#F4F4F5]',
    icon: CheckCircle2,
  },
  error: {
    container: 'border-[#C95555]/40 bg-[#17171B] text-[#F4F4F5]',
    icon: XCircle,
  },
  info: {
    container: 'border-[#C4622D]/40 bg-[#17171B] text-[#F4F4F5]',
    icon: Info,
  },
  warning: {
    container: 'border-[#D08A35]/40 bg-[#17171B] text-[#F4F4F5]',
    icon: AlertCircle,
  },
}

const iconColors: Record<ToastVariant, string> = {
  success: 'text-[#3FA66B]',
  error: 'text-[#C95555]',
  info: 'text-[#C4622D]',
  warning: 'text-[#D08A35]',
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)
  const { container, icon: Icon } = variantStyles[toast.variant]
  const durationMs = toast.durationMs ?? 4500

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsExiting(true)
      window.setTimeout(() => onDismiss(toast.id), 200)
    }, durationMs)

    return () => window.clearTimeout(timer)
  }, [durationMs, onDismiss, toast.id])

  const handleDismiss = () => {
    setIsExiting(true)
    window.setTimeout(() => onDismiss(toast.id), 200)
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md',
        container,
        isExiting ? 'animate-toast-exit' : 'animate-toast-enter',
      )}
    >
      <Icon className={cn('mt-0.5 size-4.5 shrink-0', iconColors[toast.variant])} aria-hidden="true" />
      <p className="flex-1 text-xs font-medium leading-relaxed text-[#F4F4F5]">{toast.message}</p>
      <button
        type="button"
        onClick={handleDismiss}
        className="rounded-md p-1 text-[#71717A] transition-colors hover:bg-[#202027] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
        aria-label="Dismiss notification"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}

type ToastContainerProps = {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) {
    return null
  }

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 px-4 sm:bottom-6 sm:right-6 sm:px-0"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
