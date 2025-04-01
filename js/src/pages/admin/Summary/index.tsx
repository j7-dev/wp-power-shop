import { useOne, useList } from '@refinedev/core'
import { Card, Flex, Row, Col, Table } from 'antd'
import { useEnv } from 'antd-toolkit'
import { LiaShippingFastSolid } from 'react-icons/lia'
import { LuUsers } from 'react-icons/lu'
import { MdOutlinePayments } from 'react-icons/md'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'
import { TUserDetails } from '../Users/types'
import dayjs from 'dayjs'

const Welcome = () => {
	const { CURRENT_USER_ID } = useEnv()

	const { data: response, isLoading } = useOne<TUserDetails>({
		resource: 'users',
		id: CURRENT_USER_ID,
	})

	if (isLoading) return <div>載入中...</div>

	const { display_name: userName } = response?.data || {}

	return (
		<div>
			<h2>歡迎回來，{userName}</h2>
		</div>
	)
}

const SummaryCards = () => {
	return (
		<Row gutter={[16, 16]} className="w-full">
			<Col xs={24} sm={12} md={12} xl={6}>
				<Card className="w-full">
					<Flex justify="flex-start" gap="middle" align="flex-start">
						<Flex
							gap="small"
							justify="center"
							align="flex-start"
							vertical
							className="h-full w-11/12"
						>
							<div className="font-bold text-xl">今日營收</div>
							<div className="font-bold text-2xl">$1,234,567</div>
							<div className="font-bold text-lg text-primary">
								+12.5% 相比昨天
							</div>
						</Flex>
						<div className="w-1/12">
							<RiMoneyDollarCircleLine size={28} />
						</div>
					</Flex>
				</Card>
			</Col>
			<Col xs={24} sm={12} md={12} xl={6}>
				<Card className="w-full">
					<Flex justify="flex-start" gap="middle" align="flex-start">
						<Flex
							gap="small"
							justify="center"
							align="flex-start"
							vertical
							className="h-full w-11/12"
						>
							<div className="font-bold text-xl">今日新增用戶</div>
							<div className="font-bold text-2xl">4,567</div>
							<div className="font-bold text-lg text-primary">
								+8.5% 相比昨天
							</div>
						</Flex>
						<div className="w-1/12">
							<LuUsers size={28} />
						</div>
					</Flex>
				</Card>
			</Col>
			<Col xs={24} sm={12} md={12} xl={6}>
				<Card className="w-full">
					<Flex justify="flex-start" gap="middle" align="flex-start">
						<Flex
							gap="small"
							justify="center"
							align="flex-start"
							vertical
							className="h-full w-11/12"
						>
							<div className="font-bold text-xl">訂單未出貨</div>
							<div className="font-bold text-2xl">67</div>
							<div className="font-bold text-lg text-primary">
								+5.5% 相比昨天
							</div>
						</Flex>
						<div className="w-1/12">
							<LiaShippingFastSolid size={28} />
						</div>
					</Flex>
				</Card>
			</Col>
			<Col xs={24} sm={12} md={12} xl={6}>
				<Card className="w-full">
					<Flex justify="flex-start" gap="middle" align="flex-start">
						<Flex
							gap="small"
							justify="center"
							align="flex-start"
							vertical
							className="h-full w-11/12"
						>
							<div className="font-bold text-xl">訂單未付款</div>
							<div className="font-bold text-2xl">$34,567</div>
							<div className="font-bold text-lg text-error">
								-12.5% 相比昨天
							</div>
						</Flex>
						<div className="w-1/12">
							<MdOutlinePayments size={28} />
						</div>
					</Flex>
				</Card>
			</Col>
		</Row>
	)
}

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
	})

	const columns = [
		{
			title: '商品名稱',
			dataIndex: ['product', 'name'],
			key: 'product_name',
		},
		{
			title: '銷售數量',
			dataIndex: 'quantity',
			key: 'quantity',
		},
		{
			title: '總金額',
			dataIndex: 'total_amount',
			key: 'total_amount',
			render: (value: number) => `$${value.toLocaleString()}`,
		},
	]
    
	const productData = response?.data?.reduce((acc: any[], order: any) => {
		if (!order?.product?.id) return acc;
		
		const productId = order.product.id
		const existingProduct = acc.find(
			(item) => item.product?.id === productId,
		)

		if (existingProduct) {
			existingProduct.quantity += order.quantity || 0
			existingProduct.total_amount += parseFloat(order.total || 0)
		} else {
			acc.push({
				key: productId,
				product: order.product,
				quantity: order.quantity || 0,
				total_amount: parseFloat(order.total || 0),
			})
		}
		return acc
	}, []) || []

	if (isLoading) return <div>載入中...</div>
	return (
		<>
			<h3>本週銷售榜</h3>
			<p>本週銷售最多的商品</p>
			<Table
				columns={columns}
				dataSource={productData}
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

const RecentSales = () => {
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

export const Summary = () => {
	return (
		<Flex vertical gap="middle">
			<Welcome />
			<SummaryCards />
			<RecentSales />
		</Flex>
	)
}
