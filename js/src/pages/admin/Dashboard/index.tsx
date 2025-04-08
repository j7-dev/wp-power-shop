import { useState, createContext } from 'react'
import { Flex } from 'antd'
import Welcome from './Welcome'
import DashboardCards from './DashboardCards'
import LeaderBoard from './LeaderBoard'
import IntervalChart from './IntervalChart'
import { useCustom, useApiUrl } from '@refinedev/core'
import dayjs from 'dayjs'
import { TDashboardStats, TDashboardContext, TQuery } from './types'
import { defaultDashboard } from './hooks'

export const DashboardContext = createContext<TDashboardContext>({
	dashboard: defaultDashboard,
	isLoading: false,
	isFetching: false,
	query: {} as TQuery,
	setQuery: () => {},
})

export const Summary = () => {
	const [query, setQuery] = useState<TQuery>({
		after: dayjs().startOf('day').toISOString(),
		before: dayjs().endOf('day').toISOString(),
		per_page: 5,
		compare_type: 'day', // 比較前1{天}
		compare_value: 1, // 比較前{1}天
	})
	const apiUrl = useApiUrl('power-shop')
	const { data, isLoading, isFetching } = useCustom<TDashboardStats>({
		url: `${apiUrl}/reports/dashboard/stats`,
		method: 'get',
		config: {
			query,
		},
	})

	const dashboard = data?.data?.data || defaultDashboard

	return (
		<DashboardContext.Provider
			value={{
				dashboard,
				isLoading,
				isFetching,
				query,
				setQuery,
			}}
		>
			<Flex vertical gap="middle" className="w-full" align="center">
				<Welcome />
				<DashboardCards />
				<LeaderBoard />
				<IntervalChart />
			</Flex>
		</DashboardContext.Provider>
	)
}
