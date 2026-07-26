import { Bell, Menu, Search } from 'lucide-react'

type TopNavProps = {
  onMenuClick: () => void
}

export function TopNav({ onMenuClick }: TopNavProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search orders, warehouses, inventory..."
            className="w-72 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 outline-none ring-indigo-500 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white sm:flex">
          FX
        </div>
      </div>
    </header>
  )
}
