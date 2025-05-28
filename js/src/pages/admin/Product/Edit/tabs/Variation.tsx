import React, { useState, useEffect } from 'react'
import { Form, Skeleton, Button, Popconfirm, Select, Alert, Tag } from 'antd'
import { useRecord } from '@/pages/admin/Product/Edit/hooks'
import { ProductEditTable } from '@/components/product'
import { TProductRecord } from '@/components/product/types'
import { useUpdate, useInvalidate } from '@refinedev/core'
import {
	TFormValues,
	ZFormValues,
} from '@/components/product/ProductEditTable/types'
import { productsToFields } from '@/components/product/ProductEditTable/utils'
import { safeParse } from 'antd-toolkit'
import { notificationProps } from 'antd-toolkit/refine'

const { Item } = Form

export const Variation = () => {
	const parentProduct = useRecord()
	const [showTable, setShowTable] = useState(false)
	const variations = parentProduct?.children || []
	const attributes = parentProduct?.attributes || []
	const defaultAttributes = parentProduct?.default_attributes || {}

	const [form] = Form.useForm<TFormValues>()
	const [formAttr] = Form.useForm<{
		default_attributes: Record<string, string>
	}>()

	// 虛擬欄位，因為 Table 組件使用虛擬列表，只會 render 部分的欄位，如果用 form.getFieldsValue() 會抓不到所有欄位值，因此使用這個欄位紀錄變化值
	const [virtualFields, setVirtualFields] =
		useState<TProductRecord[]>(variations)

	const { mutate: updateVariations, isLoading: isUpdating } = useUpdate({
		resource: 'products/update-variations',
	})

	const { mutate: createVariations, isLoading: isCreating } = useUpdate({
		resource: 'products/create-variations',
	})

	const invalidate = useInvalidate()

	const handleUpdate = () => {
		const default_attributes = formAttr.getFieldValue(['default_attributes'])
		// 取得 values
		const fields = productsToFields(virtualFields, 'submit')
		// @ts-ignore
		safeParse(ZFormValues.array(), Object.values(fields))

		updateVariations({
			id: parentProduct?.id,
			values: {
				default_attributes,
				variations: fields,
			},
			...notificationProps,
		})
	}

	useEffect(() => {
		// 延遲 render 避免卡頓
		const delay = setTimeout(() => {
			setShowTable(true)
			setVirtualFields(variations)
		}, 500)
		return () => clearTimeout(delay)
	}, [variations?.map((v) => v.id)?.join(',')])

	const handleCreateVariations = () => {
		createVariations(
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
				<div style={{ contain: 'layout paint style' }}>
					<Alert
						className="mb-4"
						message="如何建立商品款式？"
						description={
							<>
								<p className="m-0">
									請先新增商品規格，如 <Tag color="blue">衣服尺寸</Tag> ( S, M,
									L, XL ) 或是 <Tag color="blue">顏色</Tag> ( 紅,藍,綠
									)，再點擊下方的「產生商品款式」。
								</p>
								<p className="m-0">
									以上面為例，尺寸有 4 種，顏色有 3 種，即會產生 4 x 3 = 12 ，共
									12 種商品款式。
								</p>
							</>
						}
						type="info"
						showIcon
						closable
					/>
					<Popconfirm
						title="產生所有商品規格的款式"
						onConfirm={handleCreateVariations}
						okText="確認"
						cancelText="取消"
					>
						<Button color="primary" variant="filled" loading={isCreating}>
							產生商品款式
						</Button>
					</Popconfirm>

					<ProductEditTable
						context="detail"
						form={form}
						virtualFields={virtualFields}
						setVirtualFields={setVirtualFields}
					/>
					<div className="mt-8 py-3 flex items-center justify-between sticky bottom-[3.5rem] bg-white gap-x-4">
						<div className="flex flex-1 items-center gap-x-4">
							<p className="text-sm m-0 text-nowrap">預設規格</p>
							<Form form={formAttr} className="field-xs w-full">
								<div className="flex flex-wrap gap-2">
									{attributes?.map(({ id, name, taxonomy, options }) => (
										<Item
											key={`${id}-${name}`}
											name={['default_attributes', taxonomy || name]}
											label={name}
											className="mb-0"
											initialValue={defaultAttributes?.[taxonomy || name]}
										>
											<Select
												className="min-w-40"
												options={options}
												placeholder="沒有預設"
												size="small"
												allowClear
											/>
										</Item>
									))}
								</div>
							</Form>
						</div>
						<Button
							className="w-fit"
							type="primary"
							onClick={handleUpdate}
							loading={isUpdating}
						>
							儲存商品款式
						</Button>
					</div>
				</div>
			)}
		</>
	)
}
