import { memo, FC } from 'react'
import { SortableList as SortableListAntd } from '@ant-design/pro-editor'
import { DEFAULT } from '@/components/productAttribute/types'
import { Button, Empty, message } from 'antd'
import NodeRender from '@/components/productAttribute/SortableList/NodeRender'
import {
	useUpdate,
	useInvalidate,
	CreateResponse,
	UpdateResponse,
	BaseRecord,
} from '@refinedev/core'
import { isEqual as _isEqual } from 'lodash-es'
import { prepareAttributes } from '@/components/productAttribute/SortableList/utils'
import { SelectedTermIdContext } from '@/components/productAttribute/hooks'
import { useRecord } from '@/pages/admin/Product/Edit/hooks'
import { TProductAttribute } from 'antd-toolkit/wp'
import { toFormData } from 'antd-toolkit'

export type TSortableListProps = {
	attributes: TProductAttribute[]
	selectedTermId: string | null
	setSelectedTermId: React.Dispatch<React.SetStateAction<string | null>>
	Edit?: React.FC<{
		attributes: TProductAttribute[]
		record: TProductAttribute
		onMutationSuccess: (
			data: CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>,
			variables: any,
			isCreate: boolean,
		) => void
	}>
}

/**
 * 可排序的商品規格
 * setSelectedTermId 一般是以 id 作為唯一符號
 * 但局部商品規格 id 都是 ""，所以用 id + name 作為唯一符號
 * @param {Edit} Edit 編輯的畫面由外部傳入
 * @return {React.FC}
 */
const SortableListComponent = ({
	attributes,
	selectedTermId,
	setSelectedTermId,
	Edit,
}: TSortableListProps) => {
	const product = useRecord()
	const invalidate = useInvalidate()

	const { mutate } = useUpdate({
		resource: `products/attributes`,
		successNotification: false,
	})

	const handleSave = (attributes: TProductAttribute[]) => {
		const prepared_attributes = prepareAttributes(attributes)
		message.loading({
			key: 'mutating',
			content: '排序中...',
		})
		mutate(
			{
				id: product?.id,
				values: toFormData({
					new_attributes: prepared_attributes,
				}),
			},
			{
				onSuccess: () => {
					invalidate({
						resource: 'products',
						invalidates: ['detail'],
						id: product?.id,
					})
					message.success({
						key: 'mutating',
						content: '排序成功',
					})
				},
				onError: () => {
					message.error({
						key: 'mutating',
						content: '排序失敗',
					})
				},
			},
		)
	}

	const onMutationSuccess = (
		data: CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>,
		variables: any,
		isCreate: boolean,
	) => {
		if (isCreate) {
			setSelectedTermId(null)
		}
	}

	return (
		<SelectedTermIdContext.Provider
			value={{ selectedTermId, setSelectedTermId }}
		>
			<div className="mb-8 flex gap-x-4 justify-between items-center sticky top-0 z-10 bg-white -mr-2 pr-2">
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
						onMutationSuccess={onMutationSuccess}
					/>
				)}
			</div>
		</SelectedTermIdContext.Provider>
	)
}

/**
 * 可排序的 term
 * @param {TSortableListProps} props 商品規格
 * @param {TProductAttribute[]} props.attributes 商品規格
 * @param {string | null} props.selectedTermId 選取的 term
 * @param {React.Dispatch<React.SetStateAction<string | null>>} props.setSelectedTermId 設定選取的 term
 * @param {React.FC<{ record: TProductAttribute }>} props.Edit 編輯的畫面由外部傳入
 * @return {React.FC}
 */
export const SortableList: FC<TSortableListProps> = memo(SortableListComponent)
