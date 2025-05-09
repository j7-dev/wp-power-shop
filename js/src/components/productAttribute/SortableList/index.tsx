import { memo, FC } from 'react'
import { SortableList as SortableListAntd } from '@ant-design/pro-editor'
import { DEFAULT } from '@/components/productAttribute/types'
import { message, Button, Empty } from 'antd'
import NodeRender from '@/components/productAttribute/SortableList/NodeRender'
import {
	useCustomMutation,
	useApiUrl,
	useInvalidate,
	useDeleteMany,
} from '@refinedev/core'
import { isEqual as _isEqual } from 'lodash-es'
import { toParams } from '@/components/productAttribute/SortableList/utils'
import { SelectedTermIdContext } from '@/components/productAttribute/hooks'
import { PopconfirmDelete } from 'antd-toolkit'
import { TProductAttribute } from 'antd-toolkit/wp'

import { notificationProps } from 'antd-toolkit/refine'

export type TSortableListProps = {
	attributes: TProductAttribute[]
	selectedTermId: string | null
	setSelectedTermId: React.Dispatch<React.SetStateAction<string | null>>
	Edit?: React.FC<{
		attributes: TProductAttribute[]
		record: TProductAttribute
	}>
}

/**
 * 可排序的商品屬性
 * setSelectedTermId 一般是以 id 作為唯一符號
 * 但局部屬性 id 都是 ""，所以用 id + name 作為唯一符號
 * @param {Edit} Edit 編輯的畫面由外部傳入
 * @return {React.FC}
 */
const SortableListComponent = ({
	attributes,
	selectedTermId,
	setSelectedTermId,
	Edit,
}: TSortableListProps) => {
	const options = [] // TODO

	const invalidate = useInvalidate()

	const apiUrl = useApiUrl()
	const { mutate } = useCustomMutation()

	const handleSave = (data: TProductAttribute[]) => {
		// const isEqual = _isEqual(attributes, data)
		// if (isEqual) return
		// const from_tree = toParams(terms, paginationProps)
		// const to_tree = toParams(data, paginationProps)
		// // 這個儲存只存新增，不存章節的細部資料
		// message.loading({
		// 	content: '排序儲存中...',
		// 	key: 'terms-sorting',
		// })
		// mutate(
		// 	{
		// 		url: `${apiUrl}/terms/${taxonomy.value}/sort`,
		// 		method: 'post',
		// 		values: {
		// 			from_tree,
		// 			to_tree,
		// 		},
		// 	},
		// 	{
		// 		onSuccess: () => {
		// 			message.success({
		// 				content: '排序儲存成功',
		// 				key: 'terms-sorting',
		// 			})
		// 		},
		// 		onError: () => {
		// 			message.loading({
		// 				content: '排序儲存失敗',
		// 				key: 'terms-sorting',
		// 			})
		// 		},
		// 		onSettled: () => {
		// 			invalidate({
		// 				resource: `terms/${taxonomy.value}`,
		// 				invalidates: ['list'],
		// 			})
		// 		},
		// 	},
		// )
	}

	return (
		<SelectedTermIdContext.Provider
			value={{ selectedTermId, setSelectedTermId }}
		>
			<div className="mb-8 flex gap-x-4 justify-between items-center">
				<div className="w-full">
					<Button
						type="primary"
						onClick={() => setSelectedTermId(`${DEFAULT.id}-${DEFAULT.name}`)}
					>
						新增
					</Button>
				</div>
			</div>
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
				<div>
					<SortableListAntd<TProductAttribute>
						hideRemove
						value={attributes}
						onChange={handleSave}
						renderEmpty={() => (
							<Empty
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description="無資料"
							/>
						)}
						renderContent={(item, index) => (
							<NodeRender attributes={attributes} record={item} />
						)}
					/>
				</div>

				{selectedTermId !== null && Edit && (
					<Edit
						attributes={attributes}
						record={
							attributes.find(
								({ id, name }) => `${id}-${name}` === selectedTermId,
							) || DEFAULT
						}
					/>
				)}
			</div>
		</SelectedTermIdContext.Provider>
	)
}

/**
 * 可排序的 term
 * @param {TSortableListProps} props 屬性
 * @param {TProductAttribute[]} props.attributes 屬性
 * @param {string | null} props.selectedTermId 選取的 term
 * @param {React.Dispatch<React.SetStateAction<string | null>>} props.setSelectedTermId 設定選取的 term
 * @param {React.FC<{ record: TProductAttribute }>} props.Edit 編輯的畫面由外部傳入
 * @return {React.FC}
 */
export const SortableList: FC<TSortableListProps> = memo(SortableListComponent)
