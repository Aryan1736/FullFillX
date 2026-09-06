import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

import { paths } from '../../routes/paths'
import { cn } from '../../utils/cn'

const NAV_ITEMS = [
  { label: 'Dashboard', path: paths.dashboard },
  { label: 'Orders', path: paths.orders },
  { label: 'Warehouses', path: paths.warehouses },
  { label: 'Inventory', path: paths.inventory },
  { label: 'Optimization', path: paths.optimization },
  { label: 'Allocations', path: paths.allocations },
  { label: 'Analytics', path: paths.analytics },
]

export function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-[#262630] bg-[#0E0E10]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <Link
            to={paths.dashboard}
            className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] rounded"
          >
            <img
              src="/img.png"
              alt="FulfillX"
              width={36}
              height={36}
              className="h-9 w-9 object-contain shrink-0"
            />
            <div className="flex items-baseline gap-2">
              <span className="font-display text-base font-bold tracking-tight text-[#F4F4F5]">
                FulfillX
              </span>
              <span className="hidden font-mono text-[10px] uppercase tracking-widest text-[#71717A] md:inline">
                Ops
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Primary Navigation (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Primary Navigation"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'relative px-3 py-1.5 text-xs font-medium transition-colors duration-150 rounded',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D]',
                  isActive
                    ? 'text-[#F4F4F5] font-semibold'
                    : 'text-[#A1A1AA] hover:text-[#F4F4F5]',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {isActive ? (
                    <span
                      className="absolute bottom-[-13px] left-3 right-3 h-[2px] bg-[#C4622D] rounded-full"
                      aria-hidden="true"
                    />
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right: Telemetry & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded border border-[#262630] bg-[#17171B] px-2.5 py-1 text-[11px] text-[#A1A1AA]">
            <span className="size-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
            <span className="font-mono text-[10px] font-medium tracking-wide text-[#71717A]">
              REGION: IN-WEST
            </span>
            <span className="text-[#262630]" aria-hidden="true">|</span>
            <span className="text-[#F4F4F5] font-medium">Telemetry Connected</span>
          </div>

          <button
            type="button"
            className="flex size-8 items-center justify-center rounded border border-[#262630] bg-[#17171B] text-[#A1A1AA] hover:text-[#F4F4F5] hover:border-[#71717A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation */}
      {mobileMenuOpen ? (
        <div className="border-b border-[#262630] bg-[#17171B] px-4 py-3 md:hidden">
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between rounded px-3 py-2 text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-[#1C1C21] text-[#F4F4F5] font-semibold border-l-2 border-[#C4622D]'
                      : 'text-[#A1A1AA] hover:bg-[#1C1C21] hover:text-[#F4F4F5]',
                  )
                }
              >
                <span>{item.label}</span>
                {item.path === paths.dashboard ? (
                  <span className="font-mono text-[10px] text-[#71717A]">Root</span>
                ) : null}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
