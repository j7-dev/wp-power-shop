
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
}