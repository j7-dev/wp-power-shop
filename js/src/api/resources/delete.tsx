import { axiosInstance as axios } from 'antd-toolkit/refine'
import { AxiosRequestConfig } from 'axios'

import { TDataProvider } from '@/types'
import { API_URL, getDataProviderUrlParams } from '@/utils'

export const deleteResource = async ({
	resource,
	dataProvider = 'wp-rest',
	pathParams = [],
	config = undefined,
}: {
	resource: string
	dataProvider?: TDataProvider
	pathParams?: string[]
	config?: AxiosRequestConfig<{ [key: string]: any }> | undefined
}) => {
	const dataProviderUrlParams = getDataProviderUrlParams(dataProvider)
	const deleteResult = await axios.delete(
		`${API_URL}/${dataProviderUrlParams}/${resource}/${pathParams.join('/')}`,
		config
	)

	return deleteResult
}
