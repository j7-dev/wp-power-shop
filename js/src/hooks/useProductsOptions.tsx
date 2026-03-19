import { useCustom, useApiUrl } from '@refinedev/core'
import {
	TProductFilterOptions,
	defaulTProductFilterOptions as DEFAULT,
} from 'antd-toolkit/refine'
import React from 'react'

export const useProductsOptions = () => {
	const apiUrl = useApiUrl()
	const result = useCustom<Omit<TProductFilterOptions, 'isLoading'>>({
		url: `${apiUrl}/products/options`,
		method: 'get',
		queryOptions: {
			queryKey: ['products-options'],
		},
	})

	const options: Omit<TProductFilterOptions, 'isLoading'> =
		result?.data?.data || DEFAULT

	return {
		...options,
		isLoading: result?.isLoading || false,
	}
}
