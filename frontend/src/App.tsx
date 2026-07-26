import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, ScrollRestoration } from 'react-router-dom'

import { ConfirmDialogProvider } from './components/common/ConfirmDialogProvider'
import { ToastProvider } from './components/common/ToastProvider'
import { AppRoutes } from './routes/AppRoutes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <ConfirmDialogProvider>
            <ScrollRestoration getKey={(location) => location.pathname} />
            <AppRoutes />
          </ConfirmDialogProvider>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
