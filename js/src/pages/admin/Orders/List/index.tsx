import { memo } from 'react'
import Table from '@/pages/admin/Orders/List/Table'

const ListComponent = () => {
	return <Table />
}

export const OrdersList = memo(ListComponent)
