import { axiosInstance as axios } from 'antd-toolkit/refine'
import { AxiosRequestConfig } from 'axios'

import { TDataProvider } from '@/types'
import { API_URL, getDataProviderUrlParams } from '@/utils'

export const getResource = async ({
	resource,
	dataProvider = 'wp-rest',
	pathParams = [],
	args = {},
	config = undefined,
}: {
	resource: string
	dataProvider?: TDataProvider
	pathParams?: string[]
	args?: Record<string, string>
	config?: AxiosRequestConfig<{ [key: string]: any }> | undefined
}) => {
	const dataProviderUrlParams = getDataProviderUrlParams(dataProvider)
	const getResult = await axios.get(
		`${API_URL}/${dataProviderUrlParams}/${resource}/${pathParams.join(
			'/'
		)}?${new URLSearchParams(args).toString()}`,
		config
	)

	return getResult
}

export const getResources = async ({
	resource,
	dataProvider = 'wp-rest',
	pathParams = [],
	args = {},
	config = undefined,
}: {
	resource: string
	dataProvider?: TDataProvider
	pathParams?: string[]
	args?: Record<string, string>
	config?: AxiosRequestConfig<{ [key: string]: any }> | undefined
}) => {
	const dataProviderUrlParams = getDataProviderUrlParams(dataProvider)
	const getResult = await axios.get(
		`${API_URL}/${dataProviderUrlParams}/${resource}/${pathParams.join(
			'/'
		)}?${new URLSearchParams(args).toString()}`,
		config
	)

	return getResult
}
