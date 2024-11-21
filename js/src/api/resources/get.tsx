import { axios } from '@/api'
import { apiUrl, getDataProviderUrlParams, filterObjKeys } from '@/utils'
import { TDataProvider } from '@/types'
import { AxiosRequestConfig } from 'axios'

export const getResource = async ({
	resource,
	dataProvider = 'wp',
	pathParams = [],
	args = {},
	config = undefined,
}: {
	resource: string
	dataProvider?: TDataProvider
	pathParams?: string[]
	args?: {
		[key: string]: any
	}
	config?: AxiosRequestConfig<{ [key: string]: any }> | undefined
}) => {
	const dataProviderUrlParams = getDataProviderUrlParams(dataProvider)
	const filteredArgs = filterObjKeys(args)
	const getResult = await axios.get(
		`${apiUrl}/${dataProviderUrlParams}${resource}/${pathParams.join(
			'/',
		)}?${new URLSearchParams(filteredArgs as URLSearchParams).toString()}`,
		config,
	)

	return getResult
}

export const getResources = async ({
	resource,
	dataProvider = 'wp',
	pathParams = [],
	args = {},
	config = undefined,
}: {
	resource: string
	dataProvider?: TDataProvider
	pathParams?: string[]
	args?: {
		[key: string]: any
	}
	config?: AxiosRequestConfig<{ [key: string]: any }> | undefined
}) => {
	const dataProviderUrlParams = getDataProviderUrlParams(dataProvider)
	const filteredArgs = filterObjKeys(args)
	const getResult = await axios.get(
		`${apiUrl}/${dataProviderUrlParams}${resource}/${pathParams.join(
			'/',
		)}?${new URLSearchParams(filteredArgs as URLSearchParams).toString()}`,
		config,
	)

	return getResult
}
