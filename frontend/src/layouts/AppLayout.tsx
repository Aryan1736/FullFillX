import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { RouteLoadingFallback } from '../components/common/RouteLoadingFallback'
import { PlatformFooter } from '../components/layout/PlatformFooter'
import { TopNav } from '../components/layout/TopNav'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0E0E10] text-[#F4F4F5]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-[#C4622D] focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <TopNav />

      <main
        id="main-content"
        className="flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
      >
        <div className="mx-auto w-full max-w-[1400px]">
          <Suspense fallback={<RouteLoadingFallback />}>
            <Outlet />
          </Suspense>
          <PlatformFooter />
        </div>
      </main>
    </div>
  )
}
