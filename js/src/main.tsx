import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { APP1_SELECTOR, env } from '@/utils'
import { StyleProvider } from '@ant-design/cssinjs'
import { EnvProvider } from 'antd-toolkit'
import { BunnyProvider } from 'antd-toolkit/refine'

const App1 = React.lazy(() => import('./App1'))

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 0,
		},
	},
})

const app1Nodes = document.querySelectorAll(APP1_SELECTOR)

const mapping = [
	{
		els: app1Nodes,
		App: App1,
	},
]

const { BUNNY_LIBRARY_ID, BUNNY_CDN_HOSTNAME, BUNNY_STREAM_API_KEY } = env

document.addEventListener('DOMContentLoaded', () => {
	mapping.forEach(({ els, App }) => {
		if (!!els) {
			els.forEach((el) => {
				ReactDOM.createRoot(el).render(
					<React.StrictMode>
						<QueryClientProvider client={queryClient}>
							<StyleProvider hashPriority="low">
								<EnvProvider env={env}>
									<BunnyProvider
										bunny_library_id={BUNNY_LIBRARY_ID}
										bunny_cdn_hostname={BUNNY_CDN_HOSTNAME}
										bunny_stream_api_key={BUNNY_STREAM_API_KEY}
									>
										<App />
									</BunnyProvider>
								</EnvProvider>
							</StyleProvider>
						</QueryClientProvider>
					</React.StrictMode>,
				)
			})
		}
	})
})
