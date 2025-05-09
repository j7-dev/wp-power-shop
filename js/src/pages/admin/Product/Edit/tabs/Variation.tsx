import React, { useState, useEffect } from 'react'
import { Form, Skeleton, Button, Popconfirm } from 'antd'
import { safeParse } from '@/utils'
import { useRecord } from '@/pages/admin/Product/Edit/hooks'
import { ProductEditTable } from '@/components/product'
import { TProductRecord } from '@/components/product/types'
import { useUpdate, useInvalidate, useCustomMutation } from '@refinedev/core'
import {
	TFormValues,
	ZFormValues,
} from '@/components/product/ProductEditTable/types'
import { productsToFields } from '@/components/product/ProductEditTable/utils'
import { notificationProps } from 'antd-toolkit/refine'

export const Variation = () => {
	const parentProduct = useRecord()
	const [showTable, setShowTable] = useState(false)
	const variations = parentProduct?.children || []

	const ids = variations.map((v) => v.id)
	const [form] = Form.useForm<TFormValues>()

	// 虛擬欄位，因為 Table 組件使用虛擬列表，只會 render 部分的欄位，如果用 form.getFieldsValue() 會抓不到所有欄位值，因此使用這個欄位紀錄變化值
	const [virtualFields, setVirtualFields] =
		useState<TProductRecord[]>(variations)

	const { mutate, isLoading } = useCustomMutation({
		resource: 'products',
	})

	const { mutate: linkVariations, isLoading: isLinkingVariations } = useUpdate({
		resource: 'products/link-variations',
	})

	const invalidate = useInvalidate()

	const handleUpdate = () => {
		// 取得 values
		const fields = productsToFields(virtualFields)
		safeParse(ZFormValues.array(), Object.values(fields))

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
	}, [variations?.map((v) => v.id)?.join(',')])

	const handleLinkVariations = () => {
		linkVariations(
			{
				id: parentProduct?.id,
				values: {},
				...notificationProps,
			},
			{
				onSuccess: () => {
					invalidate({
						resource: 'products',
						invalidates: ['detail'],
						id: parentProduct?.id,
					})
				},
			},
		)
	}

	return (
		<>
			{!showTable && <Skeleton active />}
			{showTable && (
				<>
					<Popconfirm
						title="產生所有商品規格的款式"
						onConfirm={handleLinkVariations}
						okText="確認"
						cancelText="取消"
					>
						<Button
							color="primary"
							variant="filled"
							loading={isLinkingVariations}
						>
							產生商品款式
						</Button>
					</Popconfirm>

					<ProductEditTable
						context="detail"
						form={form}
						virtualFields={virtualFields}
						setVirtualFields={setVirtualFields}
					/>
					<div className="mt-8 flex justify-end sticky bottom-[3.5rem] bg-white">
						<Button type="primary" onClick={handleUpdate}>
							儲存商品款式
						</Button>
					</div>
				</>
			)}
		</>
	)
}
