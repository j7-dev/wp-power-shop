import { useEffect, useState } from 'react'
import { ModalProps, Modal, Form, Skeleton } from 'antd'
import { useAtomValue } from 'jotai'
import { useUpdateMany } from '@refinedev/core'
import { selectedProductsAtom } from '@/components/product/ProductTable/atom'
import { ProductEditTable } from '@/components/product'
import {
	TFormValues,
	ZFormValues,
} from '@/components/product/ProductEditTable/types'
import { TProductRecord } from '@/components/product/types'

import { productsToFields } from '@/components/product/ProductEditTable/utils'

const ModalForm = ({ modalProps }: { modalProps: ModalProps }) => {
	const products = useAtomValue(selectedProductsAtom)
	const ids = products.map((product) => product.id)
	const [form] = Form.useForm<TFormValues>()
	const [showTable, setShowTable] = useState(false)

	// 虛擬欄位，因為 Table 組件使用虛擬列表，只會 render 部分的欄位，如果用 form.getFieldsValue() 會抓不到所有欄位值，因此使用這個欄位紀錄變化值
	const [virtualFields, setVirtualFields] = useState<TProductRecord[]>([])

	const { mutate, isLoading } = useUpdateMany({
		resource: 'products',
	})

	const handleUpdate = () => {
		// 取得 values
		const fields = productsToFields(virtualFields, 'submit')
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

	// 用來判斷是否可以按下修改按鈕
	// const handleValuesChange = (
	// 	changedValues: TFormValues,
	// 	allValues: TFormValues,
	// ) => {
	// 	const keys = Object.keys(allValues).filter(
	// 		(key) => !!allValues[key as keyof TFormValues],
	// 	)
	// 	setCanUpdate(keys.length > 0)
	// }

	useEffect(() => {
		const delay = setTimeout(() => {
			setShowTable(!!modalProps.open)
			setVirtualFields(products)
		}, 500)
		return () => clearTimeout(delay)
	}, [modalProps.open])

	return (
		<Modal
			{...modalProps}
			width="100%"
			title={`批量修改商品 ${ids.map((id) => `#${id}`).join(', ')}`}
			centered
			okText="批量修改"
			cancelText="取消"
			onOk={handleUpdate}
			confirmLoading={isLoading}
		>
			{!showTable && <Skeleton active />}
			{showTable && (
				<ProductEditTable
					form={form}
					virtualFields={virtualFields}
					setVirtualFields={setVirtualFields}
				/>
			)}
		</Modal>
	)
}

export default ModalForm
