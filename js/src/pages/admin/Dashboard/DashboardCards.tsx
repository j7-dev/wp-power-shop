import { LiaShippingFastSolid } from 'react-icons/lia'
import { LuUsers } from 'react-icons/lu'
import { MdOutlinePayments } from 'react-icons/md'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'
import { Card, Flex, Row, Col } from 'antd'
import { useList } from '@refinedev/core'
import dayjs from 'dayjs'
import { useColor } from 'antd-toolkit'

const DashboardCards = () => {
	const { colorSuccess, colorError } = useColor()
	const today = dayjs().startOf('day')
	const yesterday = today.subtract(1, 'day')

	const { data: orders, isLoading: isLoadingOrders } = useList({
		resource: 'orders',
		filters: [
			{ field: 'date_created', operator: 'gte', value: today.toISOString() },
		],
		pagination: { mode: 'off' },
	})

	const { data: todayOrders, isLoading: isLoadingToday } = useList({
		resource: 'orders',
		filters: [
			{
				field: 'date_created',
				operator: 'gte',
				value: today.toISOString(),
			},
		],
		pagination: { mode: 'off' },
	})

	const { data: yesterdayOrders, isLoading: isLoadingYesterday } = useList({
		resource: 'orders',
		filters: [
			{
				field: 'date_created',
				operator: 'gte',
				value: yesterday.toISOString(),
			},
		],
		pagination: { mode: 'off' },
	})

	const { data: todayUsers, isLoading: isLoadingTodayUsers } = useList({
		resource: 'users',
		filters: [
			{ field: 'date_created', operator: 'gte', value: today.toISOString() },
		],
		pagination: { mode: 'off' },
	})

	const { data: yesterdayUsers, isLoading: isLoadingYesterdayUsers } = useList({
		resource: 'users',
		filters: [
			{
				field: 'date_created',
				operator: 'gte',
				value: yesterday.toISOString(),
			},
		],
		pagination: { mode: 'off' },
	})

	const calculateTotal = (orders: any[] = []): number => {
		return orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0)
	}

	// 计算今日和昨日总金额
	const todayTotal = calculateTotal(todayOrders?.data)
	const yesterdayTotal = calculateTotal(yesterdayOrders?.data)

	// 计算增长率
	const growthRate = yesterdayTotal
		? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100
		: 0

	// 計算未出貨訂單數量
	const unshippedOrders =
		orders?.data?.filter((order) => order.status === 'unshipped').length || 0
	const todayUnshippedOrders =
		todayOrders?.data?.filter((order) => order.status === 'unshipped').length ||
		0
	const yesterdayUnshippedOrders =
		yesterdayOrders?.data?.filter((order) => order.status === 'unshipped')
			.length || 0
	const unshippedGrowthRate = yesterdayUnshippedOrders
		? ((todayUnshippedOrders - yesterdayUnshippedOrders) /
				yesterdayUnshippedOrders) *
			100
		: 0

	// 計算今日和昨日新增用戶數量
	const todayNewUsers = todayUsers?.data?.length || 0
	const yesterdayNewUsers = yesterdayUsers?.data?.length || 0
	const newUserGrowthRate = yesterdayNewUsers
		? ((todayNewUsers - yesterdayNewUsers) / yesterdayNewUsers) * 100
		: 0

	// 計算所有未付款訂單金額
	const unpaidTotal = orders?.data
		?.filter((order) => order.status === 'unpaid')
		.reduce((sum, order) => sum + parseFloat(order.total || 0), 0)
	const todayUnpaidTotal =
		todayOrders?.data
			?.filter((order) => order.status === 'unpaid')
			.reduce((sum, order) => sum + parseFloat(order.total || 0), 0) || 0
	const yesterdayUnpaidTotal =
		yesterdayOrders?.data
			?.filter((order) => order.status === 'unpaid')
			.reduce((sum, order) => sum + parseFloat(order.total || 0), 0) || 0
	const unpaidGrowthRate = yesterdayUnpaidTotal
		? ((todayUnpaidTotal - yesterdayUnpaidTotal) / yesterdayUnpaidTotal) * 100
		: 0

	if (
		isLoadingOrders ||
		isLoadingToday ||
		isLoadingYesterday ||
		isLoadingTodayUsers ||
		isLoadingYesterdayUsers
	)
		return <div>載入中...</div>

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
							<div className="font-bold text-md">今日營收</div>
							<div className="font-bold text-2xl">
								${todayTotal.toLocaleString()}
							</div>
							<div
								className="font-bold text-md"
								style={{ color: growthRate >= 0 ? colorSuccess : colorError }}
							>
								{growthRate >= 0 ? '+' : '-'} {growthRate.toFixed(2)}% 相比昨天
							</div>
						</Flex>
						<div className="w-1/12">
							<RiMoneyDollarCircleLine size={20} />
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
							<div className="font-bold text-md">今日新增用戶</div>
							<div className="font-bold text-2xl">{todayNewUsers}</div>
							<div
								className="font-bold text-md"
								style={{
									color: newUserGrowthRate >= 0 ? colorSuccess : colorError,
								}}
							>
								{newUserGrowthRate >= 0 ? '+' : '-'}{' '}
								{newUserGrowthRate.toFixed(2)}% 相比昨天
							</div>
						</Flex>
						<div className="w-1/12">
							<LuUsers size={20} />
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
							<div className="font-bold text-md">訂單未出貨</div>
							<div className="font-bold text-2xl">{unshippedOrders}</div>
							<div
								className="font-bold text-md"
								style={{
									color: unshippedGrowthRate >= 0 ? colorSuccess : colorError,
								}}
							>
								{unshippedGrowthRate >= 0 ? '+' : '-'}{' '}
								{unshippedGrowthRate.toFixed(2)}% 相比昨天
							</div>
						</Flex>
						<div className="w-1/12">
							<LiaShippingFastSolid size={20} />
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
							<div className="font-bold text-md">訂單未付款</div>
							<div className="font-bold text-2xl">
								${unpaidTotal?.toLocaleString()}
							</div>
							<div
								className="font-bold text-md"
								style={{
									color: unpaidGrowthRate >= 0 ? colorSuccess : colorError,
								}}
							>
								{unpaidGrowthRate >= 0 ? '+' : '-'}{' '}
								{unpaidGrowthRate.toFixed(2)}% 相比昨天
							</div>
						</Flex>
						<div className="w-1/12">
							<MdOutlinePayments size={20} />
						</div>
					</Flex>
				</Card>
			</Col>
		</Row>
	)
}

export default DashboardCards
