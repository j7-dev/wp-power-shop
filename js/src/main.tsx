import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import App2 from './App2'
import App3 from './App3'
import App4 from './App4'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { renderId1, renderId2, renderId3, renderId4 } from './utils'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
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
