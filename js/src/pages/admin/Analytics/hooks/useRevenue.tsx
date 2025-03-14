import React, { useState } from 'react'
import {
	useCustom,
	useApiUrl,
	CustomResponse,
	HttpError,
	UseLoadingOvertimeReturnType,
	CrudFilter,
} from '@refinedev/core'
import { QueryObserverResult } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { TRevenue, TFormattedRevenue, EViewType } from '../types'
import { Form } from 'antd'
import { round } from 'lodash-es'

const defaultQuery = {
	order: 'asc',
	interval: 'day',
	per_page: 10000,
	after: dayjs().add(-7, 'd').startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
	before: dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
	_locale: 'user',
	page: 1,
	compare_last_year: false,
}

export type TQuery = typeof defaultQuery

const useRevenue = () => {
	const apiUrl = useApiUrl()
	const [query, setQuery] = useState(defaultQuery)
	const [viewType, setViewType] = useState(EViewType.DEFAULT)
	const { compare_last_year } = query

	const result = useCustom<TRevenue>({
		url: `${apiUrl}/reports/revenue/stats`,
		method: 'get',
		config: {
			filters: getFormattedFilter(query),
		},
	})

	const lastYearQuery = {
		...query,
		after: dayjs(query.after).subtract(1, 'year').format('YYYY-MM-DDTHH:mm:ss'),
		before: dayjs(query.before)
			.subtract(1, 'year')
			.format('YYYY-MM-DDTHH:mm:ss'),
	}

	const lastYearResult = useCustom<TRevenue>({
		url: `${apiUrl}/reports/revenue/stats`,
		method: 'get',
		config: {
			filters: getFormattedFilter(lastYearQuery),
		},
		queryOptions: {
			enabled: compare_last_year,
		},
	})

	// 格式化新的 result
	const formattedResult = getFormattedResult(result, false)
	const formattedLastYearResult = getFormattedResult(lastYearResult, true)

	// 取得 response header 上的 X-WP-TotalPages
	// @ts-ignore
	const totalPages = Number(result?.data?.headers?.['x-wp-totalpages']) || 1
	// @ts-ignore
	const total = Number(result?.data?.headers?.['x-wp-total']) || 1

	const [form] = Form.useForm()

	return {
		result: formattedResult,
		lastYearResult: formattedLastYearResult,
		filterProps: {
			isFetching: result.isFetching,
			isLoading: result.isLoading,
			setQuery,
			query,
			totalPages,
			total,
			form,
			viewType,
			setViewType,
		},
		viewTypeProps: {
			revenueData: formattedResult?.data?.data,
			lastYearRevenueData: formattedLastYearResult?.data?.data,
			form,
		},
	}
}

/**
 * 格式化 result
 * @param result
 * @param dataLabel
 * @param isLastYear
 * @return
 */
function getFormattedResult(
	result: QueryObserverResult<CustomResponse<TRevenue>, HttpError> &
		UseLoadingOvertimeReturnType,
	isLastYear: boolean,
): QueryObserverResult<CustomResponse<TFormattedRevenue>, HttpError> &
	UseLoadingOvertimeReturnType {
	const intervals = result?.data?.data?.intervals || []
	const lastIntervals = intervals[intervals.length - 1]

	const formatIntervals = intervals.map(({ subtotals, ...restInterval }) => {
		const interval_compared = isLastYear
			? Number(restInterval?.interval?.slice(0, 4)) +
				1 +
				restInterval?.interval?.slice(4) // 把restInterval.interval 這個string前四個字取出後 +1
			: restInterval.interval

		// 把 subtotals 數據 round 最多小數點2位
		const roundedSubtotals = Object.fromEntries(
			Object.entries(subtotals).map(([key, value]) => [
				key,
				round(value as number, 2),
			]),
		)

		// 建立新物件而不是修改原物件
		const newInterval = {
			...restInterval,
			...roundedSubtotals,
			dataLabel: `${lastIntervals?.interval?.slice(0, 4)}年`,
			interval_compared,
		}
		return newInterval
	})

	// 創建新的 result
	const formatResult = {
		...result,
		data: {
			...result?.data,
			data: {
				...result?.data?.data,
				intervals: formatIntervals,
			},
		},
	} as QueryObserverResult<CustomResponse<TFormattedRevenue>, HttpError> &
		UseLoadingOvertimeReturnType

	return formatResult
}

function getFormattedFilter(query: TQuery) {
	const filters = Object.keys(query).map((key) => ({
		field: key,
		operator: 'eq',
		value: query[key as keyof typeof query],
	})) as CrudFilter[]
	return filters
}

export default useRevenue
