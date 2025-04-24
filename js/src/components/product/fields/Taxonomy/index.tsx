import { Form, Select } from 'antd'
import { useProductsOptions } from '@/hooks'
import { defaultSelectProps } from 'antd-toolkit'

const { Item } = Form

export const Taxonomy = ({ id }: { id: string }) => {
	const { product_cats = [], product_tags = [] } = useProductsOptions()
	return (
		<>
			<Item name={[id, 'category_ids']} label="分類">
				<Select
					{...defaultSelectProps}
					size="small"
					className="w-full"
					options={product_cats}
					allowClear
				/>
			</Item>
			<Item name={[id, 'tag_ids']} label="標籤">
				<Select
					{...defaultSelectProps}
					size="small"
					className="w-full"
					options={product_tags}
					allowClear
				/>
			</Item>
		</>
	)
}
