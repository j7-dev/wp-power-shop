import { useList } from '@refinedev/core'
import dayjs from 'dayjs'
import { Card, Col, Row, Table } from 'antd'

const RecentTopSaleProducts = () => {
	const weekStart = dayjs().startOf('week')
	const { data: response, isLoading } = useList({
		resource: 'orders',
		filters: [
			{
				field: 'date_created',
				operator: 'gte',
				value: weekStart.toISOString(),
			},
		],
		pagination: { mode: 'off' },
	})

	const columns = [
		{
			title: '商品名稱',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: '銷售數量',
			dataIndex: 'quantity',
			key: 'quantity',
			render: (value: number) => value.toLocaleString(),
			sorter: (a: any, b: any) => a.quantity - b.quantity,
		},
		{
			title: '總金額',
			dataIndex: 'total_amount',
			key: 'total_amount',
			render: (value: number) => `$${value.toLocaleString()}`,
			sorter: (a: any, b: any) => a.total_amount - b.total_amount,
		},
	]

	// 统计商品销售数据
	const productData =
		response?.data?.reduce((acc: any[], order: any) => {
			// 遍历订单中的每个商品
			order.items?.forEach((item: any) => {
				const productId = item?.product_id
				if (!productId) return

				const existingProduct = acc.find((p) => p.product_id === productId)
				if (existingProduct) {
					existingProduct.quantity += item.quantity || 0
					existingProduct.total_amount += parseFloat(item.total || 0)
				} else {
					acc.push({
						key: productId,
						product_id: productId,
						name: item?.name || '未知商品',
						quantity: item.quantity || 0,
						total_amount: parseFloat(item.total || 0),
					})
				}
			})
			return acc
		}, []) || []

	// 按销售金额排序
	const sortedProductData = [...productData].sort(
		(a, b) => b.total_amount - a.total_amount,
	)

	if (isLoading) return <div>載入中...</div>
	return (
		<>
			<h3>本週銷售榜</h3>
			<p>本週銷售最多的商品</p>
			<Table
				columns={columns}
				dataSource={sortedProductData}
				pagination={false}
				size="small"
			/>
		</>
	)
}

const RecentTopCustomers = () => {
	const weekStart = dayjs().startOf('week')
	const { data: response, isLoading } = useList({
		resource: 'orders',
		filters: [
			{
				field: 'date_created',
				operator: 'gte',
				value: weekStart.toISOString(),
			},
		],
	})

	const columns = [
		{
			title: '顧客名稱',
			dataIndex: ['customer', 'display_name'],
			key: 'customer_name',
		},
		{
			title: '訂單數量',
			dataIndex: 'order_count',
			key: 'order_count',
			sorter: (a: any, b: any) => a.order_count - b.order_count,
		},
		{
			title: '總金額',
			dataIndex: 'total_amount',
			key: 'total_amount',
			render: (value: number) => `$${value.toLocaleString()}`,
			sorter: (a: any, b: any) => a.total_amount - b.total_amount,
		},
	]

	const customerData =
		response?.data?.reduce((acc: any[], order: any) => {
			const customerId = order.customer?.id
			const existingCustomer = acc.find(
				(item) => item.customer.id === customerId,
			)

			if (existingCustomer) {
				existingCustomer.order_count++
				existingCustomer.total_amount += parseFloat(order.total)
			} else {
				acc.push({
					key: customerId,
					customer: order.customer,
					order_count: 1,
					total_amount: parseFloat(order.total),
				})
			}
			return acc
		}, []) || []

	if (isLoading) return <div>載入中...</div>
	return (
		<>
			<h3>本週顧客排行榜</h3>
			<p>本週購買最多的顧客</p>
			<Table
				columns={columns}
				dataSource={customerData}
				pagination={false}
				size="small"
			/>
		</>
	)
}

const LeaderBoard = () => {
	return (
		<Row gutter={[16, 16]} className="w-full">
			<Col xs={24} sm={24} md={24} xl={14}>
				<Card className="w-full h-full">
					<RecentTopSaleProducts />
				</Card>
			</Col>
			<Col xs={24} sm={24} md={24} xl={10}>
				<Card className="w-full h-full">
					<RecentTopCustomers />
				</Card>
			</Col>
		</Row>
	)
}

export default LeaderBoard
