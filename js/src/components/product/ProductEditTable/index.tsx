import { useEffect, useState, memo } from 'react'
import { Table, TableProps, Form, Switch, FormInstance } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { TProductRecord } from '@/pages/admin/Product/types'
import { TFormValues } from '@/components/product/ProductEditTable/types'
import { useColumns } from '@/components/product/ProductEditTable/hooks'
import { useWindowSize } from '@uidotdev/usehooks'
import { produce } from 'immer'
import {
	productsToFields,
	mutateProduct,
} from '@/components/product/ProductEditTable/utils'
import { defaultTableProps } from 'antd-toolkit'
import { isVariation } from 'antd-toolkit/wp'

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
}: {
	form: FormInstance
	virtualFields: TProductRecord[] // 虛擬欄位，因為 Table 組件使用虛擬列表，只會 render 部分的欄位，如果用 form.getFieldsValue() 會抓不到所有欄位值，因此使用這個欄位紀錄變化值
	setVirtualFields: React.Dispatch<React.SetStateAction<TProductRecord[]>>
}) => {
	// 同步修改模式
	const [syncModeEnabled, setSyncModeEnabled] = useState(false)
	const columns = useColumns()

	useEffect(() => {
		// 組成表單資料
		const fieldsData = productsToFields(virtualFields)
		form.setFieldsValue(fieldsData)
	}, [virtualFields])

	const { height } = useWindowSize()

	const handleValuesChange = (
		changedValues: Partial<TFormValues>[],
		allValues: TFormValues[],
	) => {
		try {
			const changedProductId = Object.keys(changedValues)[0]
			//@ts-ignore
			const changedProductType = allValues?.[changedProductId]?.type

			// @ts-ignore
			const changedObj = changedValues?.[changedProductId]
			const changedKey = Object.keys(changedObj)[0]
			const changedValue = changedObj?.[changedKey]

			const changedFields = produce(virtualFields, (draft) => {
				if (syncModeEnabled) {
					draft.forEach((product, index) => {
						// 如果是改狀態
						if ('status' === changedKey) {
							// 且不是改變體，就只改非變體商品的狀態
							if (!isVariation(changedProductType)) {
								// @ts-ignore
								product[changedKey] = changedValue
								return
							}

							// 是變體，則只改變體商品的狀態
							if (isVariation(changedProductType)) {
								if (product?.children?.length) {
									product?.children?.forEach((variation, index) => {
										// @ts-ignore
										product.children[index][changedKey] = changedValue
									})
								}
								return
							}
						}

						// 狀態以外就都可以改
						// 如果修改狀態以外，則需要同步更新所有商品
						mutateProduct({
							changedKey,
							changedValue,
							product,
						})

						// 如果是可變商品，則需要同步更新所有變體
						if (product?.children?.length) {
							product?.children?.forEach((variation) => {
								mutateProduct({
									changedKey,
									changedValue,
									product: variation,
								})
							})
						}
					})
				}

				if (!syncModeEnabled) {
					if (isVariation(changedProductType)) {
						// 是變體，要找到可變商品裡面 children 的 變體位置
						// 先從 allValues 中找到變體，再拿出 parent_id 找到所屬的可變商品
						// @ts-ignore
						const parentId = allValues?.[changedProductId]?.parent_id
						const findRowIndex = virtualFields.findIndex(
							(product) => product.id === parentId,
						)
						const findVariationIndex =
							draft[findRowIndex]?.children?.findIndex(
								(variation) => variation.id === changedProductId,
							) || 0

						mutateProduct({
							changedKey,
							changedValue,
							product: draft?.[findRowIndex]?.children?.[findVariationIndex],
						})
						return
					}
					// 非變體，直接找到 row 位置修改就好
					const findRowIndex = virtualFields.findIndex(
						(product) => product.id === changedProductId,
					)

					mutateProduct({
						changedKey,
						changedValue,
						product: draft?.[findRowIndex],
					})
				}
			})
			setVirtualFields(changedFields)
		} catch (error) {
			console.error('更新失敗，immer 賦值 draft 失敗')
			console.error(error)
		}
	}

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

			<Form form={form} layout="horizontal" onValuesChange={handleValuesChange}>
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
