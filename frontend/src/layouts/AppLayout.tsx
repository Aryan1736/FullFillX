import { Outlet } from 'react-router-dom'

import { Sidebar } from '../components/layout/Sidebar'
import { TopNav } from '../components/layout/TopNav'
import { useDisclosure } from '../hooks/useDisclosure'

export function AppLayout() {
  const sidebar = useDisclosure()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebar.isOpen} onClose={sidebar.close} />

      <div className="flex min-h-screen flex-1 flex-col">
        <TopNav onMenuClick={sidebar.open} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
