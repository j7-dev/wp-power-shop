import { Form, InputNumber, Select } from 'antd'

const { Item } = Form

export const Size = ({ id }: { id: string }) => {
	return (
		<>
			<div className="grid grid-cols-2 gap-x-2">
				<Item name={[id, 'length']} label="長">
					<InputNumber size="small" className="w-full" />
				</Item>
				<Item name={[id, 'width']} label="寬">
					<InputNumber size="small" className="w-full" />
				</Item>
				<Item name={[id, 'height']} label="高">
					<InputNumber size="small" className="w-full" />
				</Item>
				<Item name={[id, 'weight']} label="重">
					<InputNumber size="small" className="w-full" />
				</Item>
				<Item name={[id, 'shipping_class_id']} label="運送類別">
					<Select size="small" className="w-full" options={[]} allowClear />
				</Item>
			</div>
		</>
	)
}
