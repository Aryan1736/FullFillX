import type { Warehouse } from '../../types/warehouse'
import {
  calculateUtilization,
  formatCompactNumber,
  formatUtilization,
  getStatusLabel,
  getUtilizationTone,
} from '../../services/warehouseService'
import { cn } from '../../utils/cn'

type WarehouseCardProps = {
  warehouse: Warehouse
  onViewDetails: (warehouse: Warehouse) => void
}

function UtilizationBadge({ value }: { value: number }) {
  const tone = getUtilizationTone(value)

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
        tone === 'high' && 'bg-red-100 text-red-700',
        tone === 'medium' && 'bg-amber-100 text-amber-700',
        tone === 'low' && 'bg-emerald-100 text-emerald-700',
      )}
    >
      {formatUtilization(value)}
    </span>
  )
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
        active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600',
      )}
    >
      {getStatusLabel(active)}
    </span>
  )
}

export function WarehouseCard({ warehouse, onViewDetails }: WarehouseCardProps) {
  const utilization = calculateUtilization(warehouse)

  return (
    <button
      type="button"
      onClick={() => onViewDetails(warehouse)}
      className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-900">{warehouse.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{warehouse.city}</p>
        </div>
        <StatusBadge active={warehouse.active} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-500">Capacity</dt>
          <dd className="mt-1 font-medium text-slate-900">
            {formatCompactNumber(warehouse.capacity)}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Current Load</dt>
          <dd className="mt-1 font-medium text-slate-900">
            {formatCompactNumber(warehouse.currentLoad)}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-slate-500">Utilization</dt>
          <dd className="mt-1">
            <UtilizationBadge value={utilization} />
          </dd>
        </div>
      </dl>
    </button>
  )
}
