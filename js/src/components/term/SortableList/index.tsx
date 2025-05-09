import { useEffect, memo, FC } from 'react'
import { SortableList as SortableListAntd } from '@ant-design/pro-editor'
import { TTerm, DEFAULT } from '@/components/term/types'
import { message, Button, Pagination, Empty } from 'antd'
import NodeRender from '@/components/term/SortableList/NodeRender'
import {
	useCustomMutation,
	useApiUrl,
	useInvalidate,
	useDeleteMany,
} from '@refinedev/core'
import { isEqual as _isEqual } from 'lodash-es'
import { toParams } from '@/components/term/SortableList/utils'
import {
	useTermsList,
	TaxonomyContext,
	SelectedTermIdsContext,
	SelectedTermIdContext,
} from '@/components/term/hooks'
import { TSortableTreeListProps } from '@/components/term/types'
import Loading from '@/components/term/SortableList/Loading'
import { PopconfirmDelete } from 'antd-toolkit'
import { notificationProps } from 'antd-toolkit/refine'

/**
 * 可排序的 term
 * @param {Edit} Edit 編輯的畫面由外部傳入
 * @return {React.FC}
 */
const SortableListComponent = ({
	taxonomy,
	selectedTermIds,
	setSelectedTermIds,
	selectedTermId,
	setSelectedTermId,
	Edit,
}: TSortableTreeListProps) => {
	const {
		data: termsData,
		isLoading: isListLoading,
		paginationProps,
		setPaginationProps,
	} = useTermsList(taxonomy)
	const terms = termsData?.data || []

	const invalidate = useInvalidate()

	const apiUrl = useApiUrl()
	const { mutate } = useCustomMutation()

	useEffect(() => {
		if (!isListLoading) {
			// 每次重新排序後，重新取得章節後，重新 set 選擇的章節
			setSelectedTermId(terms.find((c) => c.id === selectedTermId)?.id || null)
		}
	}, [isListLoading])

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

	const { mutate: deleteMany, isLoading: isDeleteManyLoading } = useDeleteMany()

	return (
		<SelectedTermIdContext.Provider
			value={{ selectedTermId, setSelectedTermId }}
		>
			<SelectedTermIdsContext.Provider
				value={{ selectedTermIds, setSelectedTermIds }}
			>
				<TaxonomyContext.Provider value={taxonomy}>
					<div className="mb-8 flex gap-x-4 justify-between items-center">
						<div className="w-full">
							<Button
								type="primary"
								onClick={() => setSelectedTermId(DEFAULT.id)}
							>
								新增
							</Button>
						</div>
						<Button
							type="default"
							className="relative top-1"
							disabled={!selectedTermIds?.length}
							onClick={() => setSelectedTermIds([])}
						>
							清空選取
						</Button>
						<PopconfirmDelete
							popconfirmProps={{
								onConfirm: () =>
									deleteMany(
										{
											resource: `terms/${taxonomy.value}`,
											ids: selectedTermIds,
											mutationMode: 'optimistic',
											values: {
												taxonomy: taxonomy.value,
											},
											...notificationProps,
										},
										{
											onSuccess: () => {
												setSelectedTermIds([])
											},
										},
									),
							}}
							buttonProps={{
								type: 'primary',
								danger: true,
								className: 'relative top-1',
								loading: isDeleteManyLoading,
								disabled: !selectedTermIds?.length,
								children: `批量刪除 ${selectedTermIds?.length ? `(${selectedTermIds?.length})` : ''}`,
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
									renderEmpty={() => (
										<Empty
											image={Empty.PRESENTED_IMAGE_SIMPLE}
											description="無資料"
										/>
									)}
									renderContent={(item, index) => <NodeRender record={item} />}
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

						{selectedTermId !== null && Edit && (
							<Edit
								record={terms.find((c) => c.id === selectedTermId) || DEFAULT}
								taxonomy={taxonomy}
							/>
						)}
					</div>
				</TaxonomyContext.Provider>
			</SelectedTermIdsContext.Provider>
		</SelectedTermIdContext.Provider>
	)
}

/**
 * 可排序的 term
 * @param {TSortableTreeProps} props 商品規格
 * @param {TTaxonomy} props.taxonomy 分類
 * @param {string[]} props.selectedTermIds 選取的 term
 * @param {React.Dispatch<React.SetStateAction<string[]>>} props.setSelectedTermIds 設定選取的 term
 * @param {string | null} props.selectedTermId 選取的 term
 * @param {React.Dispatch<React.SetStateAction<string | null>>} props.setSelectedTermId 設定選取的 term
 * @param {React.FC<{ record: TTerm; taxonomy: TTaxonomy }>} props.Edit 編輯的畫面由外部傳入
 * @return {React.FC}
 */
export const SortableList: FC<TSortableTreeListProps> = memo(
	SortableListComponent,
)
