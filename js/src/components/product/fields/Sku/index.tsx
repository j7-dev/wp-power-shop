import { Form, Input } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'

const { Item } = Form

export const Sku = ({ id, size }: { id?: string; size?: SizeType }) => {
	return (
		<>
			<Item name={id ? [id, 'sku'] : ['sku']} label="貨號 SKU">
				<Input className="w-full" size={size} allowClear />
			</Item>
			<Item
				name={id ? [id, '_global_unique_id'] : ['_global_unique_id']}
				label="GTIN、UPC、EAN 或 ISBN"
			>
				<Input className="w-full" size={size} allowClear />
			</Item>
		</>
	)
}
