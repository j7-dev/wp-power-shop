import DashBoard from './DashBoard'
import Table from './Table'
import { postId } from '@/utils'
import { useAjaxGetOrders } from '@/pages/SalesStats/hooks/useAjaxGetOrders'
import { TOrderData } from '@/pages/SalesStats/types'
import {
	paginationAtom,
	filterAtom,
	isAdminAtom,
} from '@/pages/SalesStats/atom'
import { useAtomValue } from 'jotai'
import ReportPassword from './ReportPassword'

// import DownloadExcel from './DownloadExcel'

import Filter from './Filter'

const Main = () => {
	const pagination = useAtomValue(paginationAtom)
	const filter = useAtomValue(filterAtom)
	const isAdmin = useAtomValue(isAdminAtom)
	const mutation = useAjaxGetOrders<TOrderData>({
		...pagination,
		...filter,
		post_id: postId,
	})

	const isLoading = mutation?.isLoading ?? false

	// const isError = mutation?.isError ?? false
	// const isSuccess = mutation?.isSuccess ?? false

	// const setOrderData = useSetAtom(orderDataAtom)

	// useEffect(() => {
	// 	if (!isLoading) {
	// 		const orderData = mutation?.orderData ?? defaultOrderData
	// 		setOrderData(orderData)
	// 	}
	// }, [isLoading])

	return (
		<div className="py-4">
			<DashBoard isLoading={isLoading} />
			<Filter isLoading={isLoading} />
			{/* <DownloadExcel
        isLoading={isLoading}
        isError={isError}
        isSuccess={isSuccess}
      /> */}
			{isAdmin && <ReportPassword />}
			<Table isLoading={isLoading} />
		</div>
	)
}

export default Main
