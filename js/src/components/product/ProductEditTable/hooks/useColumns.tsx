import { Table, TableProps, Form } from 'antd'
import { TProductRecord, TProductVariation } from '@/components/product/types'
import { TFormValues } from '@/components/product/ProductEditTable/types'
import { useWindowSize } from '@uidotdev/usehooks'
import { useWoocommerce } from '@/hooks'
import {
	Gallery,
	Status,
	Price,
	Size,
	Sku,
	Stock,
	PurchaseNote,
	Other,
	Taxonomy,
} from '@/components/product/fields'
import {
	ProductName,
	isVariable,
	isVariation,
	TProductType,
} from 'antd-toolkit/wp'

const { Item } = Form

export const useColumns = ({
	context,
	onValuesChange,
}: {
	context?: 'detail'
	onValuesChange: (
		changedValues: {
			[key: string]: Partial<TFormValues>
		},
		allValues: TFormValues[],
	) => void
}) => {
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
					<div className="flex gap-x-4 items-center">
						<Gallery
							id={record.id}
							limit={1}
							size="small"
							onValuesChange={onValuesChange}
						/>
						<ProductName<TProductRecord>
							hideImage
							record={record}
							onClick={
								isVariation(record?.type as string)
									? undefined
									: () => {
											window.open(`${record.permalink}`, '_blank')
										}
							}
						/>
					</div>
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
				isVariation(type as string) ? null : <Status id={id} size="small" />,
		},
		{
			title: `價格 (${symbol})`,
			dataIndex: 'regular_price',
			width: 100,
			render: (_, { id, type }) =>
				isVariable(type as string) || 'grouped' === type ? null : (
					<Price id={id} type={type as TProductType} size="small" />
				),
		},
		{
			title: '庫存',
			dataIndex: 'stock',
			width: 200,
			render: (_, { id, type }) => {
				// 組合商品 & 外部/加盟商品不顯示庫存
				if (['grouped', 'external'].includes(type as string)) {
					return null
				}
				return (
					<div className="grid grid-cols-2 gap-x-2">
						<Stock id={id} size="small" />
					</div>
				)
			},
		},
		{
			title: `尺寸 (${dimension_unit}) & 重量 (${weight_unit})`,
			dataIndex: 'size',
			width: 160,
			render: (_, { id, type }) => {
				return (
					<div className="grid grid-cols-2 gap-x-2">
						<Sku id={id} size="small" />
						{/* 組合商品 & 外部/加盟商品不顯示尺寸 */}
						{!['grouped', 'external'].includes(type as string) && (
							<Size id={id} size="small" />
						)}
					</div>
				)
			},
		},
		{
			title: '分類/標籤',
			dataIndex: 'category_ids',
			width: 120,
			render: (_, { id, type }) =>
				isVariation(type as string) ? null : <Taxonomy id={id} size="small" />,
		},
		{
			title: '購買備註',
			dataIndex: 'note',
			width: 100,
			render: (_, { id, type }) => {
				// 組合商品 & 外部/加盟商品不顯示購買備註
				if (['grouped', 'external'].includes(type as string)) {
					return null
				}
				const name = isVariation(type as string)
					? '_variation_description'
					: 'purchase_note'
				return <PurchaseNote id={id} name={name} size="small" />
			},
		},
		{
			title: '其他',
			dataIndex: 'other',
			width: 80,
			render: (_, { id, type }) => (
				<div className="grid grid-cols-2 gap-x-2">
					<Other id={id} type={type as TProductType} size="small" />
				</div>
			),
		},
	]

	//  依照不同 context 回傳不同的 columns
	// detail 頁面 Variation 的 columns 不顯示 status 和 category_ids
	if ('detail' === context) {
		return columns?.filter((c, index) => {
			// @ts-ignore
			return index !== 0 && !['status', 'category_ids'].includes(c?.dataIndex)
		})
	}

	return columns
}
