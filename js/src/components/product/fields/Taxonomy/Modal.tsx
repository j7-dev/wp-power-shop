import { Form, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { TTaxonomy } from 'antd-toolkit/wp'
import { useProductsOptions } from '@/hooks'
import {
	TaxonomyModal as TaxonomyModalComponent,
	useTaxonomyModal,
} from '@/components/term'

const { Item } = Form

/*
 * Modal + select 選擇器
 * 更複雜的選擇器，也可以直接修改 term
 */
export const TaxonomyModal = ({
	type,
	taxonomy,
	name,
}: {
	type: 'product_cat' | 'product_tag'
	taxonomy: TTaxonomy
	name: string
}) => {
	const isCat = type === 'product_cat'
	const form = Form.useFormInstance()
	const watchIds: string[] = Form.useWatch(name, form) || []

	const { show, modalProps, sortableTreeListProps } = useTaxonomyModal(name)

	const { product_cats = [], product_tags = [] } = useProductsOptions()
	const items = isCat ? product_cats : product_tags
	const current_items = items.filter((c) => watchIds?.includes(c.value))

	const handleCloseItem = (value: string) => {
		form.setFieldValue(
			name,
			watchIds.filter((id) => id !== value),
		)
	}

	return (
		<div className="mb-4">
			<label className="text-sm font-normal inline-block pb-2">
				{taxonomy.label}
			</label>
			<div className="flex flex-wrap gap-y-2">
				{current_items?.map(({ label, value }) => (
					<Tag
						key={value}
						color={isCat ? 'blue' : 'default'}
						bordered={true}
						closable
						onClose={() => handleCloseItem(value)}
					>
						{isCat ? label : `#${label}`}
					</Tag>
				))}
				<Tag
					className="border-dashed cursor-pointer"
					icon={<PlusOutlined />}
					onClick={show}
				>
					{taxonomy.label}
				</Tag>
			</div>
			<TaxonomyModalComponent
				modalProps={modalProps}
				taxonomy={taxonomy}
				initialValue={watchIds}
				sortableTreeListProps={sortableTreeListProps}
			/>
			<Item name={name} hidden />
		</div>
	)
}
