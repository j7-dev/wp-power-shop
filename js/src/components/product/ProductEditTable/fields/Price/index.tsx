import { Form, Input } from 'antd'
import { RangePicker } from 'antd-toolkit'

const { Item } = Form

export const Price = ({ index }: { index: number }) => {
	return (
		<>
			<Item name={[index, 'regular_price']} label="原價">
				<Input className="w-full" size="small" allowClear addonAfter="元" />
			</Item>
			<Item name={[index, 'sale_price']} label="折扣價">
				<Input className="w-full" size="small" allowClear addonAfter="元" />
			</Item>
			<RangePicker
				formItemProps={{
					name: [index, 'sale_date_range'],
					label: '期間',
				}}
				rangePickerProps={{
					size: 'small',
				}}
			/>
		</>
	)
}
