import { useOne, useList } from '@refinedev/core'
import { Card, Flex, Row, Col, Table } from 'antd'
import { useEnv } from 'antd-toolkit'
import { LiaShippingFastSolid } from 'react-icons/lia'
import { LuUsers } from 'react-icons/lu'
import { MdOutlinePayments } from 'react-icons/md'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'
import { TUserDetails } from '../Users/types'
import dayjs from 'dayjs'
import * as echarts from 'echarts';
import { useRef, useEffect, useState } from 'react';
import { useColor } from 'antd-toolkit'

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
    const { colorSuccess, colorError } = useColor()
    const today = dayjs().startOf('day')
    const yesterday = today.subtract(1, 'day')
    
    const { data: todayOrders, isLoading: isLoadingToday } = useList({
        resource: 'orders',
        filters: [
            {
                field: 'date_created',
                operator: 'gte',
                value: today.toISOString(),
            },
        ],
        pagination: { mode: 'off' }
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
        pagination: { mode: 'off' }
    })

    const calculateTotal = (orders: any[] = []) => {
        return orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0)
    }

    // 计算今日和昨日总金额
    const todayTotal = calculateTotal(todayOrders?.data)
    const yesterdayTotal = calculateTotal(yesterdayOrders?.data)

    // 计算增长率
    const growthRate = yesterdayTotal ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100 : 0

    if (isLoadingToday || isLoadingYesterday) return <div>載入中...</div>

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
                            <div className="font-bold text-md" style={{ color: growthRate >= 0 ? colorSuccess : colorError }}>
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
                            <div className="font-bold text-2xl">4,567</div>
                            <div className="font-bold text-md" style={{ color: colorSuccess }}>
                                +8.5% 相比昨天
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
                            <div className="font-bold text-2xl">67</div>
                            <div className="font-bold text-md" style={{ color: colorSuccess }}>
                                +5.5% 相比昨天
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
                            <div className="font-bold text-2xl">$34,567</div>
                            <div className="font-bold text-md" style={{ color: colorError }}>
                                -12.5% 相比昨天
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

const RecentMonthlySales = () => {
    const { colorPrimary, colorSuccess } = useColor()
	const monthStart = dayjs().startOf('month')
	const monthEnd = dayjs().endOf('month')

	const chartRef = useRef<HTMLDivElement>(null)
	const chartInstance = useRef<echarts.ECharts>()
	const [chartHeight, setChartHeight] = useState(400)

	// 生成模拟数据
	const generateMockData = () => {
		const mockData = []
		const daysInMonth = monthEnd.diff(monthStart, 'day') + 1
		
		for (let i = 0; i < daysInMonth; i++) {
			const date = monthStart.clone().add(i, 'day')
			// 生成随机订单数量 (1-20)
			const orderCount = Math.floor(Math.random() * 20) + 1
			// 生成随机销售金额 (1000-50000)
			const total = Math.floor(Math.random() * 49000) + 1000
			
			mockData.push({
				date_created: date.toISOString(),
				total: total.toString(),
				quantity: orderCount
			})
		}
		return mockData
	}

	// 生成当前月份的所有日期
	const generateMonthDays = () => {
		const days = []
		const daysInMonth = monthEnd.diff(monthStart, 'day') + 1
		for (let i = 0; i < daysInMonth; i++) {
			days.push(monthStart.clone().add(i, 'day').format('MM-DD'))
		}
		return days
	}

	// 监听窗口大小变化
	useEffect(() => {
		const handleResize = () => {
			if (!chartRef.current) return
			const width = chartRef.current.clientWidth
			if (width < 768) {
				setChartHeight(300)
			} else if (width < 1200) {
				setChartHeight(350)
			} else {
				setChartHeight(400)
			}
		}

		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	// 初始化图表
	useEffect(() => {
		if (!chartRef.current) return

		const chart = echarts.init(chartRef.current)
		chartInstance.current = chart

		// 设置初始选项
		const initialOption = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					crossStyle: {
						color: '#999'
					}
				}
			},
			legend: {
				data: ['銷售金額', '訂單數量'],
				top: 0
			},
			grid: {
				top: 60,
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: [],
				axisPointer: {
					type: 'shadow'
				},
				axisLabel: {
					rotate: 45,
					interval: 0
				}
			},
			yAxis: [
				{
					type: 'value',
					name: '銷售金額',
					position: 'left',
					axisLabel: {
						formatter: '${value}'
					}
				},
				{
					type: 'value',
					name: '訂單數量',
					position: 'right'
				}
			],
			series: [
				{
					name: '銷售金額',
					type: 'bar',
					data: [],
					itemStyle: {
						color: colorPrimary
					}
				},
				{
					name: '訂單數量',
					type: 'line',
					yAxisIndex: 1,
					data: [],
					itemStyle: {
						color: colorSuccess
					}
				}
			]
		}

		chart.setOption(initialOption)

		return () => {
			chart.dispose()
		}
	}, [])

	// 更新图表数据
	useEffect(() => {
		if (!chartInstance.current) return

		// 生成所有日期
		const allDates = generateMonthDays()

		// 使用模拟数据
		const data = generateMockData()


		// 按日期分组数据
		const dailyData = data.reduce((acc: any, order: any) => {
			const date = dayjs(order.date_created).format('MM-DD')
			if (!acc[date]) {
				acc[date] = {
					date,
					total: 0,
					count: 0
				}
			}
			acc[date].total += parseFloat(order.total || 0)
			acc[date].count += order.quantity || 1
			return acc
		}, {})

		// 确保所有日期都有数据，没有数据的日期填充为0
		const totals = allDates.map(date => dailyData[date]?.total || 0)
		const counts = allDates.map(date => dailyData[date]?.count || 0)

		const option = {
			xAxis: {
				data: allDates
			},
			series: [
				{
					data: totals
				},
				{
					data: counts
				}
			]
		}

		chartInstance.current.setOption(option)
	}, [])


	return (
        <Row gutter={[16, 16]} className="w-full">
            <Col xs={24} sm={24} md={24} xl={24}>
                <Card className="w-full h-full">
                    <h3>本月銷售趨勢</h3>
                    <div ref={chartRef} style={{ height: `${chartHeight}px`, width: '100%' }} />
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
            <RecentMonthlySales />
		</Flex>
	)
}
