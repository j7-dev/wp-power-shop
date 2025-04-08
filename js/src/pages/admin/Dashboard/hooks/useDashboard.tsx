import { useContext } from 'react'
import { DashboardContext } from '@/pages/admin/Dashboard'

export const defaultDashboard = {
	total_sales: 0,
	total_sales_compared: 0,
	new_registration: 0,
	new_registration_compared: 0,
	orders_count_unshipped: 0,
	orders_count_unshipped_compared: 0,
	orders_count_unpaid: 0,
	orders_count_unpaid_compared: 0,
	products: [],
	customers: [],
	intervals: [],
}

export const useDashboard = () => {
	const dashboardData = useContext(DashboardContext)

	return dashboardData
}
