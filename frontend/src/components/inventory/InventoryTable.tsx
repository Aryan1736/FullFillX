import { formatQuantity } from '../../services/inventoryService'
import type { InventoryItem, InventorySort, InventorySortField } from '../../types/inventory'
import { cn } from '../../utils/cn'
import { SortableHeader } from '../common/SortableHeader'
import { LowStockBadge } from './LowStockBadge'

type InventoryTableProps = {
  items: InventoryItem[]
  sort: InventorySort
  onSortChange: (field: InventorySortField) => void
}

export function InventoryTable({ items, sort, onSortChange }: InventoryTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <SortableHeader
                label="Product"
                field="productName"
                sort={sort}
                onSortChange={onSortChange}
                className="px-4 py-3 text-left text-xs uppercase tracking-wide"
              />
              <SortableHeader
                label="SKU"
                field="sku"
                sort={sort}
                onSortChange={onSortChange}
                className="px-4 py-3 text-left text-xs uppercase tracking-wide"
              />
              <SortableHeader
                label="Warehouse"
                field="warehouseName"
                sort={sort}
                onSortChange={onSortChange}
                className="px-4 py-3 text-left text-xs uppercase tracking-wide"
              />
              <SortableHeader
                label="Available Quantity"
                field="availableQuantity"
                sort={sort}
                onSortChange={onSortChange}
                className="px-4 py-3 text-left text-xs uppercase tracking-wide"
              />
              <SortableHeader
                label="Reserved Quantity"
                field="reservedQuantity"
                sort={sort}
                onSortChange={onSortChange}
                className="px-4 py-3 text-left text-xs uppercase tracking-wide"
              />
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600"
              >
                Low Stock Indicator
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr
                key={item.id}
                className={cn(
                  'transition-colors',
                  item.lowStock ? 'bg-amber-50/70 hover:bg-amber-50' : 'hover:bg-slate-50',
                )}
              >
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{item.productName}</td>
                <td className="px-4 py-3 font-mono text-sm text-slate-600">{item.sku}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{item.warehouseName}</td>
                <td className="px-4 py-3 text-sm text-slate-900">{formatQuantity(item.availableQuantity)}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{formatQuantity(item.reservedQuantity)}</td>
                <td className="px-4 py-3 text-sm">
                  <LowStockBadge lowStock={item.lowStock} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
