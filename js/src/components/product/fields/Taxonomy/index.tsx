import { Form, Select } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { useProductsOptions } from '@/hooks'
import { defaultSelectProps } from 'antd-toolkit'

const { Item } = Form

export const Taxonomy = ({ id, size }: { id?: string; size?: SizeType }) => {
	const { product_cats = [], product_tags = [] } = useProductsOptions()
	return (
		<>
			<Item name={id ? [id, 'category_ids'] : ['category_ids']} label="分類">
				<Select
					{...defaultSelectProps}
					size={size}
					className="w-full"
					options={product_cats}
					allowClear
				/>
			</Item>
			<Item name={id ? [id, 'tag_ids'] : ['tag_ids']} label="標籤">
				<Select
					{...defaultSelectProps}
					size={size}
					className="w-full"
					options={product_tags}
					allowClear
				/>
			</Item>
		</>
	)
}
