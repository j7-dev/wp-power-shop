import { Tabs, TabsProps, Card } from 'antd'
import { useWoocommerce } from '@/hooks'
import { SortableTree, SortableList, EditForm } from '@/components/term'

export const ProductAttributes = () => {
	const { product_attributes = [] } = useWoocommerce()
	return (
		<Card title="全局商品屬性">
			<Tabs
				items={
					product_attributes?.map((taxonomy) => {
						const { value, label, hierarchical } = taxonomy
						return {
							key: value,
							label: label,
							children: hierarchical ? (
								<SortableTree taxonomy={taxonomy} Edit={EditForm} />
							) : (
								<SortableList taxonomy={taxonomy} Edit={EditForm} />
							),
						}
					}) as TabsProps['items']
				}
			/>
		</Card>
	)
}
