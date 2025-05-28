import { FormItemProps } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { TaxonomyModal } from '@/components/product/fields/Taxonomy/Modal'
import { useWoocommerce } from 'antd-toolkit/wp'

/*
 * Modal + select 選擇器
 * 更複雜的選擇器，也可以直接修改 term
 */
export const TaxonomyModals = ({
	id,
	size,
}: {
	id?: string
	size?: SizeType
}) => {
	// ----- ▼ 取得商品分類和標籤的 taxonomy ----- //
	const { product_taxonomies = [] } = useWoocommerce()
	const taxonomies = (['product_cat', 'product_tag'] as const).map((type) => {
		const taxonomy = product_taxonomies.find(({ value }) => value === type)
		const keyName = type === 'product_cat' ? 'category_ids' : 'tag_ids'
		return {
			type,
			taxonomy,
			name: id ? [id, keyName] : ([keyName] as FormItemProps['name']),
		}
	})

	return taxonomies.map(({ type, taxonomy, name }) =>
		taxonomy ? (
			<TaxonomyModal key={type} type={type} taxonomy={taxonomy} name={name} />
		) : null,
	)
}
