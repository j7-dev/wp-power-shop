import { memo } from 'react'
import {
	Form,
	Tooltip,
	Statistic,
	Button,
	Select,
	Space,
	Tabs,
	TabsProps,
} from 'antd'
import { DEFAULT_IMAGE } from '@/utils'
import { useSelect } from '@refinedev/antd'
import { useRecord } from '@/pages/admin/Users/Edit/hooks'
import { OrderNotes } from '@/components/order'

import {
	CreditCardOutlined,
	TruckOutlined,
	SwapOutlined,
	ShoppingCartOutlined,
} from '@ant-design/icons'
import {
	// termToOptions,
	defaultSelectProps,
	Heading,
} from 'antd-toolkit'
import { UserName } from 'antd-toolkit/wp'
import Basic from './Basic'
import AutoFill from './AutoFill'
import Meta from './Meta'
import Cart from './Cart'
import RecentOrders from './RecentOrders'
import { ContactRemarks } from '@/components/user'

const SYMBOL = 'NT$'
const { Item } = Form

const items: TabsProps['items'] = [
	{
		key: 'Basic',
		label: '基本資料',
		children: <Basic />,
	},
	{
		key: 'AutoFill',
		label: '自動填入',
		children: <AutoFill />,
	},
	{
		key: 'Meta',
		label: '其他欄位',
		children: <Meta />,
	},
]

const DetailComponent = () => {
	const form = Form.useFormInstance()
	const record = useRecord()
	const {
		total_spend,
		orders_count,
		avg_order_value,
		date_last_active,
		date_last_order,
		user_registered,
		user_registered_human,
	} = record

	console.log('⭐ record:', record)

	return (
		<>
			<div className="mb-12 grid grid-cols-[2fr_1fr] gap-20">
				<div>
					<Heading className="mb-8">客戶資料</Heading>
					<div className="mb-6 flex justify-between">
						<UserName record={record} />
					</div>
					{record?.id && (
						<div className="grid grid-cols-3 gap-8">
							<Statistic
								className="mt-4"
								title="總消費金額"
								value={total_spend || 0}
								prefix={SYMBOL}
							/>
							<Statistic
								className="mt-4"
								title="總訂單數"
								value={orders_count || 0}
							/>
							<Statistic
								className="mt-4"
								title="平均每筆訂單消費"
								value={avg_order_value || 0}
								precision={2}
								prefix={SYMBOL}
							/>
							<Statistic
								className="mt-4"
								title="上次登入帳號"
								value={date_last_active || ''}
							/>
							<Statistic
								className="mt-4"
								title="上次下單時間"
								value={date_last_order || ''}
							/>
							<Statistic
								className="mt-4"
								title={`註冊時間 ${user_registered_human ? `( ${user_registered_human} )` : ''}`}
								value={user_registered || ''}
							/>
						</div>
					)}

					<Heading className="mb-8 mt-20">用戶資料</Heading>
					<Tabs items={items} />
				</div>
				<div>
					<Heading>購物車</Heading>

					<Cart />

					<Heading>最近訂單</Heading>

					<RecentOrders />

					<Heading className="mb-8">聯絡註記</Heading>

					<ContactRemarks record={record} />

					{/* <Heading className="mb-8">開立發票</Heading> */}
				</div>
			</div>
		</>
	)
}

export const Detail = memo(DetailComponent)
