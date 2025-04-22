export type TTaxonomy = {
	value: string
	label: string
	hierarchical: boolean
	publicly_queryable: boolean
}

export type TWoocommerce = {
	countries: {
		[key: string]: string
	}
	currency: {
		slug: string
		symbol: string
	}
	product_taxonomies: TTaxonomy[]
	product_attributes: TTaxonomy[]
	notify_low_stock_amount: number
	dimension_unit: string
	weight_unit: string
}