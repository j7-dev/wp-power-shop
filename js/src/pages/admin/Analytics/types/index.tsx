import dayjs from 'dayjs'
import { TProductType } from 'antd-toolkit/wp'

export enum EViewType {
	DEFAULT = 'default',
	AREA = 'area', // 面積比較圖
}

export type TTotals = {
	orders_count: number
	num_items_sold: number
	gross_sales: number // 毛收入 原始的銷售總額 商品原價 × 銷售數量
	total_sales: number // 總銷售額(收到的錢) = 毛收入 - 優惠券折扣 - 退款 + 運費
	coupons: number
	coupons_count: number
	refunds: number

	// taxes: number
	shipping: number
	net_revenue: number // 淨收入 = 總銷售額 - 運費
	avg_items_per_order: number
	avg_order_value: number
	total_customers: number
	products: number
	segments: any[]
}

export type TIntervalBase = {
	interval: string // '2022-52'
	date_start: string // '2023-01-01 00:00:00'
	date_start_gmt: string // '2022-12-31 16:00:00'
	date_end: string // '2023-01-01 23:59:59'
	date_end_gmt: string // '2023-01-01 15:59:59'
	interval_compared: string // '2023-01-01' // 用來比較的時間段，如果跟去年比較，這個欄位會顯示今年的值
	dataLabel: string // '今年'
}

export type TRevenue = {
	totals: TTotals
	intervals: (TIntervalBase & {
		subtotals: TTotals
	})[]
}

export type TFormattedRevenue = {
	totals: TTotals
	intervals: (TIntervalBase & TTotals)[]
}

export type TViewTypeProps = {
	revenueData: TFormattedRevenue | undefined
	lastYearRevenueData: TFormattedRevenue | undefined
}

export type TProductSelectOption = {
	id: string
	type: TProductType
	name: string
	slug: string
	permalink: string
}

export const defaultQuery = {
	order: 'asc',
	interval: 'day',
	per_page: 10000,
	after: dayjs().add(-7, 'd').startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
	before: dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
	_locale: 'user',
	page: 1,
	compare_last_year: false,
	product_includes: [] as string[],
}

export type TQuery = typeof defaultQuery

export type TFilterProps = {
	totalPages: number
	total: number
}
