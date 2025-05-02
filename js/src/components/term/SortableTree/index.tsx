import { useState, useEffect, memo } from 'react'
import {
	SortableTree as SortableTreeAntd,
	TreeData,
} from '@ant-design/pro-editor'
import { TTerm, DEFAULT } from '@/components/term/types'
import { message, Button, Pagination, Empty } from 'antd'
import NodeRender from '@/components/term/SortableTree/NodeRender'
import {
	termToTreeNode,
	treeToParams,
} from '@/components/term/SortableTree/utils'
import {
	useCustomMutation,
	useApiUrl,
	useInvalidate,
	useDeleteMany,
} from '@refinedev/core'
import { isEqual as _isEqual } from 'lodash-es'
import { useTermsList } from '@/components/term/hooks'
import { useAtom } from 'jotai'
import {
	selectedTermAtom,
	selectedIdsAtom,
	TaxonomyContext,
} from '@/components/term/SortableTree/atom'
import Loading from '@/components/term/SortableTree/Loading'
import { TTaxonomy } from '@/types/woocommerce'
import { PopconfirmDelete } from 'antd-toolkit'
import { notificationProps } from 'antd-toolkit/refine'
// 定義最大深度
export const MAX_DEPTH = 2

/**
 * 可排序的 term
 * @param {Edit} Edit 編輯的畫面由外部傳入
 * @return {React.FC}
 */
const SortableTreeComponent = ({
	taxonomy,
	Edit,
}: {
	taxonomy: TTaxonomy
	Edit?: React.FC<{ record: TTerm; taxonomy: TTaxonomy }>
}) => {
	const {
		data: termsData,
		isLoading: isListLoading,
		paginationProps,
		setPaginationProps,
	} = useTermsList(taxonomy)
	const terms = termsData?.data || []
	const [selectedTerm, setSelectedTerm] = useAtom(selectedTermAtom)

	const [treeData, setTreeData] = useState<TreeData<TTerm>>([])

	// 原本的樹狀結構
	const [originTree, setOriginTree] = useState<TreeData<TTerm>>([])
	const invalidate = useInvalidate()

	const apiUrl = useApiUrl()
	const { mutate } = useCustomMutation()

	// 每次更新 List 狀態，會算出當次的展開節點 id
	const openedNodeIds = getOpenedNodeIds(treeData)

	useEffect(() => {
		if (!isListLoading) {
			const termTree = terms?.map(termToTreeNode)

			setTreeData((prev) => {
				// 恢復原本的 collapsed 狀態
				const newTreeData = restoreOriginCollapsedState(termTree, openedNodeIds)
				return newTreeData
			})
			setOriginTree(termTree)

			// 每次重新排序後，重新取得章節後，重新 set 選擇的章節
			const flattenTerms = terms.reduce((acc, c) => {
				acc.push(c)
				if (c?.children) {
					acc.push(...c?.children)
				}
				return acc
			}, [] as TTerm[])

			setSelectedTerm(
				flattenTerms.find((c) => c.id === selectedTerm?.id) || null,
			)
		}
	}, [isListLoading, terms])

	const handleSave = (data: TreeData<TTerm>) => {
		const from_tree = treeToParams(originTree, paginationProps)
		const to_tree = treeToParams(data, paginationProps)
		const isEqual = _isEqual(from_tree, to_tree)

		if (isEqual) return
		// 這個儲存只存新增，不存章節的細部資料
		message.loading({
			content: '排序儲存中...',
			key: 'terms-sorting',
		})

		mutate(
			{
				url: `${apiUrl}/terms/${taxonomy.value}/sort`,
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
						key: 'terms-sorting',
					})
				},
				onError: () => {
					message.loading({
						content: '排序儲存失敗',
						key: 'terms-sorting',
					})
				},
				onSettled: () => {
					invalidate({
						resource: `terms/${taxonomy.value}`,
						invalidates: ['list'],
					})
				},
			},
		)
	}

	const [selectedIds, setSelectedIds] = useAtom(selectedIdsAtom)

	const { mutate: deleteMany, isLoading: isDeleteManyLoading } = useDeleteMany()

	if (treeData?.length === 0) {
		return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="無資料" />
	}

	return (
		<TaxonomyContext.Provider value={taxonomy}>
			<div className="mb-8 flex gap-x-4 justify-between items-center">
				<div className="w-full">
					<Button type="primary" onClick={() => setSelectedTerm(DEFAULT)}>
						新增
					</Button>
				</div>
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
									resource: `terms/${taxonomy.value}`,
									ids: selectedIds,
									mutationMode: 'optimistic',
									values: {
										taxonomy: taxonomy.value,
									},
									...notificationProps,
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
					<div>
						<SortableTreeAntd<TTerm>
							hideAdd
							hideRemove
							treeData={treeData}
							onTreeDataChange={(data: TreeData<TTerm>) => {
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
						<Pagination
							{...paginationProps}
							onChange={(page, pageSize) => {
								setPaginationProps({
									...paginationProps,
									current: page,
									pageSize,
								})
							}}
						/>
					</div>
				)}

				{selectedTerm && Edit && (
					<Edit record={selectedTerm} taxonomy={taxonomy} />
				)}
			</div>
		</TaxonomyContext.Provider>
	)
}

export const SortableTree = memo(SortableTreeComponent)

/**
 * 取得所有展開的 ids
 * 遞迴取得所有 collapsed = false 的 id
 * @param treeData 樹狀結構
 * @returns 所有 collapsed = false 的 id
 */
function getOpenedNodeIds(treeData: TreeData<TTerm>) {
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
	treeData: TreeData<TTerm>,
	openedNodeIds: string[],
) {
	// 遞迴恢復原本的 collapsed 狀態
	const newTreeData: TreeData<TTerm> = treeData?.map((item) => {
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
function getMaxDepth(treeData: TreeData<TTerm>, depth = 0) {
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
