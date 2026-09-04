import { useRef } from 'react'
import { X } from 'lucide-react'

import { useDrawerA11y } from '../../hooks/useDrawerA11y'
import { formatQuantity, getStockRatio, getStockStatus } from '../../services/inventoryService'
import type { InventoryItem } from '../../types/inventory'
import { LOW_STOCK_THRESHOLD } from '../../types/inventory'
import { LowStockBadge } from './LowStockBadge'

type InventoryDetailsDrawerProps = {
  item: InventoryItem | null
  isOpen: boolean
  onClose: () => void
}

function formatTimestamp(isoString?: string): string {
  if (!isoString) return '—'
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return isoString
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  } catch {
    return isoString
  }
}

export function InventoryDetailsDrawer({
  item,
  isOpen,
  onClose,
}: InventoryDetailsDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null)
  useDrawerA11y({ isOpen, onClose, containerRef: drawerRef })

  if (!isOpen || !item) {
    return null
  }

  const status = getStockStatus(item)
  const totalStock = item.availableQuantity + item.reservedQuantity
  const ratio = getStockRatio(item)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close inventory details"
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inventory-drawer-title"
        className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[#262630] bg-[#17171B] text-[#F4F4F5] shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-start justify-between border-b border-[#202027] p-6">
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
              SKU METADATA & TELEMETRY
            </span>
            <h2 id="inventory-drawer-title" className="font-display text-xl font-bold tracking-tight text-[#F4F4F5]">
              {item.productName}
            </h2>
            <p className="font-mono text-xs text-[#A1A1AA]">
              SKU: <span className="text-[#F4F4F5]">{item.sku}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="rounded border border-[#262630] bg-[#1C1C21] p-1.5 text-[#A1A1AA] transition-colors hover:border-[#71717A] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
          >
            <X className="size-4" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status & Available Units Summary */}
          <div className="rounded-lg border border-[#262630] bg-[#1C1C21] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                Fulfillment Status
              </span>
              <LowStockBadge status={status} />
            </div>

            <div className="pt-2 border-t border-[#202027] grid grid-cols-2 gap-4">
              <div>
                <span className="font-mono text-[10px] font-medium uppercase text-[#71717A]">
                  Available Stock
                </span>
                <p className="mt-1 font-mono text-2xl font-bold text-[#F4F4F5]">
                  {formatQuantity(item.availableQuantity)}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] font-medium uppercase text-[#71717A]">
                  Reserved Stock
                </span>
                <p className="mt-1 font-mono text-2xl font-bold text-[#A1A1AA]">
                  {formatQuantity(item.reservedQuantity)}
                </p>
              </div>
            </div>

            {/* Capacity ratio bar */}
            <div className="pt-2 border-t border-[#202027] space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#71717A]">Available Ratio</span>
                <span className="text-[#F4F4F5]">{ratio.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#202027]">
                <div
                  className={`h-full transition-all duration-300 ${
                    status === 'OUT_OF_STOCK'
                      ? 'bg-[#C95555]'
                      : status === 'LOW_STOCK'
                      ? 'bg-[#D08A35]'
                      : 'bg-[#3FA66B]'
                  }`}
                  style={{ width: `${ratio}%` }}
                />
              </div>
            </div>
          </div>

          {/* Detailed Metadata Grid */}
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
              Location & Stock Parameters
            </h3>

            <div className="divide-y divide-[#202027] rounded-lg border border-[#262630] bg-[#1C1C21] text-xs">
              <div className="flex items-center justify-between p-3">
                <span className="text-[#71717A]">Warehouse Facility</span>
                <span className="font-medium text-[#F4F4F5]">{item.warehouseName}</span>
              </div>

              <div className="flex items-center justify-between p-3">
                <span className="text-[#71717A]">Total Aggregated Units</span>
                <span className="font-mono font-medium text-[#F4F4F5]">{formatQuantity(totalStock)}</span>
              </div>

              <div className="flex items-center justify-between p-3">
                <span className="text-[#71717A]">Depletion Threshold</span>
                <span className="font-mono text-[#A1A1AA]">&lt; {LOW_STOCK_THRESHOLD} units</span>
              </div>

              <div className="flex items-center justify-between p-3">
                <span className="text-[#71717A]">Inventory Record ID</span>
                <span className="font-mono text-[11px] text-[#A1A1AA]">{item.id}</span>
              </div>

              <div className="flex items-center justify-between p-3">
                <span className="text-[#71717A]">Product ID</span>
                <span className="font-mono text-[11px] text-[#A1A1AA]">{item.productId}</span>
              </div>

              <div className="flex items-center justify-between p-3">
                <span className="text-[#71717A]">Warehouse ID</span>
                <span className="font-mono text-[11px] text-[#A1A1AA]">{item.warehouseId}</span>
              </div>

              <div className="flex items-center justify-between p-3">
                <span className="text-[#71717A]">Created At</span>
                <span className="font-mono text-[#A1A1AA]">{formatTimestamp(item.createdAt)}</span>
              </div>

              <div className="flex items-center justify-between p-3">
                <span className="text-[#71717A]">Last Updated</span>
                <span className="font-mono text-[#A1A1AA]">{formatTimestamp(item.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#202027] p-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[#262630] bg-[#1C1C21] px-4 py-2 text-xs font-semibold text-[#F4F4F5] transition-colors hover:border-[#71717A] hover:bg-[#262630] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]"
          >
            Close Details
          </button>
        </footer>
      </aside>
    </div>
  )
}
