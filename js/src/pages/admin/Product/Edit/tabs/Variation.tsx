import React, { useState, useEffect } from 'react'
import { Form, Skeleton } from 'antd'
import { useRecord } from '@/pages/admin/Product/Edit/hooks'
import { ProductEditTable } from '@/components/product'
import { TProductRecord } from '@/components/product/types'
import { useUpdateMany } from '@refinedev/core'
import {
	TFormValues,
	ZFormValues,
} from '@/components/product/ProductEditTable/types'
import { productsToFields } from '@/components/product/ProductEditTable/utils'

export const Variation = () => {
	const parentProduct = useRecord()
	const [showTable, setShowTable] = useState(false)
	const variations = parentProduct?.children || []
	console.log('⭐ variations:', variations)

	const ids = variations.map((v) => v.id)
	const [form] = Form.useForm<TFormValues>()

	// 虛擬欄位，因為 Table 組件使用虛擬列表，只會 render 部分的欄位，如果用 form.getFieldsValue() 會抓不到所有欄位值，因此使用這個欄位紀錄變化值
	const [virtualFields, setVirtualFields] =
		useState<TProductRecord[]>(variations)

	const { mutate, isLoading } = useUpdateMany({
		resource: 'products',
	})

	const handleUpdate = () => {
		// 取得 values
		const fields = productsToFields(virtualFields)
		const values = ZFormValues.array().safeParse(Object.values(fields))
		console.log('⭐ values:', values)

		// mutate({
		// 	ids,
		// 	values,
		// 	successNotification: (data) => {
		// 		return {
		// 			message: `商品 ${ids?.map((id: string) => `#${id}`).join(', ')} 已修改成功`,
		// 			type: 'success',
		// 		}
		// 	},
		// })
	}

	useEffect(() => {
		const delay = setTimeout(() => {
			setShowTable(true)
			setVirtualFields(variations)
		}, 500)
		return () => clearTimeout(delay)
	}, [])

	return (
		<>
			{!showTable && <Skeleton active />}
			{showTable && (
				<ProductEditTable
					context="detail"
					form={form}
					virtualFields={virtualFields}
					setVirtualFields={setVirtualFields}
				/>
			)}
		</>
	)
}
