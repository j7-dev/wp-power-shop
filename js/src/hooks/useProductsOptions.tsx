import React from 'react'
import { useCustom, useApiUrl } from '@refinedev/core'
import { TProductFilterOptions } from 'antd-toolkit/refine'

export const useProductsOptions = () => {
	const apiUrl = useApiUrl()
	const result = useCustom<Omit<TProductFilterOptions, 'isLoading'>>({
		url: `${apiUrl}/products/options`,
		method: 'get',
	})

	const options: Omit<TProductFilterOptions, 'isLoading'> = result?.data
		?.data || {
		product_cats: [],
		product_tags: [],
		product_brands: [],
		top_sales_products: [],
		max_price: 0,
		min_price: 0,
	}

	return {
		...options,
		isLoading: result?.isLoading || false,
	}
}
