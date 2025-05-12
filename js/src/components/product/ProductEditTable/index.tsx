import { useEffect, useState, memo } from 'react'
import { Table, TableProps, Form, Switch, FormInstance } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { TProductRecord } from '@/components/product/types'
import { TFormValues } from '@/components/product/ProductEditTable/types'
import { useColumns } from '@/components/product/ProductEditTable/hooks'
import { useWindowSize } from '@uidotdev/usehooks'
import {
	productsToFields,
	handleValuesChange,
} from '@/components/product/ProductEditTable/utils'
import { defaultTableProps } from 'antd-toolkit'

/**
 * 產品批量編輯表格組件
 *
 * 此組件用於顯示和編輯產品資料，支援批量編輯功能。
 * 包含同步修改模式，可將變更套用至所有選取的產品。
 *
 * @module ProductEditTable
 * @component
 * @param {Object} props - 組件屬性
 * @param {FormInstance} props.form - Ant Design 表單實例
 * @param {TProductRecord[]} props.virtualFields - 虛擬欄位資料，用於記錄表格中所有產品的變更
 * @param {React.Dispatch<React.SetStateAction<TProductRecord[]>>} props.setVirtualFields - 更新虛擬欄位的函數
 * @returns {JSX.Element} 產品編輯表格組件
 */
const ProductEditTableComponent = ({
	form,
	virtualFields,
	setVirtualFields,
	context,
}: {
	form: FormInstance
	virtualFields: TProductRecord[] // 虛擬欄位，因為 Table 組件使用虛擬列表，只會 render 部分的欄位，如果用 form.getFieldsValue() 會抓不到所有欄位值，因此使用這個欄位紀錄變化值
	setVirtualFields: React.Dispatch<React.SetStateAction<TProductRecord[]>>
	context?: 'detail'
}) => {
	// 同步修改模式
	const [syncModeEnabled, setSyncModeEnabled] = useState(false)

	const onValuesChange = (
		changedValues: {
			[key: string]: Partial<TFormValues>
		},
		allValues: TFormValues[],
	) => {
		handleValuesChange(
			changedValues as any,
			allValues,
			syncModeEnabled,
			virtualFields,
			setVirtualFields,
			context,
		)
	}

	const columns = useColumns({ context, onValuesChange })

	useEffect(() => {
		// 組成表單資料
		const fieldsData = productsToFields(virtualFields)
		form.setFieldsValue(fieldsData)
	}, [virtualFields])

	const { height } = useWindowSize()

	return (
		<>
			<div className="flex gap-x-2 py-2 items-center">
				<Switch
					value={syncModeEnabled}
					onChange={setSyncModeEnabled}
					size="small"
					className="[&.ant-switch-checked]:bg-red-500 [&.ant-switch-checked]:hover:bg-red-400"
				/>
				{!syncModeEnabled && (
					<label>
						啟用同步修改模式，所有欄位修改，將套用至所有已選取的商品
					</label>
				)}
				{syncModeEnabled && (
					<label className="text-red-500 font-bold">
						<ExclamationCircleFilled className="mr-2" />
						同步修改模式啟用中，所有欄位修改，將套用至所有已選取的商品
					</label>
				)}
			</div>

			<Form form={form} layout="horizontal" onValuesChange={onValuesChange}>
				<Table
					{...(defaultTableProps as unknown as TableProps<TProductRecord>)}
					dataSource={virtualFields}
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

export const ProductEditTable = memo(
	ProductEditTableComponent,
) as typeof ProductEditTableComponent
