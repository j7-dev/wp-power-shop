import { SelectProps } from 'antd'
import {
	TWoocommerce,
	WoocommerceSchema,
	DEFAULT_WOOCOMMERCE,
} from '@/types/woocommerce'
import { useCustom, useApiUrl } from '@refinedev/core'
import { safeParse } from '@/utils'

/**
 * 取得 WooCommerce 的設定
 * @returns TWoocommerce
 */
export const useWoocommerce = (): TWoocommerce => {
	const apiUrl = useApiUrl()
	const { data, isLoading } = useCustom({
		url: `${apiUrl}/woocommerce`,
		method: 'get',
	})

	const wcData = data?.data?.data || (DEFAULT_WOOCOMMERCE as TWoocommerce)

	if (!isLoading) {
		safeParse(WoocommerceSchema, wcData)
	}

	return wcData
}

/**
 * 取得國家 key-value 組合
 * @returns Record<string, string> | undefined
 */
export const useCountries = (): Record<string, string> | undefined => {
	const wc = useWoocommerce()
	return wc?.countries
}

/**
 * 取得國家 Select 選項
 * @returns SelectProps['options']
 */
export const useCountryOptions = (): SelectProps['options'] => {
	const wc = useWoocommerce()
	const countries = wc?.countries || []
	return Object.entries(countries).map(([key, value]) => ({
		label: value as string,
		value: key,
	}))
}

/**
 * 取得所有商品的 taxonomy 選項
 * @returns SelectProps['options']
 */
export const useProductTaxonomies = (): SelectProps['options'] => {
	const wc = useWoocommerce()
	return wc?.product_taxonomies || []
}
