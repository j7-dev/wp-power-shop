import { memo } from 'react'
import { Space, InputNumber, Button, Form } from 'antd'
import { useCreate, useParsed } from '@refinedev/core'
import { TTerm } from '@/components/term/types'
import { useTaxonomy } from '@/components/term/SortableTree/hooks'

const { Item } = Form

type TFormValues = {
	depth: number
	qty: number
	post_parents: string[]
}

const Create = ({ records }: { records: TTerm[] }) => {
	const { id } = useParsed()
	const { value: taxonomySlug, label: taxonomyLabel } = useTaxonomy()
	const [form] = Form.useForm<TFormValues>()

	const { mutate, isLoading } = useCreate({
		resource: 'terms',
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

				<Item name={['qty']} noStyle>
					<InputNumber className="w-40" addonAfter="個" />
				</Item>
			</Space.Compact>
			<Item name={['term']} initialValue="new-" hidden />
			<Item name={['name']} initialValue={`新${taxonomyLabel}`} hidden />
			<Item name={['taxonomy']} initialValue={taxonomySlug} hidden />
		</Form>
	)
}

export default memo(Create)
