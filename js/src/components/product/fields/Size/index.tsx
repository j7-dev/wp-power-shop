import { Form, InputNumber, Select, Input } from 'antd'
import { useProductsOptions } from '@/hooks'

const { Item } = Form

export const Size = ({ id }: { id?: string }) => {
	const { product_shipping_classes = [] } = useProductsOptions()
	return (
		<>
			<Item name={id ? [id, 'sku'] : ['sku']} label="貨號">
				<Input className="w-full" size="small" allowClear />
			</Item>
			<Item
				name={id ? [id, '_global_unique_id'] : ['_global_unique_id']}
				label="GTIN、UPC、EAN 或 ISBN"
			>
				<Input className="w-full" size="small" allowClear />
			</Item>
			<Item name={id ? [id, 'length'] : ['length']} label="長">
				<InputNumber size="small" className="w-full" />
			</Item>
			<Item name={id ? [id, 'width'] : ['width']} label="寬">
				<InputNumber size="small" className="w-full" />
			</Item>
			<Item name={id ? [id, 'height'] : ['height']} label="高">
				<InputNumber size="small" className="w-full" />
			</Item>
			<Item name={id ? [id, 'weight'] : ['weight']} label="重">
				<InputNumber size="small" className="w-full" />
			</Item>
			<Item
				name={id ? [id, 'shipping_class_id'] : ['shipping_class_id']}
				label="運送類別"
			>
				<Select
					size="small"
					className="w-full"
					options={product_shipping_classes}
					allowClear
				/>
			</Item>
		</>
	)
}
