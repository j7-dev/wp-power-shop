import { Tabs, TabsProps, Card } from 'antd'
import { useWoocommerce } from '@/hooks'
import {
	SortableTree,
	useSortableTreeList,
	SortableList,
} from '@/components/term'

export const ProductTaxonomies = () => {
	const { product_taxonomies = [] } = useWoocommerce()
	const sortableTreeListProps = useSortableTreeList()
	return (
		<Card title="商品分類 / 標籤">
			<Tabs
				items={
					product_taxonomies?.map((taxonomy) => {
						const { value, label, hierarchical } = taxonomy
						return {
							key: value,
							label: label,
							children: hierarchical ? (
								<SortableTree {...sortableTreeListProps} taxonomy={taxonomy} />
							) : (
								<SortableList {...sortableTreeListProps} taxonomy={taxonomy} />
							),
						}
					}) as TabsProps['items']
				}
			/>
		</Card>
	)
}
