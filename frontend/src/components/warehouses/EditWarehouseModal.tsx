import { AlertCircle, Loader2, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'

import { useToast } from '../common/ToastProvider'
import { useUpdateWarehouse } from '../../hooks/useWarehouses'
import { getErrorMessage } from '../../services/optimizationService'
import type { Warehouse } from '../../types/warehouse'

type EditWarehouseModalProps = {
  warehouse: Warehouse | null
  isOpen: boolean
  onClose: () => void
}

type FormErrors = {
  name?: string
  city?: string
  latitude?: string
  longitude?: string
  capacity?: string
  currentLoad?: string
}

export function EditWarehouseModal({ warehouse, isOpen, onClose }: EditWarehouseModalProps) {
  const { showToast } = useToast()
  const updateMutation = useUpdateWarehouse()

  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [capacity, setCapacity] = useState('')
  const [currentLoad, setCurrentLoad] = useState('')
  const [active, setActive] = useState(true)

  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)

  // Pre-populate form when modal opens or selected warehouse changes
  useEffect(() => {
    if (isOpen && warehouse) {
      setName(warehouse.name)
      setCity(warehouse.city)
      setLatitude(String(warehouse.latitude))
      setLongitude(String(warehouse.longitude))
      setCapacity(String(warehouse.capacity))
      setCurrentLoad(String(warehouse.currentLoad))
      setActive(warehouse.active)
      setErrors({})
      setApiError(null)
    }
  }, [isOpen, warehouse])

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !warehouse) {
    return null
  }

  const validate = (): boolean => {
    const nextErrors: FormErrors = {}

    if (!name.trim()) {
      nextErrors.name = 'Warehouse name is required.'
    } else if (name.trim().length > 255) {
      nextErrors.name = 'Warehouse name must not exceed 255 characters.'
    }

    if (!city.trim()) {
      nextErrors.city = 'City is required.'
    } else if (city.trim().length > 100) {
      nextErrors.city = 'City must not exceed 100 characters.'
    }

    const latNum = Number(latitude)
    if (latitude.trim() === '' || Number.isNaN(latNum)) {
      nextErrors.latitude = 'Valid latitude is required.'
    } else if (latNum < -90 || latNum > 90) {
      nextErrors.latitude = 'Latitude must be between -90.0 and 90.0.'
    }

    const lngNum = Number(longitude)
    if (longitude.trim() === '' || Number.isNaN(lngNum)) {
      nextErrors.longitude = 'Valid longitude is required.'
    } else if (lngNum < -180 || lngNum > 180) {
      nextErrors.longitude = 'Longitude must be between -180.0 and 180.0.'
    }

    const capNum = Number(capacity)
    if (capacity.trim() === '' || Number.isNaN(capNum) || !Number.isInteger(capNum) || capNum < 0) {
      nextErrors.capacity = 'Capacity must be a non-negative integer.'
    }

    const loadNum = Number(currentLoad)
    if (currentLoad.trim() === '' || Number.isNaN(loadNum) || !Number.isInteger(loadNum) || loadNum < 0) {
      nextErrors.currentLoad = 'Current load must be a non-negative integer.'
    } else if (!nextErrors.capacity && loadNum > capNum) {
      nextErrors.currentLoad = 'Current load cannot exceed total capacity.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setApiError(null)

    if (!validate()) {
      return
    }

    updateMutation.mutate(
      {
        id: warehouse.id,
        payload: {
          name: name.trim(),
          city: city.trim(),
          latitude: Number(latitude),
          longitude: Number(longitude),
          capacity: Number(capacity),
          currentLoad: Number(currentLoad),
          active,
        },
      },
      {
        onSuccess: (updated) => {
          showToast(`Warehouse "${updated.name}" updated successfully.`, { variant: 'success' })
          onClose()
        },
        onError: (error) => {
          const message = getErrorMessage(error)
          setApiError(message)
        },
      },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0E0E10]/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-warehouse-title"
        className="relative w-full max-w-lg rounded-xl border border-[#262630] bg-[#17171B] shadow-2xl transition-all"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#202027] bg-[#141417] px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
                FACILITY CONFIGURATION
              </span>
              <span className="text-[#262630]" aria-hidden="true">|</span>
              <span className="font-mono text-[10px] text-[#A1A1AA]">ID: {warehouse.id.slice(0, 8)}</span>
            </div>
            <h2 id="edit-warehouse-title" className="mt-0.5 font-display text-base font-bold text-[#F4F4F5]">
              Edit Fulfillment Hub
            </h2>
            <p className="mt-0.5 text-xs text-[#A1A1AA]">
              Update capacity parameters, spatial coordinates, and routing status.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#71717A] hover:bg-[#202027] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
            aria-label="Close dialog"
          >
            <X className="size-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {apiError ? (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-[#C95555]/30 bg-[#C95555]/10 p-3 text-xs text-[#C95555]"
            >
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          ) : null}

          {/* Name & City */}
          <div>
            <label htmlFor="edit-warehouse-name" className="block font-mono text-xs font-medium text-[#A1A1AA]">
              Facility Name <span className="text-[#C4622D]">*</span>
            </label>
            <input
              id="edit-warehouse-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Bengaluru South Fulfillment Center"
              className="mt-1 w-full rounded-lg border border-[#262630] bg-[#121215] px-3 py-2 text-sm text-[#F4F4F5] outline-none transition placeholder:text-[#71717A] focus:border-[#C4622D] focus:ring-1 focus:ring-[#C4622D]"
              disabled={updateMutation.isPending}
            />
            {errors.name ? <p className="mt-1 text-xs text-[#C95555]">{errors.name}</p> : null}
          </div>

          <div>
            <label htmlFor="edit-warehouse-city" className="block font-mono text-xs font-medium text-[#A1A1AA]">
              City / Region <span className="text-[#C4622D]">*</span>
            </label>
            <input
              id="edit-warehouse-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., Bengaluru"
              className="mt-1 w-full rounded-lg border border-[#262630] bg-[#121215] px-3 py-2 text-sm text-[#F4F4F5] outline-none transition placeholder:text-[#71717A] focus:border-[#C4622D] focus:ring-1 focus:ring-[#C4622D]"
              disabled={updateMutation.isPending}
            />
            {errors.city ? <p className="mt-1 text-xs text-[#C95555]">{errors.city}</p> : null}
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-warehouse-latitude" className="block font-mono text-xs font-medium text-[#A1A1AA]">
                Latitude <span className="text-[#C4622D]">*</span>
              </label>
              <input
                id="edit-warehouse-latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g., 12.9716"
                className="mt-1 w-full rounded-lg border border-[#262630] bg-[#121215] px-3 py-2 font-mono text-sm text-[#F4F4F5] outline-none transition placeholder:text-[#71717A] focus:border-[#C4622D] focus:ring-1 focus:ring-[#C4622D]"
                disabled={updateMutation.isPending}
              />
              {errors.latitude ? <p className="mt-1 text-xs text-[#C95555]">{errors.latitude}</p> : null}
            </div>

            <div>
              <label htmlFor="edit-warehouse-longitude" className="block font-mono text-xs font-medium text-[#A1A1AA]">
                Longitude <span className="text-[#C4622D]">*</span>
              </label>
              <input
                id="edit-warehouse-longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g., 77.5946"
                className="mt-1 w-full rounded-lg border border-[#262630] bg-[#121215] px-3 py-2 font-mono text-sm text-[#F4F4F5] outline-none transition placeholder:text-[#71717A] focus:border-[#C4622D] focus:ring-1 focus:ring-[#C4622D]"
                disabled={updateMutation.isPending}
              />
              {errors.longitude ? <p className="mt-1 text-xs text-[#C95555]">{errors.longitude}</p> : null}
            </div>
          </div>

          {/* Capacity & Load */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-warehouse-capacity" className="block font-mono text-xs font-medium text-[#A1A1AA]">
                Storage Capacity (units) <span className="text-[#C4622D]">*</span>
              </label>
              <input
                id="edit-warehouse-capacity"
                type="number"
                min="0"
                step="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g., 15000"
                className="mt-1 w-full rounded-lg border border-[#262630] bg-[#121215] px-3 py-2 font-mono text-sm text-[#F4F4F5] outline-none transition placeholder:text-[#71717A] focus:border-[#C4622D] focus:ring-1 focus:ring-[#C4622D]"
                disabled={updateMutation.isPending}
              />
              {errors.capacity ? <p className="mt-1 text-xs text-[#C95555]">{errors.capacity}</p> : null}
            </div>

            <div>
              <label htmlFor="edit-warehouse-load" className="block font-mono text-xs font-medium text-[#A1A1AA]">
                Current Load (units) <span className="text-[#C4622D]">*</span>
              </label>
              <input
                id="edit-warehouse-load"
                type="number"
                min="0"
                step="1"
                value={currentLoad}
                onChange={(e) => setCurrentLoad(e.target.value)}
                placeholder="0"
                className="mt-1 w-full rounded-lg border border-[#262630] bg-[#121215] px-3 py-2 font-mono text-sm text-[#F4F4F5] outline-none transition placeholder:text-[#71717A] focus:border-[#C4622D] focus:ring-1 focus:ring-[#C4622D]"
                disabled={updateMutation.isPending}
              />
              {errors.currentLoad ? <p className="mt-1 text-xs text-[#C95555]">{errors.currentLoad}</p> : null}
            </div>
          </div>

          {/* Active status */}
          <div className="pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="size-4 rounded border-[#262630] bg-[#121215] text-[#C4622D] focus:ring-[#C4622D] accent-[#C4622D]"
                disabled={updateMutation.isPending}
              />
              <span className="text-xs font-medium text-[#F4F4F5]">
                Active for order routing and allocation
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#202027]">
            <button
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="rounded border border-[#262630] bg-[#1C1C21] px-4 py-2 font-mono text-xs font-semibold text-[#A1A1AA] transition-colors hover:border-[#71717A] hover:text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="inline-flex items-center gap-2 rounded border border-[#C4622D] bg-[#C4622D] px-4 py-2 font-mono text-xs font-semibold text-white transition-colors hover:bg-[#9E4A20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
