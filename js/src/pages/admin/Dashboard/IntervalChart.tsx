import { Card, Row, Col } from 'antd'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { useRef, useEffect, useState } from 'react'
import { useColor } from 'antd-toolkit'

const IntervalChart = () => {
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
				quantity: orderCount,
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
						color: '#999',
					},
				},
			},
			legend: {
				data: ['銷售金額', '訂單數量'],
				top: 0,
			},
			grid: {
				top: 60,
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true,
			},
			xAxis: {
				type: 'category',
				data: [],
				axisPointer: {
					type: 'shadow',
				},
				axisLabel: {
					rotate: 45,
					interval: 0,
				},
			},
			yAxis: [
				{
					type: 'value',
					name: '銷售金額',
					position: 'left',
					axisLabel: {
						formatter: '${value}',
					},
				},
				{
					type: 'value',
					name: '訂單數量',
					position: 'right',
				},
			],
			series: [
				{
					name: '銷售金額',
					type: 'bar',
					data: [],
					itemStyle: {
						color: colorPrimary,
					},
				},
				{
					name: '訂單數量',
					type: 'line',
					yAxisIndex: 1,
					data: [],
					itemStyle: {
						color: colorSuccess,
					},
				},
			],
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
					count: 0,
				}
			}
			acc[date].total += parseFloat(order.total || 0)
			acc[date].count += order.quantity || 1
			return acc
		}, {})

		// 确保所有日期都有数据，没有数据的日期填充为0
		const totals = allDates.map((date) => dailyData[date]?.total || 0)
		const counts = allDates.map((date) => dailyData[date]?.count || 0)

		const option = {
			xAxis: {
				data: allDates,
			},
			series: [
				{
					data: totals,
				},
				{
					data: counts,
				},
			],
		}

		chartInstance.current.setOption(option)
	}, [])

	return (
		<Row gutter={[16, 16]} className="w-full">
			<Col xs={24} sm={24} md={24} xl={24}>
				<Card className="w-full h-full">
					<h3>本月銷售趨勢</h3>
					<div
						ref={chartRef}
						style={{ height: `${chartHeight}px`, width: '100%' }}
					/>
				</Card>
			</Col>
		</Row>
	)
}

export default IntervalChart
