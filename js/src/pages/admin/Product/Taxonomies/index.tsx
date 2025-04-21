import { Tabs, TabsProps } from 'antd'
import { useWoocommerce } from '@/hooks'
import { SortableTree } from '@/components/term'

export const ProductTaxonomies = () => {
	const { product_taxonomies = [] } = useWoocommerce()
	return (
		<Tabs
			items={
				product_taxonomies?.map((taxonomy) => {
					const { value, label, hierarchical } = taxonomy
					return {
						key: value,
						label: label,
						children: <SortableTree taxonomy={taxonomy} />,
					}
				}) as TabsProps['items']
			}
		/>
	)
}
