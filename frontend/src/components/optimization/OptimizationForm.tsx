import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2, RotateCcw, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useConfirmDialog } from '../common/ConfirmDialogProvider'
import { Button } from '../common/Button'
import { useToast } from '../common/ToastProvider'
import type { Customer } from '../../types/customer'
import type { Product } from '../../types/product'
import { cn } from '../../utils/cn'

const productLineSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
})

const optimizationFormSchema = z.object({
  customerId: z.string().min(1, 'Select a customer'),
  productLines: z.array(productLineSchema).min(1, 'Select at least one product'),
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
    setValue(
      'productLines',
      productLines.map((line) =>
        line.productId === productId ? { ...line, quantity: Math.max(1, quantity) } : line,
      ),
      { shouldValidate: true },
    )
  }

  const handleReset = async () => {
    if (!isDirty) {
      return
    }

    const confirmed = await confirm({
      title: 'Reset simulation?',
      message: 'This will clear the selected customer and products. Your current input will be lost.',
      confirmLabel: 'Reset',
      cancelLabel: 'Keep editing',
      variant: 'danger',
    })

    if (confirmed) {
      reset({ customerId: '', productLines: [] })
      showToast('Simulation form reset.', { variant: 'info' })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md lg:p-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Simulation Input</h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose a customer destination and products to simulate fulfillment allocation.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="customerId" className="block text-sm font-medium text-slate-700">
          Customer
        </label>
        <select
          id="customerId"
          disabled={isLoadingOptions || isSubmitting}
          className={cn(
            'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-50',
            errors.customerId ? 'border-red-300' : 'border-slate-300',
          )}
          {...register('customerId')}
        >
          <option value="">Select a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} ({customer.city})
            </option>
          ))}
        </select>
        {errors.customerId ? (
          <p className="text-sm text-red-600">{errors.customerId.message}</p>
        ) : null}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-slate-700">Products</p>
          <p className="text-xs text-slate-500">Select products and specify quantities for each.</p>
        </div>

        {isLoadingOptions ? (
          <p className="text-sm text-slate-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-slate-500">No products available.</p>
        ) : (
          <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
            {products.map((product) => {
              const isSelected = selectedProductIds.has(product.id)
              const line = productLines.find((entry) => entry.productId === product.id)

              return (
                <div
                  key={product.id}
                  className={cn(
                    'rounded-lg border px-3 py-3 transition-colors',
                    isSelected ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200 bg-white',
                  )}
                >
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isSubmitting}
                      onChange={() => toggleProduct(product.id)}
                      className="mt-1 size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-slate-900">{product.name}</span>
                      <span className="block text-xs text-slate-500">{product.category}</span>
                    </span>
                  </label>

                  {isSelected ? (
                    <div className="mt-3 pl-7">
                      <label
                        htmlFor={`quantity-${product.id}`}
                        className="mb-1 block text-xs font-medium text-slate-600"
                      >
                        Quantity
                      </label>
                      <input
                        id={`quantity-${product.id}`}
                        type="number"
                        min={1}
                        disabled={isSubmitting}
                        value={line?.quantity ?? 1}
                        onChange={(event) =>
                          updateQuantity(product.id, Number.parseInt(event.target.value, 10) || 1)
                        }
                        className="w-28 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}

        {errors.productLines?.message ? (
          <p className="text-sm text-red-600">{errors.productLines.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="submit"
          disabled={isSubmitting || isLoadingOptions}
          className="w-full sm:flex-1"
          leftIcon={
            isSubmitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="size-4" aria-hidden="true" />
            )
          }
        >
          {isSubmitting ? 'Running Optimization…' : 'Run Optimization'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={isSubmitting || !isDirty}
          onClick={() => void handleReset()}
          className="w-full sm:w-auto"
          leftIcon={<RotateCcw className="size-4" aria-hidden="true" />}
        >
          Reset
        </Button>
      </div>
    </form>
  )
}

export function OptimizationFormError({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>{message}</p>
      </div>
    </div>
  )
}
