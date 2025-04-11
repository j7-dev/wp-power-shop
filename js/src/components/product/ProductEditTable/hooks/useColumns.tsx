import { Table, TableProps } from 'antd'
import { TProductRecord, TProductVariation } from '@/pages/admin/Product/types'
import { useWindowSize } from '@uidotdev/usehooks'
import { useWoocommerce } from '@/hooks'
import {
	Status,
	Price,
	Size,
	Stock,
	PurchaseNote,
	Other,
} from '@/components/product/ProductEditTable/fields'
import { ProductName } from 'antd-toolkit/wp'

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
			width: 100,
			fixed: (width || 400) > 768 ? 'left' : undefined,
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
			title: `狀態`,
			dataIndex: 'status',
			width: 100,
			render: (_, _record, index) => <Status index={index} />,
		},
		{
			title: `價格 (${symbol})`,
			dataIndex: 'regular_price',
			width: 100,
			render: (_, _record, index) => <Price index={index} />,
		},
		{
			title: '庫存',
			dataIndex: 'stock',
			width: 200,
			render: (_, _record, index) => <Stock index={index} />,
		},

		{
			title: `尺寸 (${dimension_unit}) & 重量 (${weight_unit})`,
			dataIndex: 'size',
			width: 160,
			render: (_, _record, index) => <Size index={index} />,
		},
		{
			title: '購買備註',
			dataIndex: 'note',
			width: 100,
			render: (_, _record, index) => <PurchaseNote index={index} />,
		},
		{
			title: '其他',
			dataIndex: 'other',
			width: 100,
			render: (_, _record, index) => <Other index={index} />,
		},
	]

	return columns
}
