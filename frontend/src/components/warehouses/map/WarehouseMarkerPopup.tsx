import {
  calculateUtilization,
  formatCompactNumber,
  formatUtilization,
  getStatusLabel,
  getUtilizationTone,
} from '../../../services/warehouseService'
import type { WarehouseMapLocation } from '../../../types/warehouseMap'
import { cn } from '../../../utils/cn'

type WarehouseMarkerPopupProps = {
  location: WarehouseMapLocation
}

export function WarehouseMarkerPopup({ location }: WarehouseMarkerPopupProps) {
  const utilization = calculateUtilization(location)
  const utilizationTone = getUtilizationTone(utilization)

  return (
    <div className="min-w-[200px] space-y-3 text-sm text-slate-700">
      <div>
        <p className="font-semibold text-slate-900">{location.name}</p>
        <p className="text-xs text-slate-500">{location.city}</p>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <dt className="text-xs text-slate-500">Capacity</dt>
          <dd className="font-medium text-slate-900">{formatCompactNumber(location.capacity)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Current load</dt>
          <dd className="font-medium text-slate-900">{formatCompactNumber(location.currentLoad)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Utilization</dt>
          <dd>
            <span
              className={cn(
                'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                utilizationTone === 'high' && 'bg-red-100 text-red-700',
                utilizationTone === 'medium' && 'bg-amber-100 text-amber-700',
                utilizationTone === 'low' && 'bg-emerald-100 text-emerald-700',
              )}
            >
              {formatUtilization(utilization)}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Inventory count</dt>
          <dd className="font-medium text-slate-900">{formatCompactNumber(location.inventoryCount)}</dd>
        </div>
      </dl>

      <p className="text-xs text-slate-500">{getStatusLabel(location.active)}</p>
    </div>
  )
}
