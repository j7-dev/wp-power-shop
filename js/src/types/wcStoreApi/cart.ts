import { TImage } from './product'

export type TDestination = {
	address_1: string
	address_2: string
	city: string
	state: string
	postcode: string
	country: string
}

export type TBillingAddress = TDestination & {
	first_name: string
	last_name: string
	company: string
	phone: string
	email: string
}

export type TShippingRates = {
	rate_id: string
	name: string
	description: string
	delivery_time: string
	price: string
	taxes: string
	instance_id: number
	method_id: string
	meta_data: {
		key: string
		value: string
	}[]
	selected: boolean
	currency_code: string
	currency_symbol: string
	currency_minor_unit: number
	currency_decimal_separator: string
	currency_thousand_separator: string
	currency_prefix: string
	currency_suffix: string
}

export type TCartItem = {
	key: string
	id: number
	quantity: number
	quantity_limits: {
		minimum: number
		maximum: number
		multiple_of: number
		editable: boolean
	}
	name: string
	short_description: string
	description: string
	sku: string
	low_stock_remaining: any
	backorders_allowed: boolean
	show_backorder_badge: boolean
	sold_individually: boolean
	permalink: string
	images: TImage[]
	variation: {
		attribute: string
		value: string
	}[]
	item_data: []
	prices: {
		price: string
		regular_price: string
		sale_price: string
		price_range: string | null
		currency_code: string
		currency_symbol: string
		currency_minor_unit: number
		currency_decimal_separator: string
		currency_thousand_separator: string
		currency_prefix: string
		currency_suffix: string
		raw_prices: {
			precision: number
			price: string
			regular_price: string
			sale_price: string
		}
	}
	totals: {
		line_subtotal: string
		line_subtotal_tax: string
		line_total: string
		line_total_tax: string
		currency_code: string
		currency_symbol: string
		currency_minor_unit: number
		currency_decimal_separator: string
		currency_thousand_separator: string
		currency_prefix: string
		currency_suffix: string
	}
	catalog_visibility: string
	extensions: {}
}

export type TCart = {
	coupons: any[]
	shipping_rates: {
		package_id: number
		name: string
		destination: TDestination
		items: [
			{
				key: string
				name: string
				quantity: string
			},
		]
		shipping_rates: TShippingRates[]
	}[]
	shipping_address: Omit<TBillingAddress, 'email'>
	billing_address: TBillingAddress
	items: TCartItem[]
	items_count: number
	items_weight: number
	cross_sells: any[]
	needs_payment: boolean
	needs_shipping: boolean
	has_calculated_shipping: boolean
	fees: any[]
	totals: {
		total_items: string
		total_items_tax: string
		total_fees: string
		total_fees_tax: string
		total_discount: string
		total_discount_tax: string
		total_shipping: string
		total_shipping_tax: string
		total_price: string
		total_tax: string
		tax_lines: any[]
		currency_code: string
		currency_symbol: string
		currency_minor_unit: number
		currency_decimal_separator: string
		currency_thousand_separator: string
		currency_prefix: string
		currency_suffix: string
	}
	errors: any[]
	payment_methods: string[]
	payment_requirements: string[]
	extensions: {
		[key: string]: any
	}
}

export const defaultCart: TCart = {
	coupons: [],
	shipping_rates: [],
	shipping_address: {
		address_1: '',
		address_2: '',
		city: '',
		state: '',
		postcode: '',
		country: 'TW',
		first_name: '',
		last_name: '',
		company: '',
		phone: '',
	},
	billing_address: {
		address_1: '',
		address_2: '',
		city: '',
		state: '',
		postcode: '',
		country: 'TW',
		first_name: '',
		last_name: '',
		company: '',
		phone: '',
		email: '',
	},
	items: [],
	items_count: 0,
	items_weight: 0,
	cross_sells: [],
	needs_payment: true,
	needs_shipping: false,
	has_calculated_shipping: false,
	fees: [],
	totals: {
		total_items: '0',
		total_items_tax: '0',
		total_fees: '0',
		total_fees_tax: '0',
		total_discount: '0',
		total_discount_tax: '0',
		total_shipping: '0',
		total_shipping_tax: '0',
		total_price: '0',
		total_tax: '0',
		tax_lines: [],
		currency_code: 'TWD',
		currency_symbol: 'NT$',
		currency_minor_unit: 0,
		currency_decimal_separator: '.',
		currency_thousand_separator: ',',
		currency_prefix: 'NT$',
		currency_suffix: '',
	},
	errors: [],
	payment_methods: [],
	payment_requirements: [],
	extensions: {},
}
