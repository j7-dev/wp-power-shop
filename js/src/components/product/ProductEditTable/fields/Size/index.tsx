import { Form, InputNumber, Select } from 'antd'

const { Item } = Form

export const Size = ({ index }: { index: number }) => {
	return (
		<>
			<div className="grid grid-cols-2 gap-x-2">
				<Item name={[index, 'length']} label="長">
					<InputNumber size="small" className="w-full" />
				</Item>
				<Item name={[index, 'width']} label="寬">
					<InputNumber size="small" className="w-full" />
				</Item>
				<Item name={[index, 'height']} label="高">
					<InputNumber size="small" className="w-full" />
				</Item>
				<Item name={[index, 'weight']} label="重">
					<InputNumber size="small" className="w-full" />
				</Item>
				<Item name={[index, 'shipping_class_id']} label="運送類別">
					<Select size="small" className="w-full" options={[]} allowClear />
				</Item>
			</div>
		</>
	)
}
