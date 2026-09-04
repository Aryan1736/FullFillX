import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  Check,
  ChevronDown,
  Minus,
  Package,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  User,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useConfirmDialog } from '../common/ConfirmDialogProvider'
import { useToast } from '../common/ToastProvider'
import type { Customer } from '../../types/customer'
import type { Product } from '../../types/product'
import { cn } from '../../utils/cn'

const productLineSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
})

const optimizationFormSchema = z.object({
  customerId: z.string().min(1, 'Select a customer destination'),
  productLines: z.array(productLineSchema).min(1, 'Select at least one product to fulfill'),
})

type OptimizationFormSchema = z.infer<typeof optimizationFormSchema>

type OptimizationFormProps = {
  customers: Customer[]
  products: Product[]
  isLoadingOptions: boolean
  isSubmitting: boolean
  onSubmit: (values: OptimizationFormSchema) => void
}

export function OptimizationForm({
  customers,
  products,
  isLoadingOptions,
  isSubmitting,
  onSubmit,
}: OptimizationFormProps) {
  const { confirm } = useConfirmDialog()
  const { showToast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<OptimizationFormSchema>({
    resolver: zodResolver(optimizationFormSchema),
    defaultValues: {
      customerId: '',
      productLines: [],
    },
  })

  const productLines = watch('productLines')
  const selectedProductIds = new Set(productLines.map((line) => line.productId))
  const totalQuantity = productLines.reduce((sum, line) => sum + line.quantity, 0)

  const toggleProduct = (productId: string) => {
    if (selectedProductIds.has(productId)) {
      setValue(
        'productLines',
        productLines.filter((line) => line.productId !== productId),
        { shouldValidate: true },
      )
      return
    }

    setValue('productLines', [...productLines, { productId, quantity: 1 }], { shouldValidate: true })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const validQty = Math.max(1, quantity)
    setValue(
      'productLines',
      productLines.map((line) =>
        line.productId === productId ? { ...line, quantity: validQty } : line,
      ),
      { shouldValidate: true },
    )
  }

  const handleReset = async () => {
    if (!isDirty) {
      return
    }

    const confirmed = await confirm({
      title: 'Reset simulation manifest?',
      message: 'This will clear the selected customer destination and configured SKU quantities.',
      confirmLabel: 'Reset Manifest',
      cancelLabel: 'Keep Editing',
      variant: 'danger',
    })

    if (confirmed) {
      reset({ customerId: '', productLines: [] })
      showToast('Simulation manifest reset.', { variant: 'info' })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col rounded-xl border border-[#262630] bg-[#17171B] p-5 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-[#202027] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-[#C4622D]" />
            <h3 className="font-display text-sm font-bold text-[#F4F4F5]">Custom Simulation Manifest</h3>
          </div>
          <p className="mt-0.5 text-xs text-[#71717A]">
            Define customer destination and test hypothetical routing.
          </p>
        </div>
        {productLines.length > 0 ? (
          <span className="inline-flex items-center rounded border border-[#C4622D]/30 bg-[#C4622D]/15 px-2.5 py-0.5 text-xs font-semibold font-mono text-[#C4622D]">
            {productLines.length} {productLines.length === 1 ? 'item' : 'items'} ({totalQuantity} units)
          </span>
        ) : null}
      </div>

      <div className="mt-5 space-y-5 flex-1">
        {/* Customer Select */}
        <div className="space-y-1.5">
          <label htmlFor="customerId" className="flex items-center justify-between text-xs font-semibold text-[#A1A1AA]">
            <span className="flex items-center gap-1.5">
              <User className="size-3.5 text-[#71717A]" />
              Customer Destination
            </span>
            <span className="text-[11px] font-mono text-[#71717A]">Required</span>
          </label>
          <div className="relative">
            <select
              id="customerId"
              disabled={isLoadingOptions || isSubmitting}
              className={cn(
                'w-full appearance-none rounded-lg border bg-[#1C1C21] px-3.5 py-2.5 pr-10 text-xs font-medium text-[#F4F4F5] transition-colors focus:border-[#C4622D] focus:outline-hidden focus:ring-2 focus:ring-[#C4622D] disabled:cursor-not-allowed disabled:opacity-50',
                errors.customerId ? 'border-[#C95555]' : 'border-[#262630] hover:border-[#71717A]',
              )}
              {...register('customerId')}
            >
              <option value="">Select destination customer...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} — {customer.city}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 size-4 text-[#71717A]" />
          </div>
          {errors.customerId ? (
            <p className="flex items-center gap-1 text-xs text-[#C95555]">
              <AlertCircle className="size-3.5" />
              {errors.customerId.message}
            </p>
          ) : null}
        </div>

        {/* Product Picker */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#A1A1AA]">
              <Package className="size-3.5 text-[#71717A]" />
              Product Catalog Items
            </label>
            <span className="text-[11px] font-mono text-[#71717A]">
              {products.length} products
            </span>
          </div>

          {isLoadingOptions ? (
            <div className="flex h-44 items-center justify-center rounded-lg border border-[#262630] bg-[#1C1C21]/60">
              <span className="text-xs font-mono text-[#71717A] animate-pulse">Loading catalog options...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-lg border border-[#262630] bg-[#1C1C21] p-4 text-center text-xs text-[#71717A]">
              No products found in catalog.
            </div>
          ) : (
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {products.map((product) => {
                const isSelected = selectedProductIds.has(product.id)
                const line = productLines.find((entry) => entry.productId === product.id)
                const currentQty = line?.quantity ?? 1

                return (
                  <div
                    key={product.id}
                    className={cn(
                      'group rounded-lg border p-3 transition-all',
                      isSelected
                        ? 'border-[#C4622D]/60 bg-[#C4622D]/10'
                        : 'border-[#262630] bg-[#1C1C21]/60 hover:border-[#71717A]',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => toggleProduct(product.id)}
                        disabled={isSubmitting}
                        className="flex min-w-0 flex-1 items-center gap-2.5 text-left focus-visible:outline-hidden"
                      >
                        <span
                          className={cn(
                            'flex size-5 shrink-0 items-center justify-center rounded border transition-colors',
                            isSelected
                              ? 'border-[#C4622D] bg-[#C4622D] text-white'
                              : 'border-[#262630] bg-[#1C1C21] group-hover:border-[#71717A]',
                          )}
                        >
                          {isSelected ? <Check className="size-3 stroke-[3]" /> : null}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-[#F4F4F5]">{product.name}</p>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase text-[#71717A]">
                              {product.category}
                            </span>
                            <span className="font-mono text-[10px] text-[#71717A]">{product.weight} kg/unit</span>
                          </div>
                        </div>
                      </button>

                      {isSelected ? (
                        <div className="flex items-center gap-1 rounded border border-[#262630] bg-[#17171B] p-1">
                          <button
                            type="button"
                            disabled={isSubmitting || currentQty <= 1}
                            onClick={() => updateQuantity(product.id, currentQty - 1)}
                            className="flex size-5 items-center justify-center rounded text-[#A1A1AA] hover:text-white disabled:opacity-30"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-2.5" />
                          </button>
                          <input
                            type="number"
                            min={1}
                            disabled={isSubmitting}
                            value={currentQty}
                            onChange={(e) =>
                              updateQuantity(product.id, Number.parseInt(e.target.value, 10) || 1)
                            }
                            className="w-9 text-center font-mono text-xs font-bold text-[#F4F4F5] bg-transparent focus:outline-hidden"
                            aria-label={`Quantity for ${product.name}`}
                          />
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => updateQuantity(product.id, currentQty + 1)}
                            className="flex size-5 items-center justify-center rounded text-[#A1A1AA] hover:text-white disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-2.5" />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {errors.productLines?.message ? (
            <p className="flex items-center gap-1 text-xs text-[#C95555]">
              <AlertCircle className="size-3.5" />
              {errors.productLines.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2.5 border-t border-[#202027] pt-4">
        <button
          type="submit"
          disabled={isSubmitting || isLoadingOptions}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded border border-[#C4622D] bg-[#C4622D] px-4 py-2.5 font-mono text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#9E4A20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] disabled:opacity-50"
        >
          <Sparkles className="size-3.5" />
          <span>{isSubmitting ? 'Simulating…' : 'Simulate Manifest'}</span>
        </button>
        <button
          type="button"
          disabled={isSubmitting || !isDirty}
          onClick={() => void handleReset()}
          className="inline-flex items-center gap-1.5 rounded border border-[#262630] bg-[#1C1C21] px-3.5 py-2.5 font-mono text-xs font-medium text-[#A1A1AA] transition-colors hover:border-[#71717A] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] disabled:opacity-50"
        >
          <RotateCcw className="size-3" />
          <span>Reset</span>
        </button>
      </div>
    </form>
  )
}
