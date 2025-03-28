import { WOOCOMMERCE } from '@/utils/env'
import { SelectProps } from 'antd'

type TWoocommerce = {
	countries: {
		[key: string]: string
	}
	currency: {
		slug: string
		symbol: string
	}
}

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
