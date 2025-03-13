import { memo } from 'react'
import { Form, Tooltip, Timeline, Statistic, Button } from 'antd'
import { DEFAULT_IMAGE } from '@/utils'
import {
	// termToOptions,
	// defaultSelectProps,
	Heading,
	renderHTML,
	cn,
} from 'antd-toolkit'
import { useRecord } from '@/pages/admin/Orders/Edit/hooks'
import { UserOutlined, DatabaseOutlined } from '@ant-design/icons'
import { InfoTable } from 'components/order'
import { UserName } from 'antd-toolkit/wp'
import { CreditCardOutlined, TruckOutlined } from '@ant-design/icons'

const DetailComponent = () => {
	const form = Form.useFormInstance()
	const record = useRecord()
	const {
		billing,
		shipping,
		shipping_method,
		payment_method_title,
		date_paid,
		customer,
		items,
	} = record
	console.log('⭐ record:', record)
	const order_notes = record?.order_notes?.map(
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
			<div className="mb-12 grid grid-cols-[2fr_1fr] gap-20">
				<div>
					<Heading className="mb-8">訂單資料</Heading>
					<table className="table table-sm table-fixed table-borderless text-sm w-full">
						<thead>
							<tr className="bg-gray-100">
								<th className="w-[70%] text-left">項目</th>
								<th className="w-[10%] text-right">費用</th>
								<th className="w-[10%] text-right">數量</th>
								<th className="w-[10%] text-right">總計</th>
							</tr>
						</thead>
						<tbody>
							{items?.map(
								({ id, name, image, quantity, total, product_id }) => {
									const price = Number(total) / Number(quantity)

									return (
										<tr key={id}>
											<td className="flex w-full items-center gap-x-2">
												<div className="size-10">
													<img
														className="size-10 rounded-md"
														src={image || DEFAULT_IMAGE}
														alt={name}
													/>
												</div>
												<div className="flex-1 text-left">
													<p className="m-0 text-sm">{name}</p>
													<p className="m-0 text-xs text-gray-400">
														#{product_id}
													</p>
												</div>
											</td>
											<td>{price}</td>
											<td>{quantity}</td>
											<td>{total}</td>
										</tr>
									)
								},
							)}
						</tbody>
						<tfoot style={{ borderTop: '1px solid #ddd' }}>
							<tr>
								<td></td>
								<td>項目小計</td>
								<td colSpan={2}>NT$ 36</td>
							</tr>
							<tr>
								<td className="flex justify-start items-center gap-x-2 w-full">
									<Tooltip placement="right" title="運送方式">
										<TruckOutlined className="mr-2" />

										<span>{shipping_method}</span>
									</Tooltip>
								</td>
								<td>運費</td>
								<td colSpan={2}>NT$ 98</td>
							</tr>
							<tr>
								<td className="flex justify-start items-center gap-x-2 w-full">
									<Tooltip placement="right" title="付款方式">
										<CreditCardOutlined className="mr-2" />
										<span>
											於 {date_paid} 透過 {payment_method_title} 付款，IP:{' '}
											{customer?.ip_address}
										</span>
									</Tooltip>
								</td>
								<td>訂單總額</td>
								<td colSpan={2}>NT$ 134</td>
							</tr>
						</tfoot>
					</table>
					<div className="grid grid-cols-2 gap-8 mt-8">
						<div>
							<Heading className="mb-4" size="sm" hideIcon>
								帳單資訊
							</Heading>
							<InfoTable info={billing} />
						</div>
						<div>
							<Heading className="mb-4" size="sm" hideIcon>
								運送資訊
							</Heading>
							<InfoTable info={shipping} />
						</div>
					</div>
					<Heading className="mb-8 mt-20">客戶資料</Heading>
					<div className="mb-6 flex justify-between">
						<UserName record={customer || {}} />
						<Button type="default" size="small">
							更換客戶
						</Button>
					</div>
					<div className="grid grid-cols-3 gap-8">
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
						<Statistic
							className="mt-4"
							title="上次登入帳號"
							value={customer?.date_last_active}
						/>
						<Statistic
							className="mt-4"
							title="上次下單時間"
							value={customer?.date_last_order}
						/>
						<Statistic
							className="mt-4"
							title={`註冊時間 ( ${customer?.user_registered_human} )`}
							value={customer?.user_registered}
						/>
					</div>

					{/* <Heading className="mb-8">自訂欄位</Heading>
					<Heading className="mb-8">物流資訊</Heading> */}
				</div>
				<div>
					<Heading className="mb-8">訂單備註</Heading>
					<Timeline items={order_notes} />

					{/* <Heading className="mb-8">開立發票</Heading> */}
				</div>
			</div>
		</>
	)
}

export const Detail = memo(DetailComponent)

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
