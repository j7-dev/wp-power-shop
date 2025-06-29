import { Table, TableProps, Tag } from 'antd'
import { useNavigation } from '@refinedev/core'
import { TProductRecord, TProductVariation } from '@/components/product/types'
import { useWindowSize } from '@uidotdev/usehooks'
import { useProductsOptions } from '@/hooks'
import { ProductActions } from '@/components/product/ProductTable/ProductActions'
import {
	ProductName,
	ProductPrice,
	ProductTotalSales,
	ProductCat,
	ProductType,
	ProductStock,
	POST_STATUS,
	isVariation,
} from 'antd-toolkit/wp'

export const useColumns = () => {
	const { width } = useWindowSize()
	const { edit } = useNavigation()
	const { product_cats = [], product_tags = [] } = useProductsOptions()
	const columns: TableProps<TProductRecord | TProductVariation>['columns'] = [
		Table.SELECTION_COLUMN,
		Table.EXPAND_COLUMN,
		{
			title: '商品名稱',
			dataIndex: 'name',
			width: 300,
			fixed: (width || 400) > 768 ? 'left' : undefined,
			render: (_, record) => (
				<ProductName<TProductRecord>
					record={record}
					onClick={() => edit('products', record?.id)}
				/>
			),
		},
		{
			title: '商品類型',
			dataIndex: 'type',
			width: 180,
			render: (_, record) => <ProductType record={record as any} />,
		},
		{
			title: '狀態',
			dataIndex: 'status',
			width: 80,
			align: 'center',
			render: (_, record) => {
				const status = POST_STATUS.find((item) => item.value === record?.status)
				return <Tag color={status?.color}>{status?.label}</Tag>
			},
		},
		{
			title: '總銷量',
			dataIndex: 'total_sales',
			width: 80,
			align: 'center',
			render: (_, record) => (
				<ProductTotalSales record={record} max_sales={10} />
			),
		},
		{
			title: '價格',
			dataIndex: 'price',
			width: 150,
			render: (_, record) => <ProductPrice record={record} />,
		},
		{
			title: '庫存',
			dataIndex: 'stock',
			width: 150,
			align: 'center',
			render: (_, record) => <ProductStock<TProductRecord> record={record} />,
		},
		{
			title: '商品分類 / 商品標籤',
			dataIndex: 'category_ids',
			render: (_, { category_ids = [], tag_ids = [] }) => {
				const categories = product_cats.filter(({ value }) =>
					category_ids.includes(value),
				)
				const tags = product_tags.filter(({ value }) =>
					tag_ids?.includes(value),
				)
				return <ProductCat categories={categories} tags={tags} />
			},
		},
		{
			title: '操作',
			dataIndex: '_actions',
			align: 'center',
			width: 100,
			render: (_, record) =>
				!isVariation(record?.type as string) && (
					<ProductActions record={record} />
				),
		},
	]

	return columns
}
