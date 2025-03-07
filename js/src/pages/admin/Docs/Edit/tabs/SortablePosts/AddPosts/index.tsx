import { memo } from 'react'
import { Space, InputNumber, Button, Form } from 'antd'
import { useCreate, useParsed } from '@refinedev/core'
import { TDocRecord } from '@/pages/admin/Docs/List/types'
import { useEnv } from 'antd-toolkit'

const { Item } = Form

type TFormValues = {
	depth: number
	qty: number
	post_parents: string[]
}

const AddPosts = ({ records }: { records: TDocRecord[] }) => {
	const { DOCS_POST_TYPE = '' } = useEnv()
	const { id } = useParsed()

	const [form] = Form.useForm<TFormValues>()

	const { mutate, isLoading } = useCreate({
		resource: 'posts',
	})

	const handleCreateMany = () => {
		const values = form.getFieldsValue()
		mutate({
			values,
			invalidates: ['list'],
		})
	}

	return (
		<Form form={form} className="w-full">
			<Space.Compact>
				<Button type="primary" loading={isLoading} onClick={handleCreateMany}>
					新增
				</Button>

				<Item name={['qty']}>
					<InputNumber className="w-40" addonAfter="個" />
				</Item>
			</Space.Compact>
			<Item name={['post_parent']} initialValue={id} hidden />
			<Item name={['post_type']} initialValue={DOCS_POST_TYPE} hidden />
		</Form>
	)
}

export default memo(AddPosts)
