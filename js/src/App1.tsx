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
	WPMediaLibraryPage,
	MediaLibraryPage,
	ProductList,
	ProductEdit,
	ProductTaxonomies,
	ProductAttributes,
	Summary,
} from '@/pages/admin'

import { HashRouter, Outlet, Route, Routes } from 'react-router-dom'
import { resources } from '@/resources'
import { ConfigProvider } from 'antd'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEnv } from '@/hooks'
import axios, { AxiosInstance } from 'axios'
import { BackToWpAdmin, MediaLibraryNotification } from 'antd-toolkit/wp'
import {
	dataProvider,
	notificationProvider,
	useBunny,
} from 'antd-toolkit/refine'

function App() {
	const { bunny_data_provider_result } = useBunny()
	const { KEBAB, API_URL, AXIOS_INSTANCE = axios.create(), NONCE } = useEnv()

	const axiosInstance: AxiosInstance = axios.create({
		timeout: 30000,
		headers: {
			'X-WP-Nonce': NONCE,
			'Content-Type': 'application/json',
		},
	})

	// 添加 response 攔截器
	axiosInstance.interceptors.response.use(
		(response) => response,
		(error) => {
			// 錯誤響應的處理
			if (error.response) {
				// 伺服器有響應但狀態碼表示錯誤
				switch (error.response.status) {
					case 403:
						console.error('沒有權限訪問此資源')
						window.location.reload()
						break
					default:
						console.error('請求失敗:', error.response.data.message)
				}
			} else if (error.request) {
				// 請求已發送但沒有收到響應
				console.error('沒有收到伺服器響應')
			} else {
				// 設定請求時發生錯誤
				console.error('請求配置錯誤:', error.message)
			}

			// 返回錯誤
			return Promise.reject(error)
		},
	)

	return (
		<HashRouter>
			<Refine
				dataProvider={{
					default: dataProvider(`${API_URL}/v2/powerhouse`, axiosInstance),
					'wp-rest': dataProvider(`${API_URL}/wp/v2`, axiosInstance),
					'wc-rest': dataProvider(`${API_URL}/wc/v3`, axiosInstance),
					'wc-store': dataProvider(`${API_URL}/wc/store/v1`, axiosInstance),
					'bunny-stream': bunny_data_provider_result,
					'power-shop': dataProvider(`${API_URL}/${KEBAB}`, axiosInstance),
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
									<MediaLibraryNotification />
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
							<Route path="attributes" element={<ProductAttributes />} />
						</Route>

						<Route path="analytics" element={<Analytics />} />

						{/* <Route path="media-library" element={<MediaLibraryPage />} /> */}
						<Route path="wp-media-library" element={<WPMediaLibraryPage />} />

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
