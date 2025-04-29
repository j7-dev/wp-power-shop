import { Form, Input } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import Subscription from '@/components/product/fields/Price/Subscription'
import { useWoocommerce } from '@/hooks'
import {
	TProductType,
	isSubscription as checkIsSubscription,
} from 'antd-toolkit/wp'
import { RangePicker } from 'antd-toolkit'

const { Item } = Form

export const Price = ({
	id,
	type,
	size,
}: {
	id?: string
	type?: TProductType
	size?: SizeType
}) => {
	const {
		currency: { symbol },
	} = useWoocommerce()
	const isSubscription = checkIsSubscription(type || '')
	return (
		<>
			{isSubscription && <Subscription id={id} size={size} />}
			<Item
				name={id ? [id, 'regular_price'] : ['regular_price']}
				label={`原價 (${symbol})`}
				hidden={isSubscription}
			>
				<Input className="w-full" size={size} allowClear addonAfter="元" />
			</Item>
			<Item
				name={id ? [id, 'sale_price'] : ['sale_price']}
				label={`折扣價 (${symbol})`}
				hidden={isSubscription}
			>
				<Input className="w-full" size={size} allowClear addonAfter="元" />
			</Item>
			<RangePicker
				formItemProps={{
					name: id ? [id, 'sale_date_range'] : ['sale_date_range'],
					label: '期間',
				}}
				rangePickerProps={{
					size,
				}}
			/>
		</>
	)
}
