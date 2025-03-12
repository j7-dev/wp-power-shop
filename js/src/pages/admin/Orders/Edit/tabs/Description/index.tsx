import { memo } from 'react'
import { Form, Tooltip, Timeline, Statistic, Button } from 'antd'
import {
	// termToOptions,
	// defaultSelectProps,
	Heading,
	renderHTML,
	cn,
} from 'antd-toolkit'
import { useRecord } from '../../hooks'
import { UserOutlined, DatabaseOutlined } from '@ant-design/icons'
import { InfoTable } from 'components/order'
import { OrderCustomerTable } from 'components/user'
import { UserName } from 'antd-toolkit/wp'

const DescriptionComponent = () => {
	const form = Form.useFormInstance()
	const record = useRecord()
	const { billing, shipping, payment_method_title, date_paid, customer } =
		record
	console.log('⭐ record:', record)
	const items = record?.order_notes?.map(
		({ content, date_created, customer_note, added_by }) => ({
			children: (
				<div
					className={cn(
						'p-4 relative',
						customer_note ? 'bg-yellow-50' : 'bg-blue-50',
					)}
				>
					{renderHTML(content)}
					<p className="text-xs text-gray-400 mb-0">{date_created} 刪除備註</p>
					<div
						className={cn(
							'absolute -top-2 -right-2 text-white px-2 py-1 text-xs',
							customer_note ? 'bg-yellow-500' : 'bg-blue-500',
						)}
					>
						{customer_note ? '客戶備註' : '內部備註'}
					</div>
				</div>
			),
			dot: getDot(added_by),
		}),
	)

	return (
		<>
			<div className="mb-12 grid grid-cols-[2fr_1fr] gap-8">
				<div>
					<Heading className="mb-8">訂單資料</Heading>於 {date_paid} 透過{' '}
					{payment_method_title} 付款
					<div className="grid grid-cols-2 gap-8">
						<div>
							<Heading className="mb-4" size="sm">
								帳單資訊
							</Heading>
							<InfoTable info={billing} />
						</div>
						<div>
							<Heading className="mb-4" size="sm">
								運送資訊
							</Heading>
							<InfoTable info={shipping} />
						</div>
					</div>
					<Heading className="my-8">客戶資料</Heading>
					<div className="mb-6 flex justify-between">
						<UserName record={customer || {}} />
						<Button type="default" size="small">
							更換客戶
						</Button>
					</div>
					<div className="grid grid-cols-[1fr_1fr_1fr_3fr] gap-8">
						<Statistic
							className="mt-4"
							title="總消費金額"
							value={customer?.total_spend}
						/>
						<Statistic
							className="mt-4"
							title="總訂單數"
							value={customer?.orders_count}
						/>
						<Statistic
							className="mt-4"
							title="平均每筆訂單消費"
							value={customer?.avg_order_value}
							precision={2}
						/>
						<div className="mt-4">
							<OrderCustomerTable customer={customer} />
						</div>
					</div>
				</div>
				<div>
					<Heading className="mb-8">訂單備註</Heading>
					<Timeline items={items} />
				</div>
			</div>
		</>
	)
}

export const Description = memo(DescriptionComponent)

function getDot(added_by: string) {
	if ('system' === added_by) {
		return (
			<Tooltip title="系統備註">
				<DatabaseOutlined />
			</Tooltip>
		)
	}

	return (
		<Tooltip title={`由 ${added_by} 添加`}>
			<UserOutlined />
		</Tooltip>
	)
}
