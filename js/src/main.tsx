import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { renderId1, renderId2, renderId3, renderId4 } from './utils'

const App = lazy(() => import('./App'))
const App2 = lazy(() => import('./App2'))
const App3 = lazy(() => import('./App3'))
const App4 = lazy(() => import('./App4'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
})
const id1 = document.getElementById(renderId1)

if (!!id1) {
  ReactDOM.createRoot(id1).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>,
  )
}

const id2 = document.getElementById(renderId2)

if (!!id2) {
  ReactDOM.createRoot(id2).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App2 />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>,
  )
}

const id3 = document.getElementById(renderId3)

if (!!id3) {
  ReactDOM.createRoot(id3).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App3 />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>,
  )
}

const id4 = document.getElementById(renderId4)

if (!!id4) {
  ReactDOM.createRoot(id4).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App4 />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>,
  )
}
