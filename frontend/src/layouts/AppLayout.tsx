import { Outlet } from 'react-router-dom'

import { Sidebar } from '../components/layout/Sidebar'
import { TopNav } from '../components/layout/TopNav'
import { useDisclosure } from '../hooks/useDisclosure'

export function AppLayout() {
  const sidebar = useDisclosure()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>
      <Sidebar isOpen={sidebar.isOpen} onClose={sidebar.close} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopNav onMenuClick={sidebar.open} />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
        >
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
