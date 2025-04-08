import { TIntervalBase, TTotals } from '@/pages/admin/Analytics/types'

type TLeaderboardRow = {
	name: string
	count: number
	total: number
}

export type TDashboard = {
	total_sales: number
	total_sales_compared: number
	new_registration: number
	new_registration_compared: number
	orders_count_unshipped: number
	orders_count_unshipped_compared: number
	orders_count_unpaid: number
	orders_count_unpaid_compared: number
	products: TLeaderboardRow[]
	customers: TLeaderboardRow[]
	intervals: (TIntervalBase & TTotals)[]
}

export type TDashboardStats = {
	code: string
	message: string
	data: TDashboard
}

export type TQuery = {
	after: string
	before: string
	per_page: number
	compare_type: 'day' | 'week' | 'month' | 'year'
	compare_value: number
}

export type TDashboardContext = {
	dashboard: TDashboard
	isLoading: boolean
	isFetching: boolean
	query: TQuery
	setQuery: React.Dispatch<React.SetStateAction<TQuery>>
}
