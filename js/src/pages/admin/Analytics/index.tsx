import { Skeleton } from 'antd'
import { memo, useState, useEffect } from 'react'

import Filter from '@/pages/admin/Analytics/Filter'
import { RevenueContext } from '@/pages/admin/Analytics/hooks'
import useRevenue, {
	TUseRevenueParams,
} from '@/pages/admin/Analytics/hooks/useRevenue'
import { EViewType } from '@/pages/admin/Analytics/types'
import AreaView from '@/pages/admin/Analytics/ViewType/AreaView'
import DefaultView from '@/pages/admin/Analytics/ViewType/DefaultView'

const AnalyticsComponent = (props: TUseRevenueParams) => {
	const [viewType, setViewType] = useState(EViewType.DEFAULT)
	const revenueData = useRevenue(props)
	const [show, setShow] = useState(false)

	useEffect(() => {
		const delay = setTimeout(() => {
			setShow(true)
		}, 500)
		return () => clearTimeout(delay)
	}, [])

	if (!show) return <Skeleton className="my-8" active />

	return (
		<RevenueContext.Provider
			value={{
				context: props?.context,
				viewType,
				setViewType,
				...revenueData,
			}}
		>
			<div style={{ contain: 'layout paint style' }}>
				<div className="mb-4">
					<Filter />
				</div>

				{'default' === viewType && <DefaultView />}
				{'area' === viewType && <AreaView />}
			</div>
		</RevenueContext.Provider>
	)
}

export const Analytics = memo(AnalyticsComponent)
