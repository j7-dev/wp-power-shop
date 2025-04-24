import { z } from 'zod'

// Zod Schema
export const TaxonomySchema = z.object({
	value: z.string(),
	label: z.string(),
	hierarchical: z.boolean(),
	publicly_queryable: z.boolean()
})

export type TTaxonomy = z.infer<typeof TaxonomySchema>


export const WoocommerceSchema = z.object({
	countries: z.record(z.string(), z.string()),
	currency: z.object({
		slug: z.string(),
		symbol: z.string()
	}),
	product_taxonomies: z.array(TaxonomySchema),
	product_types: z.array(z.object({
		value: z.string(),
		label: z.string(),
		color: z.string(),
	})),
	notify_low_stock_amount: z.number(),
	dimension_unit: z.string(),
	weight_unit: z.string()
})

export type TWoocommerce = z.infer<typeof WoocommerceSchema>

export const DEFAULT_WOOCOMMERCE: TWoocommerce = {
	countries: {},
	currency: {
		slug: '',
		symbol: '',
	},
	product_taxonomies: [],
	product_types: [],
	notify_low_stock_amount: 0,
	dimension_unit: '',
	weight_unit: '',
}
