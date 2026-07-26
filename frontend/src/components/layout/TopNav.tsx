import { Bell, Menu, Search } from 'lucide-react'

type TopNavProps = {
  onMenuClick: () => void
}

export function TopNav({ onMenuClick }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
          aria-expanded="false"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden min-w-0 flex-1 sm:block sm:max-w-md lg:max-w-lg">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search orders, warehouses, inventory…"
            aria-label="Search"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div
          className="hidden h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white sm:flex"
          aria-hidden="true"
        >
          FX
        </div>
      </div>
    </header>
  )
}
