import React, { createContext, useContext } from 'react'
import {
	EViewType,
	TFilterProps,
	TQuery,
	TViewTypeProps,
	TFormattedRevenue,
} from '@/pages/admin/Analytics/types'

import { FormInstance } from 'antd'
import { QueryObserverResult } from '@tanstack/react-query'
import {
	CustomResponse,
	HttpError,
	UseLoadingOvertimeReturnType,
} from '@refinedev/core'

export const RevenueContext = createContext<
	| {
			context?: 'detail'
			viewType: EViewType
			setViewType: React.Dispatch<React.SetStateAction<EViewType>>
			result: QueryObserverResult<
				CustomResponse<TFormattedRevenue>,
				HttpError
			> &
				UseLoadingOvertimeReturnType
			lastYearResult: QueryObserverResult<
				CustomResponse<TFormattedRevenue>,
				HttpError
			> &
				UseLoadingOvertimeReturnType
			isFetching: boolean
			isLoading: boolean
			form: FormInstance
			query: TQuery
			setQuery: React.Dispatch<React.SetStateAction<TQuery>>
			filterProps: TFilterProps
			viewTypeProps: TViewTypeProps
	  }
	| undefined
>(undefined)

export const useRevenueContext = () => {
	const context = useContext(RevenueContext)

	if (!context) {
		throw new Error('useRevenueContext must be used within a RevenueContext')
	}

	return context
}
