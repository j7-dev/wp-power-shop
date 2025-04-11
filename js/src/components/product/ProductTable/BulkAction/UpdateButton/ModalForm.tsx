import { useEffect, useState } from 'react'
import { ModalProps, Modal, Form } from 'antd'
import { useAtomValue } from 'jotai'
import { useUpdateMany } from '@refinedev/core'
import { selectedProductsAtom } from '@/components/product/ProductTable/atom'
import { ProductEditTable } from '@/components/product'
import { PRODUCT_STATUS, PRODUCT_CATALOG_VISIBILITIES } from 'antd-toolkit/wp'

type TFormValues = {
	catalog_visibility?: (typeof PRODUCT_CATALOG_VISIBILITIES)[number]['value']
	status?: (typeof PRODUCT_STATUS)[number]['value']
}

const ModalForm = ({ modalProps }: { modalProps: ModalProps }) => {
	const products = useAtomValue(selectedProductsAtom)
	const ids = products.map((product) => product.id)
	const [form] = Form.useForm<TFormValues>()
	const [showTable, setShowTable] = useState(false)

	const { mutate, isLoading } = useUpdateMany({
		resource: 'products',
	})

	const handleUpdate = () => {
		const values = form.getFieldsValue()
		mutate({
			ids,
			values,
			successNotification: (data) => {
				return {
					message: `商品 ${ids?.map((id: string) => `#${id}`).join(', ')} 已修改成功`,
					type: 'success',
				}
			},
		})
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
			{!showTable && <div>資料準備中...</div>}
			{showTable && <ProductEditTable products={products} />}
		</Modal>
	)
}

export default ModalForm
