import { Table, TableProps, Tag } from 'antd'
import { TProductRecord, TProductVariation } from '@/types'
import {
	ProductName,
	ProductPrice,
	ProductTotalSales,
	ProductCat,

	// ProductBoundCourses,
	ProductType,
	POST_STATUS,
	ProductBoundItems,
} from 'antd-toolkit/wp'

const useColumns = () => {
	const columns: TableProps<TProductRecord | TProductVariation>['columns'] = [
		Table.SELECTION_COLUMN,
		Table.EXPAND_COLUMN,
		{
			title: '商品名稱',
			dataIndex: 'name',
			width: 300,
			render: (_, record) => (
				<ProductName<TProductRecord>
					record={record}
					onClick={
						'variation' === record?.type
							? undefined
							: () => {
									window.open(`${record.permalink}`, '_blank')
								}
					}
				/>
			),
		},
		{
			title: '商品類型',
			dataIndex: 'type',
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
			title: '綁定的知識庫',
			dataIndex: 'bound_docs_data',
			width: 320,

			render: (data) => {
				const items = Array.isArray(data) ? data : []
				return <ProductBoundItems items={items} />
			},
		},
		{
			title: '商品分類 / 商品標籤',
			dataIndex: 'category_ids',
			render: (_, record) => <ProductCat record={record} />,
		},
	]

	return columns
}

export default useColumns
