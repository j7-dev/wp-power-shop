import { useState, createContext } from 'react'
import { NoUndefinedRangeValueType } from 'rc-picker/lib/PickerInput/RangePicker'
import { Flex, Row, Col, DatePicker } from 'antd'
import Welcome from './Welcome'
import DashboardCards from './DashboardCards'
import LeaderBoard from './LeaderBoard'
import IntervalChart from './IntervalChart'
import { useCustom, useApiUrl } from '@refinedev/core'
import dayjs, { Dayjs } from 'dayjs'
import { TDashboardStats, TDashboardContext, TQuery } from './types'
import { defaultDashboard } from './hooks'
import {
	RANGE_PRESETS,
	maxDateRange,
	FORMAT,
} from '@/pages/admin/Analytics/utils'

const { RangePicker } = DatePicker

export const DashboardContext = createContext<TDashboardContext>({
	dashboard: defaultDashboard,
	isLoading: false,
	isFetching: false,
	query: {} as TQuery,
	setQuery: () => {},
})

export const Summary = () => {
	const [query, setQuery] = useState<TQuery>({
		after: dayjs().startOf('day').format(FORMAT),
		before: dayjs().endOf('day').format(FORMAT),
		per_page: 5,
		compare_type: 'day', // 比較前{天}
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

	const handleChange = (dates: NoUndefinedRangeValueType<Dayjs> | null) => {
		const before = dates?.[0] || dayjs().startOf('day')
		const after = dates?.[1] || dayjs().endOf('day')

		// 比較差異天數
		const diffDays = after.diff(before, 'day')

		const newQuery = {
			...query,
			after: before.format(FORMAT),
			before: after.format(FORMAT),
		}

		// 如果差異天數大於 31 天，則比較去年同期
		if (diffDays > 31) {
			setQuery({
				...newQuery,
				compare_type: 'year',
			})
			return
		}

		// 如果差異天數大於 7 天，則比較上個月
		if (diffDays > 7) {
			setQuery({
				...newQuery,
				compare_type: 'month',
			})
			return
		}

		// 如果差異天數大於 1 天，則比較上週
		if (diffDays > 1) {
			setQuery({
				...newQuery,
				compare_type: 'week',
			})
			return
		}

		// 則比較上一天
		setQuery({
			...newQuery,
			compare_type: 'day',
		})
	}

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
				<div className="flex justify-start w-full">
					<RangePicker
						presets={RANGE_PRESETS}
						disabledDate={maxDateRange}
						placeholder={['開始日期', '結束日期']}
						allowClear={false}
						className="w-[16rem]"
						value={[
							dayjs(query.after, FORMAT),
							dayjs(query.before, FORMAT),
						]}
						onChange={handleChange}
					/>
				</div>
				<DashboardCards />
				<Row gutter={[16, 16]} className="w-full">
					<Col xs={24} sm={24} md={24} xl={14}>
						<LeaderBoard type="products" />
					</Col>
					<Col xs={24} sm={24} md={24} xl={10}>
						<LeaderBoard type="customers" />
					</Col>
				</Row>
				<IntervalChart />
			</Flex>
		</DashboardContext.Provider>
	)
}
