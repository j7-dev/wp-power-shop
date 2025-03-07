import { Input, useSortableList } from '@ant-design/pro-editor'
import { memo } from 'react'
import { nanoid } from 'nanoid'
import { Form } from 'antd'

const { Item } = Form

const ItemRender = ({ item, index }: any) => {
	const instance = useSortableList()

	const updateTitle = (value: string) => {
		instance.updateItem({ ...item, title: value }, index)
	}

	const handleNextFocus = () => {
		const value = instance.getValue() || []

		// 如果是最後一個節點，按下 Enter 後，會自動新增一個新的節點
		if (index + 1 === value.length) {
			const id = nanoid()
			instance.addItem({ id, title: '' })
		}
		setTimeout(() => {
			const nextNodeEl = document.getElementById(`index-${index + 1}`)
			nextNodeEl?.focus()
		}, 0)
	}

	return (
		<>
			<Item noStyle name={['pd_keywords', index, 'title']} key={index}>
				<Input
					id={`index-${index}`}
					onPressEnter={() => {
						handleNextFocus()
					}}
					onChange={(value) => {
						updateTitle(value)
					}}
				/>
			</Item>
			<Item name={['pd_keywords', index, 'id']} hidden />
		</>
	)
}

export default memo(ItemRender)
