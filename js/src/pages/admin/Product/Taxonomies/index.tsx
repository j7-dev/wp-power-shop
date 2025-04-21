import { Tabs, TabsProps, Card } from 'antd'
import { useWoocommerce } from '@/hooks'
import { SortableTree, EditForm } from '@/components/term'

export const ProductTaxonomies = () => {
	const { product_taxonomies = [] } = useWoocommerce()
	return (
		<Card>
			<Tabs
				items={
					product_taxonomies?.map((taxonomy) => {
						const { value, label, hierarchical } = taxonomy
						return {
							key: value,
							label: label,
							children: <SortableTree taxonomy={taxonomy} Edit={EditForm} />,
						}
					}) as TabsProps['items']
				}
			/>
		</Card>
	)
}
