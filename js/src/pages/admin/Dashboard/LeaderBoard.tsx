import { Card, Table } from 'antd'
import { useDashboard } from '@/pages/admin/Dashboard/hooks'
import { getLabels, getLeaderBoardLabels } from '@/pages/admin/Dashboard/utils'
import { useWoocommerce } from '@/hooks'

const LeaderBoard = ({ type }: { type: 'products' | 'customers' }) => {
	const {
		currency: { symbol },
	} = useWoocommerce()
	const { query, dashboard, isFetching } = useDashboard()
	const { products, customers } = dashboard
	const { label } = getLabels(query)
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
			render: (value: number) => `${symbol} ${value.toLocaleString()}`,
		},
	]

	return (
		<Card className="w-full h-full" variant="borderless">
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
