import { WOOCOMMERCE } from '@/utils/env'
import { SelectProps } from 'antd'
import { TWoocommerce } from '@/types'

/**
 * 取得 WooCommerce 的設定
 * @returns TWoocommerce
 */
export const useWoocommerce = (): TWoocommerce => {
	return WOOCOMMERCE as TWoocommerce
}

/**
 * 取得國家 key-value 組合
 * @returns TWoocommerce['countries']
 */
export const useCountries = (): TWoocommerce['countries'] => {
	return WOOCOMMERCE.countries
}

/**
 * 取得國家 Select 選項
 * @returns SelectProps['options']
 */
export const useCountryOptions = (): SelectProps['options'] => {
	const countries = WOOCOMMERCE.countries
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
	return WOOCOMMERCE.product_taxonomies || []
}
