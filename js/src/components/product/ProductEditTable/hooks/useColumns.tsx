import { Table, TableProps, Form } from 'antd'
import { TProductRecord, TProductVariation } from '@/components/product/types'
import { useWindowSize } from '@uidotdev/usehooks'
import { useWoocommerce } from '@/hooks'
import {
	Status,
	Price,
	Size,
	Stock,
	PurchaseNote,
	Other,
	Taxonomy,
} from '@/components/product/ProductEditTable/fields'
import {
	ProductName,
	isVariable,
	isVariation,
	TProductType,
} from 'antd-toolkit/wp'

const { Item } = Form

export const useColumns = () => {
	const {
		currency: { symbol },
		dimension_unit,
		weight_unit,
	} = useWoocommerce()
	const { width } = useWindowSize()
	const columns: TableProps<TProductRecord | TProductVariation>['columns'] = [
		Table.EXPAND_COLUMN,
		{
			title: '商品名稱',
			dataIndex: 'name',
			width: 160,
			fixed: (width || 400) > 768 ? 'left' : undefined,
			render: (_, record) => (
				<>
					<ProductName<TProductRecord>
						record={record}
						onClick={
							isVariation(record?.type as string)
								? undefined
								: () => {
										window.open(`${record.permalink}`, '_blank')
									}
						}
					/>
					<Item name={[record.id, 'id']} hidden />
					<Item name={[record.id, 'type']} hidden />
					<Item name={[record.id, 'parent_id']} hidden />
				</>
			),
		},
		{
			title: `狀態`,
			dataIndex: 'status',
			width: 100,
			render: (_, { id, type }) =>
				isVariation(type as string) ? null : <Status id={id} />,
		},
		{
			title: `價格 (${symbol})`,
			dataIndex: 'regular_price',
			width: 100,
			render: (_, { id, type }) =>
				isVariable(type as string) ? null : <Price id={id} />,
		},
		{
			title: '庫存',
			dataIndex: 'stock',
			width: 200,
			render: (_, { id, type }) => <Stock id={id} />,
		},

		{
			title: `尺寸 (${dimension_unit}) & 重量 (${weight_unit})`,
			dataIndex: 'size',
			width: 160,
			render: (_, { id }) => <Size id={id} />,
		},
		{
			title: '分類/標籤',
			dataIndex: 'category_ids',
			width: 120,
			render: (_, { id, type }) =>
				isVariation(type as string) ? null : <Taxonomy id={id} />,
		},
		{
			title: '購買備註',
			dataIndex: 'note',
			width: 100,
			render: (_, { id, type }) => {
				const name = isVariation(type as string)
					? '_variation_description'
					: 'purchase_note'
				return <PurchaseNote id={id} name={name} />
			},
		},
		{
			title: '其他',
			dataIndex: 'other',
			width: 80,
			render: (_, { id, type }) => (
				<Other id={id} type={type as TProductType} />
			),
		},
	]

	return columns
}
