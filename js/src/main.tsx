import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
	renderId1,
	renderId2,
	renderId3,
	renderId4,
	colorPrimary,
} from './utils'
import { ConfigProvider } from 'antd'

const App1 = lazy(() => import('./App1'))
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
const id2 = document.getElementById(renderId2)
const id3 = document.getElementById(renderId3)
const id4 = document.getElementById(renderId4)

const mapping = [
	{
		el: id1,
		App: App1,
	},
	{
		el: id2,
		App: App2,
	},
	{
		el: id3,
		App: App3,
	},
	{
		el: id4,
		App: App4,
	},
]

document.addEventListener('DOMContentLoaded', () => {
	mapping.forEach(({ el, App }) => {
		if (!!el) {
			ReactDOM.createRoot(el).render(
				<React.StrictMode>
					<QueryClientProvider client={queryClient}>
						<ConfigProvider
							theme={{
								token: {
									colorPrimary,
								},
							}}
						>
							<App />
						</ConfigProvider>
						<ReactQueryDevtools initialIsOpen={false} />
					</QueryClientProvider>
				</React.StrictMode>,
			)
		}
	})
})
