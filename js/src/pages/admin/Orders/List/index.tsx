import { memo } from 'react'
import Table from '@/pages/admin/Orders/List/Table'
import { List } from '@refinedev/antd'

const ListComponent = () => {
	return (
		<List title="">
			<Table />
		</List>
	)
}

export const OrdersList = memo(ListComponent)
