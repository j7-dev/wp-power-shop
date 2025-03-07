import { useState, useEffect, memo } from 'react'
import { SortableTree, TreeData } from '@ant-design/pro-editor'
import { TDocRecord } from '@/pages/admin/Docs/List/types'
import { Form, message, Button } from 'antd'
import NodeRender from './NodeRender'
import { postToTreeNode, treeToParams } from './utils'
import {
	useCustomMutation,
	useApiUrl,
	useInvalidate,
	useDeleteMany,
} from '@refinedev/core'
import { isEqual as _isEqual } from 'lodash-es'
import { PopconfirmDelete } from 'antd-toolkit'
import { usePostsList } from './hooks'
import { useAtom } from 'jotai'
import { selectedPostAtom, selectedIdsAtom } from './atom'
import AddPosts from './AddPosts'
import Loading from './Loading'

// 定義最大深度
export const MAX_DEPTH = 2

/**
 * 可排序的章節
 * @param {PostEdit} PostEdit 編輯的畫面由外部傳入
 * @return {React.FC}
 */
const SortablePostsComponent = ({
	PostEdit,
}: {
	PostEdit: React.FC<{ record: TDocRecord }>
}) => {
	const form = Form.useFormInstance()
	const courseId = form?.getFieldValue('id')

	const {
		data: postsData,
		isFetching: isListFetching,
		isLoading: isListLoading,
	} = usePostsList()
	const posts = postsData?.data || []
	const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom)

	const [treeData, setTreeData] = useState<TreeData<TDocRecord>>([])

	// 原本的樹狀結構
	const [originTree, setOriginTree] = useState<TreeData<TDocRecord>>([])
	const invalidate = useInvalidate()

	const apiUrl = useApiUrl()
	const { mutate } = useCustomMutation()

	// 每次更新 List 狀態，會算出當次的展開節點 id
	const openedNodeIds = getOpenedNodeIds(treeData)

	useEffect(() => {
		if (!isListFetching) {
			const postTree = posts?.map(postToTreeNode)

			setTreeData((prev) => {
				// 恢復原本的 collapsed 狀態
				const newTreeData = restoreOriginCollapsedState(postTree, openedNodeIds)
				return newTreeData
			})
			setOriginTree(postTree)

			// 每次重新排序後，重新取得章節後，重新 set 選擇的章節
			const flattenPosts = posts.reduce((acc, c) => {
				acc.push(c)
				if (c?.children) {
					acc.push(...c?.children)
				}
				return acc
			}, [] as TDocRecord[])

			setSelectedPost(
				flattenPosts.find((c) => c.id === selectedPost?.id) || null,
			)
		}
	}, [isListFetching])

	const handleSave = (data: TreeData<TDocRecord>) => {
		const from_tree = treeToParams(originTree, courseId)
		const to_tree = treeToParams(data, courseId)
		const isEqual = _isEqual(from_tree, to_tree)

		if (isEqual) return
		// 這個儲存只存新增，不存章節的細部資料
		message.loading({
			content: '排序儲存中...',
			key: 'posts-sorting',
		})

		mutate(
			{
				url: `${apiUrl}/posts/sort`,
				method: 'post',
				values: {
					from_tree,
					to_tree,
				},
			},
			{
				onSuccess: () => {
					message.success({
						content: '排序儲存成功',
						key: 'posts-sorting',
					})
				},
				onError: () => {
					message.loading({
						content: '排序儲存失敗',
						key: 'posts-sorting',
					})
				},
				onSettled: () => {
					invalidate({
						resource: 'posts',
						invalidates: ['list'],
					})
				},
			},
		)
	}

	const [selectedIds, setSelectedIds] = useAtom(selectedIdsAtom)

	const { mutate: deleteMany, isLoading: isDeleteManyLoading } = useDeleteMany()

	return (
		<>
			<div className="mb-8 flex gap-x-4 justify-between items-center">
				<AddPosts records={posts} />
				<Button
					type="default"
					className="relative top-1"
					disabled={!selectedIds.length}
					onClick={() => setSelectedIds([])}
				>
					清空選取
				</Button>
				<PopconfirmDelete
					popconfirmProps={{
						onConfirm: () =>
							deleteMany(
								{
									resource: 'posts',
									ids: selectedIds,
									mutationMode: 'optimistic',
								},
								{
									onSuccess: () => {
										setSelectedIds([])
									},
								},
							),
					}}
					buttonProps={{
						type: 'primary',
						danger: true,
						className: 'relative top-1',
						loading: isDeleteManyLoading,
						disabled: !selectedIds.length,
						children: `批量刪除 ${selectedIds.length ? `(${selectedIds.length})` : ''}`,
					}}
				/>
			</div>
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
				{isListLoading && <Loading />}
				{!isListLoading && (
					<SortableTree
						hideAdd
						hideRemove
						treeData={treeData}
						onTreeDataChange={(data: TreeData<TDocRecord>) => {
							setTreeData(data)
							handleSave(data)
						}}
						renderContent={(node) => (
							<NodeRender
								node={node}
								selectedIds={selectedIds}
								setSelectedIds={setSelectedIds}
							/>
						)}
						indentationWidth={48}
						sortableRule={({ activeNode, projected }) => {
							const nodeDepth = getMaxDepth([activeNode])
							const maxDepth = projected?.depth + nodeDepth

							// activeNode - 被拖動的節點
							// projected - 拖動後的資訊

							const sortable = maxDepth <= MAX_DEPTH
							if (!sortable) message.error('超過最大深度，無法執行')
							return sortable
						}}
					/>
				)}

				{selectedPost && <PostEdit record={selectedPost} />}
			</div>
		</>
	)
}

