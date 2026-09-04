import { Link } from 'react-router-dom'

import { paths } from '../../routes/paths'

export function PlatformFooter() {
  return (
    <footer className="mt-16 border-t border-[#262630] pt-8 text-[#71717A]">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-semibold tracking-tight text-[#F4F4F5]">
              FulfillX
            </span>
            <span className="text-[#262630]" aria-hidden="true">|</span>
            <span className="text-xs text-[#71717A]">
              Intelligent warehouse allocation &amp; fulfillment optimization
            </span>
          </div>
          <p className="mt-1 font-mono text-[11px] text-[#71717A]">
            v1.0 · Operations Platform
          </p>
        </div>

        <nav
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs"
          aria-label="Platform Footer Navigation"
        >
          <Link
            to={paths.dashboard}
            className="transition-colors hover:text-[#C4622D] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
          >
            Dashboard
          </Link>
          <Link
            to={paths.orders}
            className="transition-colors hover:text-[#C4622D] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
          >
            Orders
          </Link>
          <Link
            to={paths.warehouses}
            className="transition-colors hover:text-[#C4622D] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
          >
            Warehouses
          </Link>
          <Link
            to={paths.inventory}
            className="transition-colors hover:text-[#C4622D] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
          >
            Inventory
          </Link>
          <Link
            to={paths.optimization}
            className="transition-colors hover:text-[#C4622D] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
          >
            Optimization
          </Link>
          <Link
            to={paths.allocations}
            className="transition-colors hover:text-[#C4622D] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
          >
            Allocations
          </Link>
          <Link
            to={paths.analytics}
            className="transition-colors hover:text-[#C4622D] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4622D]"
          >
            Analytics
          </Link>
        </nav>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[#202027] pt-4 text-[11px] text-[#71717A]">
        <span>&copy; 2026 FulfillX. All rights reserved.</span>
        <span className="font-mono">STATUS: OPTIMAL</span>
      </div>
    </footer>
  )
}
