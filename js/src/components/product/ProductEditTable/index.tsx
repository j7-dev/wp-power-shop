import { useEffect, useState, memo, useDeferredValue } from 'react'
import { Table, TableProps, Form, Switch } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { TProductRecord } from '@/pages/admin/Product/types'
import { useColumns } from '@/components/product/ProductEditTable/hooks'
import { useWindowSize } from '@uidotdev/usehooks'
import { defaultTableProps } from 'antd-toolkit'

const ProductEditTableComponent = ({
	products,
}: {
	products: TProductRecord[]
}) => {
	const deferredProducts = useDeferredValue(products)
	const [syncModeEnabled, setSyncModeEnabled] = useState(false)
	const [form] = Form.useForm()
	const columns = useColumns()
	const productIds = deferredProducts.map((product) => product.id)

	useEffect(() => {
		form.setFieldsValue(deferredProducts)
	}, [
		productIds.join(','),
	])

	const { height } = useWindowSize()

	return (
		<>
			<div className="flex gap-x-2 py-2 items-center">
				<Switch
					value={syncModeEnabled}
					onChange={setSyncModeEnabled}
					size="small"
				/>
				{!syncModeEnabled && (
					<label>啟用同步修改，所有欄位修改，將套用至所有已選取的商品</label>
				)}
				{syncModeEnabled && (
					<label className="text-red-500 font-bold">
						<ExclamationCircleFilled className="mr-2" />
						同步修改模式啟用中，所有欄位修改，將套用至所有已選取的商品
					</label>
				)}
			</div>

			<Form form={form} layout="horizontal">
				<Table
					{...(defaultTableProps as unknown as TableProps<TProductRecord>)}
					dataSource={deferredProducts}
					virtual
					pagination={false}
					columns={columns}
					scroll={{
						x: 1800,
						y: (height || 910) - 320,
					}}
					// 需要這個 field-xs class 來自訂 style
					className="field-xs [&_td]:align-baseline"
				/>
			</Form>
		</>
	)
}

export const ProductEditTable = memo(ProductEditTableComponent)
