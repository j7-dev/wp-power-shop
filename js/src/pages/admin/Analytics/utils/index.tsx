import dayjs from 'dayjs'
import { DatePickerProps, TimeRangePickerProps } from 'antd'

export const FORMAT = 'YYYY-MM-DDTHH:mm:ss'

export const RANGE_PRESETS: TimeRangePickerProps['presets'] = [
	{
		label: '今天',
		value: [dayjs().startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '最近 7 天',
		value: [dayjs().add(-7, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '最近 14 天',
		value: [dayjs().add(-14, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '最近 30 天',
		value: [dayjs().add(-30, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '最近 90 天',
		value: [dayjs().add(-90, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '最近 180 天',
		value: [dayjs().add(-180, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '最近 365 天',
		value: [dayjs().add(-365, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '月初至今',
		value: [dayjs().startOf('month'), dayjs().endOf('day')],
	},
	{ label: '年初至今', value: [dayjs().startOf('year'), dayjs().endOf('day')] },
]

// Disabled 732 days from the selected date
export const maxDateRange: DatePickerProps['disabledDate'] = (
	current,
	{ from, type },
) => {
	if (current && current > dayjs().endOf('day')) {
		return true
	}
	if (from) {
		return Math.abs(current.diff(from, 'days')) >= 366
	}

	return false
}

// 避免刻度太密集
export const tickFilter = (
	datum: string,
	index: number,
	datums: string[],
): boolean => {
	const length = datums?.length || 0
	if (length > 12 && (length % 3 === 0 || length % 4 === 0)) {
		if (length % 3 === 0) {
			return (index + 1) % 3 === 0
		}
		if (length % 2 === 0) {
			return (index + 1) % 2 === 0
		}
	}

	return true
}

export const cards = [
	{
		title: '總營業額',
		slug: 'total_sales',
		unit: '元',
		tooltip:
			'總營業額 ( 收到的錢 ) = 原始的銷售總額 ( 商品原價 × 銷售數量 ) - 優惠券折扣 - 退款 + 運費',
	},
	{
		title: '淨營業額',
		slug: 'net_revenue',
		unit: '元',
		tooltip: '淨收入 = 總營業額 - 運費',
	},
	{
		title: '運費',
		slug: 'shipping',
		unit: '元',
	},
	{
		title: '總訂單數',
		slug: 'orders_count',
		unit: '個',
	},
	{
		title: '實際成交訂單數',
		slug: 'non_refunded_orders_count',
		unit: '個',
		tooltip: '實際成交訂單數 = 總訂單數 - 退款訂單數',
	},
	{
		title: '已退款訂單數',
		slug: 'refunded_orders_count',
		unit: '個',
	},
	{
		title: '退款金額',
		slug: 'refunds',
		unit: '元',
	},
	{
		title: '學員數',
		slug: 'student_count',
		unit: '人',
	},
	{
		title: '單元完成數量',
		slug: 'finished_chapters_count',
		unit: '個',
	},

	// 以下為 WC 原本就有的數據
	{
		title: '售出的商品數量',
		slug: 'num_items_sold',
		unit: '個',
	},
	{
		title: '售出數量',
		slug: 'items_sold', // product query 才會出現
		unit: '個',
	},
	{
		title: '優惠券金額',
		slug: 'coupons',
		unit: '元',
	},
	{
		title: '優惠券數量',
		slug: 'coupons_count',
		unit: '個',
	},

	// {
	// 	title: '稅金',
	// 	slug: 'taxes',
	// },

	{
		title: '平均訂單商品數量',
		slug: 'avg_items_per_order',
		unit: '個',
	},
	{
		title: '平均訂單金額',
		slug: 'avg_order_value',
		unit: '元',
	},
	{
		title: '客戶數量',
		slug: 'total_customers',
		unit: '人',
	},
]
