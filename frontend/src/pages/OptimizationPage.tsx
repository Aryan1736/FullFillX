import { useMemo, useState } from 'react'

import { PageHeader } from '../components/common/PageHeader'
import { useToast } from '../components/common/ToastProvider'
import { OptimizationForm } from '../components/optimization/OptimizationForm'
import {
  OptimizationErrorAlert,
  OptimizationOptionsError,
  OptimizationResultsPlaceholder,
} from '../components/optimization/OptimizationStates'
import { OptimizationSummary } from '../components/optimization/OptimizationSummary'
import { ReasoningTimeline } from '../components/optimization/ReasoningTimeline'
import { ScoreBreakdownCards } from '../components/optimization/ScoreBreakdownCards'
import { WarehouseAllocationTable } from '../components/optimization/WarehouseAllocationTable'
import { useCustomers } from '../hooks/useCustomers'
import { useOptimization } from '../hooks/useOptimization'
import { useProducts } from '../hooks/useProducts'
import { useWarehouses } from '../hooks/useWarehouses'
import { getErrorMessage } from '../services/optimizationService'
import type { OptimizationFormValues } from '../types/optimization'

export function OptimizationPage() {
  const { showToast } = useToast()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    data: customersPage,
    isLoading: isCustomersLoading,
    isError: isCustomersError,
    refetch: refetchCustomers,
  } = useCustomers()

  const {
    data: productsPage,
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useProducts()

  const { data: warehousePage } = useWarehouses({
    page: 0,
    size: 200,
    sort: { field: 'name', direction: 'asc' },
  })

  const optimizationMutation = useOptimization()

  const customers = customersPage?.content ?? []
  const products = productsPage?.content ?? []
  const isLoadingOptions = isCustomersLoading || isProductsLoading
  const isOptionsError = isCustomersError || isProductsError

  const productNamesById = useMemo(() => {
    const items = productsPage?.content ?? []
    return Object.fromEntries(items.map((product) => [product.id, product.name]))
  }, [productsPage?.content])

  const warehouseNamesById = useMemo(() => {
    const items = warehousePage?.content ?? []
    return Object.fromEntries(items.map((warehouse) => [warehouse.id, warehouse.name]))
  }, [warehousePage?.content])

  const handleSubmit = (values: OptimizationFormValues) => {
    setErrorMessage(null)

    optimizationMutation.mutate(values, {
      onSuccess: () => {
        showToast('Optimization completed successfully.', { variant: 'success' })
      },
      onError: (error) => {
        const message = getErrorMessage(error)
        setErrorMessage(message)
        showToast(message, { variant: 'error', durationMs: 6000 })
      },
    })
  }

  const handleRetryOptions = () => {
    void refetchCustomers()
    void refetchProducts()
  }

  const result = optimizationMutation.data

  return (
    <div className="space-y-6">
      <PageHeader
        title="Optimization"
        description="Simulate order fulfillment and visualize warehouse allocation decisions."
      />

      {isOptionsError ? <OptimizationOptionsError onRetry={handleRetryOptions} /> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(280px,380px)_1fr]">
        <OptimizationForm
          customers={customers}
          products={products}
          isLoadingOptions={isLoadingOptions}
          isSubmitting={optimizationMutation.isPending}
          onSubmit={handleSubmit}
        />

        <div className="space-y-6">
          {errorMessage ? (
            <OptimizationErrorAlert
              message={errorMessage}
              onDismiss={() => setErrorMessage(null)}
            />
          ) : null}

          {optimizationMutation.isPending ? (
            <OptimizationResultsPlaceholder isRunning />
          ) : result ? (
            <>
              <OptimizationSummary result={result} warehouseNamesById={warehouseNamesById} />
              <ScoreBreakdownCards scoreBreakdown={result.scoreBreakdown} />
              <ReasoningTimeline reasoning={result.reasoning} />
              <WarehouseAllocationTable
                candidates={result.warehouseCandidates}
                productNamesById={productNamesById}
              />
            </>
          ) : (
            <OptimizationResultsPlaceholder isRunning={false} />
          )}
        </div>
      </div>
    </div>
  )
}
