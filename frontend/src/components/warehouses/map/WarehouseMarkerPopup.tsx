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
    <div className="min-w-[200px] space-y-3 text-xs text-[#A1A1AA]">
      <div>
        <p className="font-display text-sm font-semibold text-[#F4F4F5]">{location.name}</p>
        <p className="font-mono text-[11px] text-[#71717A]">{location.city} Hub</p>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-[#262630] pt-2">
        <div>
          <dt className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">Capacity</dt>
          <dd className="font-mono font-medium text-[#F4F4F5]">{formatCompactNumber(location.capacity)}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">Current load</dt>
          <dd className="font-mono font-medium text-[#F4F4F5]">{formatCompactNumber(location.currentLoad)}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">Utilization</dt>
          <dd className="mt-0.5">
            <span
              className={cn(
                'inline-flex rounded px-1.5 py-0.2 font-mono text-[10px] font-semibold',
                utilizationTone === 'high' && 'border border-[#C95555]/30 bg-[#C95555]/15 text-[#C95555]',
                utilizationTone === 'medium' && 'border border-[#D08A35]/30 bg-[#D08A35]/15 text-[#D08A35]',
                utilizationTone === 'low' && 'border border-[#3FA66B]/30 bg-[#3FA66B]/15 text-[#3FA66B]',
              )}
            >
              {formatUtilization(utilization)}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">Inventory</dt>
          <dd className="font-mono font-medium text-[#F4F4F5]">{formatCompactNumber(location.inventoryCount)}</dd>
        </div>
      </dl>

      <div className="border-t border-[#262630] pt-1.5 flex items-center justify-between text-[11px]">
        <span className="font-mono text-[#71717A]">Status</span>
        <span className="font-mono font-semibold text-[#F4F4F5]">{getStatusLabel(location.active)}</span>
      </div>
    </div>
  )
}
