import { LiaShippingFastSolid } from 'react-icons/lia'
import { LuUsers } from 'react-icons/lu'
import { MdOutlinePayments } from 'react-icons/md'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'
import { Card, Row, Col, Statistic, StatisticProps } from 'antd'
import CountUp from 'react-countup'
import { useDashboard } from '@/pages/admin/Dashboard/hooks'
import { getLabels } from '@/pages/admin/Dashboard/utils'
import { useColor, TrendIndicator, cn } from 'antd-toolkit'

const DashboardCards = () => {
	const { colorPrimary } = useColor()
	const { dashboard, isFetching, query } = useDashboard()
	const {
		total_sales = 0,
		total_sales_compared = 0,
		new_registration = 0,
		new_registration_compared = 0,
		orders_count_unshipped = 0,
		orders_count_unshipped_compared = 0,
		orders_count_unpaid = 0,
		orders_count_unpaid_compared = 0,
	} = dashboard

	const formatter: StatisticProps['formatter'] = (value) => (
		<CountUp end={value as number} separator="," />
	)

	const { label, compareLabel } = getLabels(query.compare_type)

	const cardData = [
		{
			title: '營收',
			value: total_sales,
			compareValue: total_sales_compared,
			precision: 0,
			unit: '元',
			icon: <RiMoneyDollarCircleLine color={colorPrimary} size={160} />,
		},
		{
			title: '新增用戶',
			value: new_registration,
			compareValue: new_registration_compared,
			precision: 0,
			unit: '人',
			icon: <LuUsers color={colorPrimary} size={160} />,
		},
		{
			title: '訂單未出貨',
			value: orders_count_unshipped,
			compareValue: orders_count_unshipped_compared,
			precision: 0,
			unit: '筆',
			icon: <LiaShippingFastSolid color={colorPrimary} size={160} />,
		},
		{
			title: '訂單未付款',
			value: orders_count_unpaid,
			compareValue: orders_count_unpaid_compared,
			precision: 0,
			unit: '筆',
			icon: <MdOutlinePayments color={colorPrimary} size={160} />,
		},
	]

	return (
		<Row gutter={[16, 16]} className="w-full">
			{cardData.map(({ title, value, compareValue, unit, icon, precision }) => (
				<Col key={title} xs={24} sm={12} md={12} xl={6}>
					<Card
						className={cn(
							'w-full h-full relative overflow-hidden',
							isFetching ? 'animate-pulse grayscale' : '',
						)}
						variant="borderless"
					>
						<Statistic
							className="text-right"
							title={`${label}${title}`}
							value={value}
							precision={precision}
							valueStyle={{ color: colorPrimary }}
							formatter={formatter}
							prefix={
								<div className="text-base mr-2 relative top-0.5">
									<TrendIndicator
										tooltipProps={{
											title: compareLabel,
										}}
										value={value}
										compareValue={compareValue}
									/>
								</div>
							}
							suffix={<span className="text-sm text-gray-400">{unit}</span>}
						/>
						<div className="absolute -left-14 -bottom-8 z-0 opacity-20">
							{icon}
						</div>
					</Card>
				</Col>
			))}
		</Row>
	)
}

export default DashboardCards
