import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { createCustomerOrder } from '../api/customerOrderApi'
import { executeAllocation } from '../api/allocationApi'
import { useConfirmDialog } from '../components/common/ConfirmDialogProvider'
import { useToast } from '../components/common/ToastProvider'
import { CandidateRankings } from '../components/optimization/CandidateRankings'
import { CommitExecutionCard } from '../components/optimization/CommitExecutionCard'
import { OptimizationForm } from '../components/optimization/OptimizationForm'
import { OptimizationHeader } from '../components/optimization/OptimizationHeader'
import { OptimizationInputContext } from '../components/optimization/OptimizationInputContext'
import {
  NetworkOptimizedState,
  OptimizationErrorAlert,
  OptimizationOptionsError,
  OptimizationRunningState,
  ReadyForOptimizationState,
} from '../components/optimization/OptimizationStates'
import { RecommendationHero } from '../components/optimization/RecommendationHero'
import { ScoreBreakdownCards } from '../components/optimization/ScoreBreakdownCards'
import { StrategyCard } from '../components/optimization/StrategyCard'
import { WarehouseAllocationTable } from '../components/optimization/WarehouseAllocationTable'
import { WhyThisFacility } from '../components/optimization/WhyThisFacility'
import { useCustomers } from '../hooks/useCustomers'
import { useOptimization } from '../hooks/useOptimization'
import { useOrders } from '../hooks/useOrders'
import { useProducts } from '../hooks/useProducts'
import { useWarehouses } from '../hooks/useWarehouses'
import {
  extractRankedCandidates,
  getErrorMessage,
} from '../services/optimizationService'
import type { CustomerOrder } from '../types/order'
import type {
  OptimizationFormValues,
  OptimizationOrderLine,
  OptimizationRunInput,
} from '../types/optimization'

