import { Form, InputNumber, Select } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { useProductsOptions } from '@/hooks'
import { useWoocommerce } from 'antd-toolkit/wp'

const { Item } = Form

export const Size = ({ id, size }: { id?: string; size?: SizeType }) => {
	const { dimension_unit, weight_unit } = useWoocommerce()
	const { product_shipping_classes = [] } = useProductsOptions()
	return (
		<>
			<Item
				name={id ? [id, 'length'] : ['length']}
				label={`長 (${dimension_unit})`}
			>
				<InputNumber size={size} className="w-full" />
			</Item>
			<Item
				name={id ? [id, 'width'] : ['width']}
				label={`寬 (${dimension_unit})`}
			>
				<InputNumber size={size} className="w-full" />
			</Item>
			<Item
				name={id ? [id, 'height'] : ['height']}
				label={`高 (${dimension_unit})`}
			>
				<InputNumber size={size} className="w-full" />
			</Item>
			<Item
				name={id ? [id, 'weight'] : ['weight']}
				label={`重 (${weight_unit})`}
			>
				<InputNumber size={size} className="w-full" />
			</Item>
			<Item
				name={id ? [id, 'shipping_class_id'] : ['shipping_class_id']}
				label="運送類別"
			>
				<Select
					size={size}
					className="w-full"
					options={product_shipping_classes}
					allowClear
				/>
			</Item>
		</>
	)
}
