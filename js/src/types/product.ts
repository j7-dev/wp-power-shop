
export type TWoocommerce = {
	countries: {
		[key: string]: string
	}
	currency: {
		slug: string
		symbol: string
	}
	product_taxonomies: {
		value: string
		label: string
	}[]
	notify_low_stock_amount: number
	dimension_unit: string
	weight_unit: string
}