export const SortablePosts = memo(SortablePostsComponent)

/**
 * 取得所有展開的 ids
 * 遞迴取得所有 collapsed = false 的 id
 * @param treeData 樹狀結構
 * @returns 所有 collapsed = false 的 id
 */
function getOpenedNodeIds(treeData: TreeData<TDocRecord>) {
	// 遞迴取得所有 collapsed = false 的 id
	const ids = treeData?.reduce((acc, c) => {
		if (!c.collapsed) acc.push(c.id as string)
		if (c?.children?.length) acc.push(...getOpenedNodeIds(c.children))
		return acc
	}, [] as string[])
	return ids
}

/**
 * 恢復原本的 collapsed 狀態
 * @param treeData 樹狀結構
 * @param openedNodeIds 展開的 ids
 * @returns newTreeData 恢復原本的 collapsed 狀態
 */
function restoreOriginCollapsedState(
	treeData: TreeData<TDocRecord>,
	openedNodeIds: string[],
) {
	// 遞迴恢復原本的 collapsed 狀態
	const newTreeData: TreeData<TDocRecord> = treeData?.map((item) => {
		let newItem = item
		if (openedNodeIds.includes(item.id as string)) {
			newItem.collapsed = false
		}

		if (item?.children?.length) {
			newItem.children = restoreOriginCollapsedState(
				item.children,
				openedNodeIds,
			)
		}
		return item
	})
	return newTreeData
}

/**
 * 取得樹狀結構的最大深度
 * @param treeData 樹狀結構
 * @param depth 當前深度
 * @returns 最大深度
 */
function getMaxDepth(treeData: TreeData<TDocRecord>, depth = 0) {
	// 如果沒有資料，回傳當前深度
	if (!treeData?.length) return depth

	// 遞迴取得所有子節點的深度
	const childrenDepths: number[] = treeData.map((item) => {
		if (item?.children?.length) {
			return getMaxDepth(item.children, depth + 1)
		}
		return depth
	})

	// 回傳最大深度
	return Math.max(...childrenDepths)
}
