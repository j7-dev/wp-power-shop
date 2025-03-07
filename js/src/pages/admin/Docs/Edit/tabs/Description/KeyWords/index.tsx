import { SortableList } from '@ant-design/pro-editor'
import ItemRender from './ItemRender'
import { nanoid } from 'nanoid'
import { Form, Empty, Input } from 'antd'

const { Item } = Form

export type SchemaItem = {
	id: string
	title: string
}

const DEFAULT_KEYWORDS = [
	{
		id: 'aspogasfkl',
		title: '',
	},
]

const KeyWords = () => {
	const form = Form.useFormInstance()
	const keywords = form.getFieldValue(['pd_keywords'])

	return (
		<div>
			<Item name={['pd_keywords_label']} label="熱門搜尋關鍵字">
				<Input placeholder="關鍵字前的文字，也可以留空" allowClear />
			</Item>
			<SortableList<SchemaItem>
				renderEmpty={() => <Empty description="目前沒有關鍵字" />}
				value={Array.isArray(keywords) ? keywords : DEFAULT_KEYWORDS}
				onChange={(data, event) => {
					form.setFieldValue(['pd_keywords'], data)
				}}
				renderContent={(item, index) => (
					<ItemRender item={item} index={index} />
				)}
				creatorButtonProps={{
					creatorButtonText: '新增關鍵字',
					record: () => {
						const id = nanoid()
						return {
							id,
							title: '',
						}
					},
					style: {
						margin: '8px 18px 0 18px',
						width: 'calc(100% - 46px)',
					},
				}}
			/>
			<Item name={['pd_keywords']} hidden />
		</div>
	)
}

export default KeyWords
