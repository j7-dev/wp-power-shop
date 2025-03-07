import React, { memo } from 'react'
import Table from '@/pages/admin/Docs/List/Table'
import { List } from '@refinedev/antd'

const ListComponent = () => {
	return (
		<List title="">
			<Table />
		</List>
	)
}

export const DocsList = memo(ListComponent)
