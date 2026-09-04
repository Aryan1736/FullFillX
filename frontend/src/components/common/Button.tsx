import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '../../utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border border-[#C4622D] bg-[#C4622D] text-white hover:bg-[#9E4A20] hover:border-[#9E4A20] active:bg-[#853C17] disabled:border-[#262630] disabled:bg-[#1C1C21] disabled:text-[#71717A]',
  secondary:
    'border border-[#262630] bg-[#17171B] text-[#F4F4F5] hover:bg-[#1C1C21] hover:border-[#71717A] active:bg-[#202027] disabled:opacity-50',
  danger:
    'border border-[#C95555] bg-[#C95555] text-white hover:bg-[#A84040] hover:border-[#A84040] active:bg-[#8F3333] disabled:opacity-50',
  ghost:
    'border border-transparent text-[#A1A1AA] hover:bg-[#1C1C21] hover:text-[#F4F4F5] active:bg-[#202027] disabled:opacity-50',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-xs font-semibold',
  lg: 'px-5 py-2.5 text-sm font-semibold',
}

export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium shadow-xs',
        'transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-px',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]',
        'disabled:cursor-not-allowed disabled:hover:translate-y-0',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}
