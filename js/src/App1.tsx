/* eslint-disable quote-props */
import { Refine } from '@refinedev/core'
import { ThemedLayoutV2, ThemedSiderV2, ErrorComponent } from '@refinedev/antd'
import '@refinedev/antd/dist/reset.css'
import routerBindings, {
	UnsavedChangesNotifier,
	NavigateToResource,
} from '@refinedev/react-router-v6'

import {
	OrdersList,
	OrdersEdit,
	UsersList,
	UsersEdit,
	Analytics,
	MediaLibraryPage,
	ProductList,
	ProductEdit,
	ProductTaxonomies,
	Summary,
} from '@/pages/admin'
import { HashRouter, Outlet, Route, Routes } from 'react-router-dom'
import { resources } from '@/resources'
import { ConfigProvider } from 'antd'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEnv } from '@/hooks'
import axios from 'axios'
import { BackToWpAdmin } from 'antd-toolkit/wp'
import {
	dataProvider,
	notificationProvider,
	useBunny,
	MediaLibraryIndicator,
} from 'antd-toolkit/refine'

function App() {
	const { bunny_data_provider_result } = useBunny()
	const { KEBAB, API_URL, AXIOS_INSTANCE = axios.create() } = useEnv()

	return (
		<HashRouter>
			<Refine
				dataProvider={{
					default: dataProvider(`${API_URL}/v2/powerhouse`, AXIOS_INSTANCE),
					'wp-rest': dataProvider(`${API_URL}/wp/v2`, AXIOS_INSTANCE),
					'wc-rest': dataProvider(`${API_URL}/wc/v3`, AXIOS_INSTANCE),
					'wc-store': dataProvider(`${API_URL}/wc/store/v1`, AXIOS_INSTANCE),
					'bunny-stream': bunny_data_provider_result,
					'power-shop': dataProvider(`${API_URL}/${KEBAB}`, AXIOS_INSTANCE),
				}}
				notificationProvider={notificationProvider}
				routerProvider={routerBindings}
				resources={resources}
				options={{
					syncWithLocation: true,
					warnWhenUnsavedChanges: true,
					projectId: 'power-shop',
					reactQuery: {
						clientConfig: {
							defaultOptions: {
								queries: {
									staleTime: 1000 * 60 * 10,
									cacheTime: 1000 * 60 * 10,
									retry: 0,
								},
							},
						},
					},
				}}
			>
				<Routes>
					<Route
						element={
							<ConfigProvider
								theme={{
									components: {
										Collapse: {
											contentPadding: '8px 8px',
										},
									},
								}}
							>
								<ThemedLayoutV2
									Sider={(props) => <ThemedSiderV2 {...props} fixed />}
									Title={({ collapsed }) => (
										<BackToWpAdmin collapsed={collapsed} />
									)}
								>
									<div className="pb-32">
										<Outlet />
									</div>
									<MediaLibraryIndicator />
								</ThemedLayoutV2>
							</ConfigProvider>
						}
					>
						<Route
							index
							element={<NavigateToResource resource="dashboard" />}
						/>
						<Route path="dashboard">
							<Route index element={<Summary />} />
						</Route>
						<Route path="orders">
							<Route index element={<OrdersList />} />
							<Route path="edit/:id" element={<OrdersEdit />} />
						</Route>
						<Route path="users">
							<Route index element={<UsersList />} />
							<Route path="edit/:id" element={<UsersEdit />} />
						</Route>
						<Route path="products">
							<Route index element={<ProductList />} />
							<Route path="edit/:id" element={<ProductEdit />} />
							<Route path="taxonomies" element={<ProductTaxonomies />} />
						</Route>

						<Route path="analytics" element={<Analytics />} />

						<Route path="media-library" element={<MediaLibraryPage />} />

						<Route path="*" element={<ErrorComponent />} />
					</Route>
				</Routes>
				<UnsavedChangesNotifier />
				<ReactQueryDevtools initialIsOpen={false} />
			</Refine>
		</HashRouter>
	)
}

export default App
