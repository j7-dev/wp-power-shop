import { useEffect, memo } from 'react'
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
import { useTermsList } from '@/components/term/hooks'
import { toParams } from '@/components/term/SortableList/utils'
import { useAtom } from 'jotai'
import {
	selectedTermAtom,
	selectedTermsAtom,
	TaxonomyContext,
} from '@/components/term/SortableList/atom'
import Loading from '@/components/term/SortableList/Loading'
import { TTaxonomy } from '@/types/woocommerce'
import { PopconfirmDelete } from 'antd-toolkit'
import { notificationProps } from 'antd-toolkit/refine'

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
		if (!isListLoading) {
			// 每次重新排序後，重新取得章節後，重新 set 選擇的章節
			setSelectedTerm(terms.find((c) => c.id === selectedTerm?.id) || null)
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

	const [selectedTerms, setSelectedTerms] = useAtom(selectedTermsAtom)

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
					disabled={!selectedTerms.length}
					onClick={() => setSelectedTerms([])}
				>
					清空選取
				</Button>
				<PopconfirmDelete
					popconfirmProps={{
						onConfirm: () =>
							deleteMany(
								{
									resource: `terms/${taxonomy.value}`,
									ids: selectedTerms.map((c) => c.id),
									mutationMode: 'optimistic',
									values: {
										taxonomy: taxonomy.value,
									},
									...notificationProps,
								},
								{
									onSuccess: () => {
										setSelectedTerms([])
									},
								},
							),
					}}
					buttonProps={{
						type: 'primary',
						danger: true,
						className: 'relative top-1',
						loading: isDeleteManyLoading,
						disabled: !selectedTerms.length,
						children: `批量刪除 ${selectedTerms.length ? `(${selectedTerms.length})` : ''}`,
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
							renderContent={(item, index) => (
								<NodeRender
									record={item}
									selectedTerms={selectedTerms}
									setSelectedTerms={setSelectedTerms}
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
