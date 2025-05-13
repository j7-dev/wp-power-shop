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
	notify_low_stock_amount: z.number(),
	dimension_unit: z.string(),
	weight_unit: z.string(),
	permalinks: z.object({
		product_base: z.string(),
		category_base: z.string(),
		tag_base: z.string(),
		attribute_base: z.string(),
		use_verbose_page_rules: z.boolean(),
		product_rewrite_slug: z.string(),
		category_rewrite_slug: z.string(),
		tag_rewrite_slug: z.string(),
		attribute_rewrite_slug: z.string(),
	}),
	product_types: z.array(z.object({
		value: z.string(),
		label: z.string(),
		color: z.string(),
	})),
})

export type TWoocommerce = z.infer<typeof WoocommerceSchema>

export const DEFAULT_WOOCOMMERCE: TWoocommerce = {
	countries: {},
	currency: {
		slug: '',
		symbol: '',
	},
	product_taxonomies: [],
	notify_low_stock_amount: 0,
	dimension_unit: '',
	weight_unit: '',
	permalinks: {
		product_base: '',
		category_base: '',
		tag_base: '',
		attribute_base: '',
		use_verbose_page_rules: false,
		product_rewrite_slug: '',
		category_rewrite_slug: '',
		tag_rewrite_slug: '',
		attribute_rewrite_slug: '',
	},
	product_types: [],
}
