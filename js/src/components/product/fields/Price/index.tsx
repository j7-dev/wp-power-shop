import { Form, Input } from 'antd'
import { RangePicker } from 'antd-toolkit'

const { Item } = Form

export const Price = ({ id }: { id?: string }) => {
	return (
		<>
			<Item name={id ? [id, 'regular_price'] : ['regular_price']} label="原價">
				<Input className="w-full" size="small" allowClear addonAfter="元" />
			</Item>
			<Item name={id ? [id, 'sale_price'] : ['sale_price']} label="折扣價">
				<Input className="w-full" size="small" allowClear addonAfter="元" />
			</Item>
			<RangePicker
				formItemProps={{
					name: id ? [id, 'sale_date_range'] : ['sale_date_range'],
					label: '期間',
				}}
				rangePickerProps={{
					size: 'small',
				}}
			/>
		</>
	)
}
