import { Form, Select, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { useProductsOptions, useWoocommerce } from '@/hooks'
import { TaxonomyModal as TaxonomyModalComponent } from '@/components/term'
import { defaultSelectProps } from 'antd-toolkit'

const { Item } = Form

/*
 * Modal + select 選擇器
 * 更複雜的選擇器，也可以直接修改 term
 */
export const TaxonomyModal = ({
	id,
	size,
}: {
	id?: string
	size?: SizeType
}) => {
	const catName = id ? [id, 'category_ids'] : ['category_ids']
	const tagName = id ? [id, 'tag_ids'] : ['tag_ids']
	const form = Form.useFormInstance()
	const watchCatIds: string[] = Form.useWatch(catName, form)
	console.log('⭐ watchCatIds:', watchCatIds)
	const watchTagIds: string[] = Form.useWatch(tagName, form)
	console.log('⭐ watchTagIds:', watchTagIds)

	const { product_cats = [], product_tags = [] } = useProductsOptions()
	const { product_taxonomies = [] } = useWoocommerce()
	const current_cats = product_cats.filter((c) =>
		watchCatIds?.includes(c.value),
	)
	const current_tags = product_tags.filter((c) =>
		watchTagIds?.includes(c.value),
	)
	return (
		<>
			{current_cats?.map(({ label }) => (
				<Tag color="blue" closable>
					{label}
				</Tag>
			))}
			<Tag
				className="border-dashed cursor-pointer"
				icon={<PlusOutlined />}
				onClick={() => {}}
			>
				分類
			</Tag>
			<Item name={catName} label="分類">
				<Select
					{...defaultSelectProps}
					size={size}
					className="w-full"
					options={product_cats}
					allowClear
				/>
			</Item>
			<Item name={tagName} label="標籤">
				<Select
					{...defaultSelectProps}
					size={size}
					className="w-full"
					options={product_tags}
					allowClear
				/>
			</Item>
			<TaxonomyModalComponent taxonomy={product_taxonomies[0]} />
		</>
	)
}
