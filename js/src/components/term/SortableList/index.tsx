import { useEffect, memo } from 'react'
import { SortableList as SortableListAntd } from '@ant-design/pro-editor'
import { TTerm, DEFAULT } from '@/components/term/types'
import { message, Button, Pagination } from 'antd'
import NodeRender from '@/components/term/SortableList/NodeRender'
import {
	useCustomMutation,
	useApiUrl,
	useInvalidate,
	useDeleteMany,
} from '@refinedev/core'
import { isEqual as _isEqual } from 'lodash-es'
import { useTermsList } from '@/components/term/SortableList/hooks'
import { toParams } from '@/components/term/SortableList/utils'
import { useAtom } from 'jotai'
import {
	selectedTermAtom,
	selectedIdsAtom,
	TaxonomyContext,
} from '@/components/term/SortableList/atom'
import Loading from '@/components/term/SortableList/Loading'
import { TTaxonomy } from '@/types/product'
import { PopconfirmDelete } from 'antd-toolkit'

/**
 * 可排序的 term
 * @param {Edit} Edit 編輯的畫面由外部傳入
 * @return {React.FC}
 */
const SortableListComponent = ({
	taxonomy,
	Edit,
}: {
	taxonomy: TTaxonomy
	Edit?: React.FC<{ record: TTerm; taxonomy: TTaxonomy }>
}) => {
	const {
		data: termsData,
		isFetching: isListFetching,
		isLoading: isListLoading,
		paginationProps,
		setPaginationProps,
	} = useTermsList(taxonomy)
	const terms = termsData?.data || []
	const [selectedTerm, setSelectedTerm] = useAtom(selectedTermAtom)

	const invalidate = useInvalidate()

	const apiUrl = useApiUrl()
	const { mutate } = useCustomMutation()

	useEffect(() => {
		if (!isListFetching) {
			// 每次重新排序後，重新取得章節後，重新 set 選擇的章節
			setSelectedTerm(terms.find((c) => c.id === selectedTerm?.id) || null)
		}
	}, [isListFetching])

	const handleSave = (data: TTerm[]) => {
		const isEqual = _isEqual(terms, data)

		if (isEqual) return

		const from_tree = toParams(terms, paginationProps)
		const to_tree = toParams(data, paginationProps)

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
									successNotification: (data, values) => {
										return {
											// @ts-ignore
											message: data?.data?.message || '儲存成功',
											type: 'success',
										}
									},
									errorNotification: (data, values) => {
										return {
											message: data?.message || '儲存失敗',
											type: 'error',
										}
									},
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
						<SortableListAntd<TTerm>
							hideRemove
							value={terms}
							onChange={handleSave}
							renderContent={(item, index) => (
								<NodeRender
									record={item}
									selectedIds={selectedIds}
									setSelectedIds={setSelectedIds}
								/>
							)}
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

export const SortableList = memo(SortableListComponent)
