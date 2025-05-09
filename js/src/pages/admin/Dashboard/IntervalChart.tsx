import { Card, Row, Col, Spin } from 'antd'
import * as echarts from 'echarts'
import { useRef, useEffect } from 'react'
import { useDashboard } from '@/pages/admin/Dashboard/hooks'
import { getLabels } from '@/pages/admin/Dashboard/utils'
import { useWindowSize } from '@uidotdev/usehooks'
import { debounce } from 'lodash-es'
import { useWoocommerce } from '@/hooks'
import { useColor } from 'antd-toolkit'

const IntervalChart = () => {
	const {
		currency: { symbol },
	} = useWoocommerce()
	const { dashboard, isFetching, query } = useDashboard()
	const { intervals } = dashboard
	const { label } = getLabels(query)
	const { colorPrimary } = useColor()
	const chartRef = useRef<HTMLDivElement>(null)
	const chartInstance = useRef<echarts.ECharts>()
	const { width } = useWindowSize()

	// 監聽視窗大小變化
	useEffect(() => {
		// 當視窗大小變化時，重新調整圖表大小
		debounce(() => {
			if (chartInstance.current) {
				chartInstance.current.resize()
			}
		}, 700)()
	}, [width])

	// 初始化圖表
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
				itemGap: 32, // 控制圖例項目之間的間距
			},
			grid: {
				top: 80,
				left: 90,
				right: 60,
				bottom: 0,
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
					nameLocation: 'middle',
					nameGap: 90,
					nameTextStyle: {
						fontWeight: 'bold',
					},
					axisLabel: {
						formatter: `${symbol} {value}`,
					},
				},
				{
					type: 'value',
					name: '訂單數量',
					nameLocation: 'middle',
					nameGap: 60,
					nameTextStyle: {
						fontWeight: 'bold',
					},
					position: 'right',
					splitLine: {
						show: false,
					},
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
						color: '#2db7f5',
					},
					// smooth: true,
				},
			],
		}

		chart.setOption(initialOption)

		return () => {
			chart.dispose()
		}
	}, [])

	// 更新圖表資料
	useEffect(() => {
		if (!chartInstance.current || isFetching) return
		const option = {
			xAxis: {
				// 時間區間 string[]
				data: intervals.map((interval) => interval?.interval || ''),
			},
			series: [
				{
					// 金額 number[]
					data: intervals.map((interval) => interval?.total_sales || 0),
				},
				{
					// 數量 number[]
					data: intervals.map((interval) => interval?.orders_count || 0),
				},
			],
		}

		chartInstance.current.setOption(option)
	}, [isFetching, JSON.stringify(query)])

	return (
		<Row gutter={[16, 16]} className="w-full">
			<Col xs={24} sm={24} md={24} xl={24}>
				<Card className="w-full h-full" variant="borderless">
					<h3 className="text-sm text-gray-400 mb-2">
						{label}銷售趨勢{label === '今日' ? ' (24hr) ' : ''}
					</h3>
					<Spin spinning={isFetching}>
						<div ref={chartRef} className="w-full h-[35rem]" />
					</Spin>
				</Card>
			</Col>
		</Row>
	)
}

export default IntervalChart
