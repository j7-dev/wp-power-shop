import { memo } from 'react'
import { Card, Form, Tooltip } from 'antd'
import { Line, LineConfig } from '@ant-design/plots'
import dayjs from 'dayjs'
import { TTotals, TViewTypeProps } from '../types'
import { cards, tickFilter } from '../index'
import { round } from 'lodash-es'
import {
	CaretUpOutlined,
	CaretDownOutlined,
	QuestionCircleOutlined,
} from '@ant-design/icons'

const Default = ({
	revenueData,
	lastYearRevenueData,
	form,
}: TViewTypeProps) => {
	const isLastYear = form.getFieldValue(['compare_last_year'])

	const intervals = revenueData?.intervals || []
	const lastYearIntervals = isLastYear
		? lastYearRevenueData?.intervals || []
		: []

	const watchInterval = Form.useWatch(['interval'], form)

	const config: LineConfig = {
		data: [...intervals, ...lastYearIntervals],
		xField: 'interval_compared',
		colorField: isLastYear ? 'dataLabel' : undefined,
		point: {
			shapeField: 'square',
			sizeField: 1,
		},
		style: {
			lineWidth: 2,
			shape: 'smooth',
		},
		axis: {
			y: {
				grid: true,
				gridLineWidth: 2,
				gridStroke: '#555',
			},

			x: {
				tickFilter,
				labelFilter: tickFilter,
			},
		},
	}

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
				{cards.map((card) => {
					// 檢查 revenueData?.totals 是否有 card.slug 這個 key
					if (undefined === revenueData?.totals?.[card.slug as keyof TTotals]) {
						return null
					}

					const total =
						(revenueData?.totals?.[card.slug as keyof TTotals] as number) || 0
					const lastYearTotal = isLastYear
						? (lastYearRevenueData?.totals?.[
								card.slug as keyof TTotals
							] as number) || 0
						: 0

					const isGreater = total > lastYearTotal
					const percentage = lastYearTotal
						? round(((total - lastYearTotal) / lastYearTotal) * 100, 2)
						: '∞'

					const thisYear = revenueData?.intervals?.[0]?.interval?.slice(0, 4)
					const lastYear = Number(thisYear) - 1
					return (
						<Card
							key={card.slug}
							title={
								<>
									{card.title}
									{card.tooltip && (
										<Tooltip title={card.tooltip}>
											<QuestionCircleOutlined className="ml-2 text-gray-300 cursor-pointer" />
										</Tooltip>
									)}
								</>
							}
							extra={
								<span className="text-sm text-gray-400">
									{isLastYear && (
										<Tooltip
											title={`${lastYear}年共 ${lastYearTotal.toLocaleString()} ${card.unit}`}
										>
											<span
												className={`inline-flex items-center mr-2 gap-x-1 ${isGreater ? 'text-red-500' : 'text-green-500'}`}
											>
												{isGreater ? (
													<CaretUpOutlined />
												) : (
													<CaretDownOutlined />
												)}
												{percentage}%
											</span>
										</Tooltip>
									)}
									共
									<Tooltip
										title={`${thisYear}年共 ${total.toLocaleString()} ${card.unit}`}
									>
										<span className="text-2xl text-primary font-semibold mx-2">
											{total.toLocaleString()}
										</span>
									</Tooltip>
									{card.unit}
								</span>
							}
							bordered={false}
						>
							<Line
								{...config}
								yField={card.slug}
								height={300}
								tooltip={{
									title: ({
										date_start,
										date_end,
										interval,
										interval_compared,
									}) => {
										// 如果不是今年的數據，就不顯示
										if (
											interval.slice(0, 4) !== interval_compared.slice(0, 4)
										) {
											return null
										}

										if ('day' === watchInterval) {
											return interval
										}

										if (date_start && date_end) {
											const dateStart = dayjs(date_start).format('YYYY-MM-DD')
											const dateEnd = dayjs(date_end).format('YYYY-MM-DD')
											return `${dateStart} ~ ${dateEnd}`
										}
									},
									items: [
										{ name: card.title, channel: 'y' },
									],
								}}
							/>
						</Card>
					)
				})}
			</div>
		</>
	)
}

export default memo(Default)
