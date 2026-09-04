import { NavLink } from 'react-router-dom'
import { Layers, X } from 'lucide-react'

import { navigationGroups } from '../../routes/navigation'
import { cn } from '../../utils/cn'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-68 flex-col border-r border-slate-200/90 bg-white transition-transform duration-300 ease-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-xs">
              <Layers className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-slate-900">FulfillX</span>
              </div>
              <p className="text-[11px] font-medium tracking-tight text-slate-500">Logistics Operations</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ label, path, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end={path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                        isActive
                          ? 'bg-indigo-50/90 text-indigo-700 shadow-2xs font-semibold'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive ? (
                          <span
                            className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-600"
                            aria-hidden="true"
                          />
                        ) : null}
                        <Icon
                          className={cn(
                            'size-4 shrink-0 transition-colors',
                            isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600',
                          )}
                          aria-hidden="true"
                        />
                        <span className="truncate">{label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3 bg-slate-50/50">
          <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-500">
            <span className="font-medium text-slate-600">FulfillX Core</span>
            <span className="font-mono text-[11px] text-slate-400">v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  )
}
