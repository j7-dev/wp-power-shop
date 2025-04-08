import { Card, Table } from 'antd'
import { useDashboard } from '@/pages/admin/Dashboard/hooks'
import { getLabels, getLeaderBoardLabels } from '@/pages/admin/Dashboard/utils'

const LeaderBoard = ({ type }: { type: 'products' | 'customers' }) => {
	const { query, dashboard, isFetching } = useDashboard()
	const { products, customers } = dashboard
	const { label } = getLabels(query.compare_type)
	const { title, nameLabel, countLabel, totalLabel } =
		getLeaderBoardLabels(type)

	const columns = [
		{
			title: nameLabel,
			dataIndex: 'name',
		},
		{
			title: countLabel,
			dataIndex: 'count',
			render: (value: number) => value.toLocaleString(),
		},
		{
			title: totalLabel,
			dataIndex: 'total',
			render: (value: number) => `$${value.toLocaleString()}`,
		},
	]

	return (
		<Card className="w-full h-full">
			<h3 className="text-sm text-gray-400 mb-2">
				{label}
				{title}排行榜
			</h3>
			<Table
				loading={isFetching}
				columns={columns}
				dataSource={type === 'products' ? products : customers}
				pagination={false}
				size="small"
			/>
		</Card>
	)
}

export default LeaderBoard
