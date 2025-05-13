import { memo, useState } from 'react'
import Filter from '@/pages/admin/Analytics/Filter'
import useRevenue, {
	TUseRevenueParams,
} from '@/pages/admin/Analytics/hooks/useRevenue'
import { EViewType } from '@/pages/admin/Analytics/types'
import { RevenueContext } from '@/pages/admin/Analytics/hooks'
import DefaultView from '@/pages/admin/Analytics/ViewType/DefaultView'
import AreaView from '@/pages/admin/Analytics/ViewType/AreaView'

const AnalyticsComponent = (props: TUseRevenueParams) => {
	const [viewType, setViewType] = useState(EViewType.DEFAULT)
	const revenueData = useRevenue(props)

	return (
		<RevenueContext.Provider
			value={{
				context: props?.context,
				viewType,
				setViewType,
				...revenueData,
			}}
		>
			<div className="mb-4">
				<Filter />
			</div>

			{'default' === viewType && <DefaultView />}
			{'area' === viewType && <AreaView />}
		</RevenueContext.Provider>
	)
}

export const Analytics = memo(AnalyticsComponent)
