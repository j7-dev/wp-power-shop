import { useState } from 'react'
import { Button, Space, Select, Form } from 'antd'
import { useUpdateMany } from '@refinedev/core'
import { useAtom } from 'jotai'
import { selectedProductIdsAtom } from '@/components/product/ProductTable/atom'
import { PRODUCT_STATUS } from 'antd-toolkit/wp'

const { Item } = Form

type TFormValues = {
	status?: string
}

const UpdateButton = () => {
	const [form] = Form.useForm<TFormValues>()
	const [ids, setIds] = useAtom(selectedProductIdsAtom)
	const [canUpdate, setCanUpdate] = useState(false)

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

	const handleValuesChange = (
		changedValues: TFormValues,
		allValues: TFormValues,
	) => {
		const keys = Object.keys(allValues).filter(
			(key) => !!allValues[key as keyof TFormValues],
		)
		setCanUpdate(keys.length > 0)
	}

	return (
		<Form form={form} onValuesChange={handleValuesChange}>
			<Space.Compact>
				<Item name={['status']} noStyle>
					<Select
						placeholder="發佈狀態"
						className="w-40"
						options={PRODUCT_STATUS}
						allowClear
					/>
				</Item>
				<Button
					color="primary"
					variant="solid"
					loading={isLoading}
					onClick={handleUpdate}
					disabled={!canUpdate}
				>
					批量修改
				</Button>
			</Space.Compact>
		</Form>
	)
}

export default UpdateButton
