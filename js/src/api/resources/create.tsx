import { axiosInstance as axios } from 'antd-toolkit/refine'
import { AxiosRequestConfig } from 'axios'

import { TDataProvider } from '@/types'
import { API_URL, getDataProviderUrlParams } from '@/utils'

export const createResource = async ({
	resource,
	dataProvider = 'wp-rest',
	args,
	config,
}: {
	resource: string
	dataProvider?: TDataProvider
	args?: {
		[key: string]: any
	}
	config?: AxiosRequestConfig<{ [key: string]: any }> | undefined
}) => {
	const dataProviderUrlParams = getDataProviderUrlParams(dataProvider)
	const createResult = await axios.post(
		`${API_URL}/${dataProviderUrlParams}/${resource}`,
		args,
		config
	)

	return createResult
}