export function OptimizationPage() {
  const { showToast } = useToast()
  const { confirm } = useConfirmDialog()
  const queryClient = useQueryClient()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null)
  const [isSimulatingCustom, setIsSimulatingCustom] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [isExecuted, setIsExecuted] = useState(false)

  // Track the demand context associated with the active optimization result
  const [activeDemandContext, setActiveDemandContext] = useState<{
    orderId?: string
    customerId: string
    productLines: OptimizationOrderLine[]
    customerName?: string
    destinationCity?: string
    isCustomManifest: boolean
  } | null>(null)

  // Fetch pending customer orders queue
  const {
    data: pendingOrdersPage,
    isLoading: isPendingOrdersLoading,
    refetch: refetchPendingOrders,
    isFetching: isPendingOrdersFetching,
  } = useOrders({
    page: 0,
    size: 50,
    status: 'PENDING',
  })

  // Fetch active warehouses
  const {
    data: warehousePage,
    isLoading: isWarehousesLoading,
    refetch: refetchWarehouses,
    isFetching: isWarehousesFetching,
  } = useWarehouses({
    page: 0,
    size: 200,
    sort: { field: 'name', direction: 'asc' },
  })

  // Fetch customer directory
  const {
    data: customersPage,
    isLoading: isCustomersLoading,
    isError: isCustomersError,
    refetch: refetchCustomers,
  } = useCustomers()

  // Fetch product catalog
  const {
    data: productsPage,
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useProducts()

  const optimizationMutation = useOptimization()

  const pendingOrders = useMemo(
    () => pendingOrdersPage?.content ?? [],
    [pendingOrdersPage?.content],
  )
  const customers = useMemo(() => customersPage?.content ?? [], [customersPage?.content])
  const products = useMemo(() => productsPage?.content ?? [], [productsPage?.content])
  const warehouses = useMemo(() => warehousePage?.content ?? [], [warehousePage?.content])

  // Automatically select the first pending order if none is selected yet
  useEffect(() => {
    if (!isSimulatingCustom && pendingOrders.length > 0) {
      const stillExists = pendingOrders.some((o) => o.id === selectedOrder?.id)
      if (!selectedOrder || !stillExists) {
        setSelectedOrder(pendingOrders[0])
      }
    } else if (pendingOrders.length === 0 && !isSimulatingCustom) {
      setSelectedOrder(null)
    }
  }, [pendingOrders, selectedOrder, isSimulatingCustom])

  // Lookup maps for fast lookup
  const customerMap = useMemo(() => {
    return Object.fromEntries(customers.map((c) => [c.id, c]))
  }, [customers])

  const productMap = useMemo(() => {
    return Object.fromEntries(products.map((p) => [p.id, p]))
  }, [products])

  const productNamesById = useMemo(() => {
    return Object.fromEntries(products.map((p) => [p.id, p.name]))
  }, [products])

  const warehouseMap = useMemo(() => {
    return Object.fromEntries(
      warehouses.map((w) => [w.id, { name: w.name, city: w.city, capacity: w.capacity }]),
    )
  }, [warehouses])

  const isLoadingOptions = isCustomersLoading || isProductsLoading || isWarehousesLoading
  const isOptionsError = isCustomersError || isProductsError
  const isRefreshingData = isPendingOrdersFetching || isWarehousesFetching

  const totalPendingUnits = useMemo(() => {
    return pendingOrders.reduce((total, order) => {
      return total + order.orderItems.reduce((sum, item) => sum + item.quantity, 0)
    }, 0)
  }, [pendingOrders])

  const activeWarehousesCount = useMemo(() => {
    return warehouses.filter((w) => w.active).length
  }, [warehouses])

  // Execute optimization run
  const executeOptimizationRun = (input: OptimizationRunInput, isCustom = false) => {
    setErrorMessage(null)
    setIsExecuted(false)

    const customer = customerMap[input.customerId]

    setActiveDemandContext({
      orderId: input.orderId,
      customerId: input.customerId,
      productLines: input.productLines,
      customerName: customer?.name,
      destinationCity: customer?.city,
      isCustomManifest: isCustom,
    })

    optimizationMutation.mutate(input, {
      onSuccess: () => {
        showToast('Optimization solver completed successfully.', { variant: 'success' })
      },
      onError: (error) => {
        const message = getErrorMessage(error)
        setErrorMessage(message)
        showToast(message, { variant: 'error', durationMs: 6000 })
      },
    })
  }

  // Header "Run Optimization" action
  const handleRunOptimization = () => {
    if (isSimulatingCustom) {
      showToast('Use the simulation manifest form to configure custom quantities.', { variant: 'info' })
      return
    }

    if (!selectedOrder) {
      if (pendingOrders.length > 0) {
        setSelectedOrder(pendingOrders[0])
      } else {
        showToast('No pending orders in network queue.', { variant: 'info' })
        return
      }
    }

    const targetOrder = selectedOrder ?? pendingOrders[0]
    if (!targetOrder) return

    const productLines: OptimizationOrderLine[] = targetOrder.orderItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }))

    executeOptimizationRun(
      {
        orderId: targetOrder.id,
        customerId: targetOrder.customerId,
        productLines,
      },
      false,
    )
  }

  // Custom manifest form submission
  const handleCustomSubmit = (values: OptimizationFormValues) => {
    executeOptimizationRun(values, true)
  }

  // Allocation execution
  const handleExecuteAllocation = async () => {
    if (!optimizationMutation.data || !activeDemandContext) {
      return
    }

    const confirmed = await confirm({
      title: 'Commit & execute fulfillment allocation?',
      message:
        'This will reserve inventory, update warehouse load, and create the allocation record in the operational database.',
      confirmLabel: 'Commit & Execute',
      cancelLabel: 'Cancel',
      variant: 'primary',
    })

    if (!confirmed) {
      return
    }

    try {
      setIsExecuting(true)
      setErrorMessage(null)

      let targetOrderId = activeDemandContext.orderId

      // If simulated from custom manifest, create order first
      if (!targetOrderId || activeDemandContext.isCustomManifest) {
        const totalItems = activeDemandContext.productLines.reduce(
          (sum, line) => sum + line.quantity,
          0,
        )
        const order = await createCustomerOrder({
          customerId: activeDemandContext.customerId,
          totalItems,
          orderItems: activeDemandContext.productLines,
        })
        targetOrderId = order.id
      }

      await executeAllocation({
        orderId: targetOrderId,
        optimizationResult: optimizationMutation.data as unknown as Record<string, unknown>,
      })

      setIsExecuted(true)
      showToast('Allocation executed and committed successfully.', { variant: 'success' })

      // Invalidate queries so inventory, load, and order queues refresh across the entire app
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['allocations'] }),
        queryClient.invalidateQueries({ queryKey: ['orders'] }),
        queryClient.invalidateQueries({ queryKey: ['customer-orders'] }),
        queryClient.invalidateQueries({ queryKey: ['inventory'] }),
        queryClient.invalidateQueries({ queryKey: ['warehouses'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ])
    } catch (error) {
      const message = getErrorMessage(error)
      setErrorMessage(message)
      showToast(message, { variant: 'error', durationMs: 6000 })
    } finally {
      setIsExecuting(false)
    }
  }

  const handleRefreshAll = () => {
    void Promise.all([
      refetchPendingOrders(),
      refetchWarehouses(),
      refetchCustomers(),
      refetchProducts(),
    ])
  }

  const result = optimizationMutation.data
  const primaryCandidate = result?.warehouseCandidates[0] ?? null

  const rankedCandidates = useMemo(() => {
    if (!result) return []
    return extractRankedCandidates(result, warehouseMap)
  }, [result, warehouseMap])

  return (
    <div className="relative space-y-8 sm:space-y-10 pb-16">
      {/* Background Depth Glow */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-96 w-full max-w-5xl -translate-x-1/2 rounded-full bg-radial from-[#C4622D]/5 via-transparent to-transparent blur-3xl"
        aria-hidden="true"
      />

      {/* 1. PAGE HEADER */}
      <OptimizationHeader
        isPending={optimizationMutation.isPending}
        isExecuting={isExecuting}
        hasPendingDemand={pendingOrders.length > 0}
        isSimulatingCustom={isSimulatingCustom}
        onRunOptimization={handleRunOptimization}
        onToggleMode={() => setIsSimulatingCustom((prev) => !prev)}
        onRefreshData={handleRefreshAll}
        isRefreshing={isRefreshingData}
      />

      {/* Options Error Banner */}
      {isOptionsError ? (
        <OptimizationOptionsError onRetry={() => void handleRefreshAll()} />
      ) : null}

      {/* Error Alert */}
      {errorMessage ? (
        <OptimizationErrorAlert
          message={errorMessage}
          onRetry={handleRunOptimization}
          onDismiss={() => setErrorMessage(null)}
        />
      ) : null}

      {/* 2. OPTIMIZATION INPUT BAR */}
      <div className="animate-section-2">
        <OptimizationInputContext
          pendingOrdersCount={pendingOrders.length}
          totalUnitsToFulfill={totalPendingUnits}
          candidateWarehousesCount={activeWarehousesCount}
          strategyName="WEIGHTED_GREEDY"
          pendingOrders={pendingOrders}
          selectedOrder={selectedOrder}
          onSelectOrder={(order) => {
            setSelectedOrder(order)
            setIsSimulatingCustom(false)
          }}
          customerMap={customerMap}
          productMap={productMap}
          isLoadingOrders={isPendingOrdersLoading}
        />
      </div>

      {/* 3. MAIN DECISION LAYOUT (Responsive 2-Column Grid) */}
      <div className="grid gap-8 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr] items-start">
        {/* LEFT COLUMN: Input Context, Strategy, Candidates */}
        <aside className="space-y-6 lg:sticky lg:top-20">
          {/* Custom Manifest Simulator Form (When toggled on) */}
          {isSimulatingCustom ? (
            <div className="animate-section-3">
              <OptimizationForm
                customers={customers}
                products={products}
                isLoadingOptions={isLoadingOptions}
                isSubmitting={optimizationMutation.isPending}
                onSubmit={handleCustomSubmit}
              />
            </div>
          ) : null}

          {/* Strategy Card */}
          <div className="animate-section-3">
            <StrategyCard
              strategyName={result?.strategyName ?? 'WEIGHTED_GREEDY'}
              candidateCount={activeWarehousesCount}
              isExecuted={isExecuted}
            />
          </div>

          {/* Candidate Facilities Ranking (When result available) */}
          {result && rankedCandidates.length > 0 ? (
            <div className="animate-section-4">
              <CandidateRankings candidates={rankedCandidates} />
            </div>
          ) : null}
        </aside>

        {/* RIGHT COLUMN: Dominant Decision Centerpiece */}
        <main className="space-y-6 min-w-0">
          {/* A. SOLVER RUNNING STATE */}
          {optimizationMutation.isPending ? (
            <OptimizationRunningState />
          ) : result && primaryCandidate ? (
            /* B. DECISION RESULT CENTERPIECE */
            <div className="space-y-6 animate-section-3">
              {/* Dominant Winning Recommendation */}
              <RecommendationHero
                result={result}
                primaryCandidate={primaryCandidate}
                destinationCity={activeDemandContext?.destinationCity}
                customerName={activeDemandContext?.customerName}
                orderReference={activeDemandContext?.orderId}
                isExecuted={isExecuted}
              />

              {/* Explainability Engine: Why This Facility */}
              <WhyThisFacility
                candidate={primaryCandidate}
                planScoreBreakdown={result.scoreBreakdown}
                reasoning={result.reasoning}
              />

              {/* Algorithmic Score Breakdown Cards */}
              <ScoreBreakdownCards scoreBreakdown={result.scoreBreakdown} />

              {/* Dispatch SKU Allocation Partitioning Table */}
              <WarehouseAllocationTable
                candidates={result.warehouseCandidates}
                productNamesById={productNamesById}
              />

              {/* Decision to Action Bridge: Commit & Execute */}
              <CommitExecutionCard
                isExecuting={isExecuting}
                isExecuted={isExecuted}
                onExecute={() => void handleExecuteAllocation()}
                disabled={result.warehouseCandidates.length === 0}
              />
            </div>
          ) : pendingOrders.length > 0 ? (
            /* C. READY FOR OPTIMIZATION INITIAL STATE */
            <ReadyForOptimizationState
              pendingCount={pendingOrders.length}
              onRunOptimization={handleRunOptimization}
              isSubmitting={optimizationMutation.isPending}
            />
          ) : (
            /* D. NETWORK OPTIMIZED EMPTY STATE */
            <NetworkOptimizedState
              onSimulateCustom={() => setIsSimulatingCustom(true)}
            />
          )}
        </main>
      </div>
    </div>
  )
}
