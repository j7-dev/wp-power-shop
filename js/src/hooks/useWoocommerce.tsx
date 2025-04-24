import { SelectProps } from 'antd'
import { TWoocommerce } from '@/types'
import { useCustom, useApiUrl } from '@refinedev/core'

/**
 * 取得 WooCommerce 的設定
 * @returns TWoocommerce
 */
export const useWoocommerce = (): TWoocommerce | undefined => {
	const apiUrl = useApiUrl()
	const { data } = useCustom({
		url: `${apiUrl}/woocommerce`,
		method: 'get',
	})

	return data?.data?.data as TWoocommerce | undefined
}

/**
 * 取得國家 key-value 組合
 * @returns TWoocommerce['countries']
 */
export const useCountries = (): TWoocommerce['countries'] | undefined => {
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
