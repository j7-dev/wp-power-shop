import { FC } from 'react'
import { useUpdate, useInvalidate } from '@refinedev/core'
import { useSelectedTermId } from '@/components/productAttribute/hooks'
import { prepareAttributes } from '@/components/productAttribute/SortableList/utils'
import { useRecord } from '@/pages/admin/Product/Edit/hooks'
import { PopconfirmDelete, toFormData } from 'antd-toolkit'
import { ProductName as PostName, TProductAttribute } from 'antd-toolkit/wp'
import { notificationProps } from 'antd-toolkit/refine'

const NodeRender: FC<{
	attributes: TProductAttribute[]
	record: TProductAttribute
}> = ({ attributes, record }) => {
	const { selectedTermId, setSelectedTermId } = useSelectedTermId()
	const product = useRecord()
	const { name, id } = record
	const invalidate = useInvalidate()
	const { mutate: deleteAttribute, isLoading: isDeleting } = useUpdate()

	const handleDelete = () => {
		if (!product?.id) {
			return
		}

		const new_attributes = prepareAttributes(attributes)?.filter(
			(a) => `${a.id}-${a.name}` !== `${id}-${name}`,
		)

		deleteAttribute(
			{
				resource: `products/attributes`,
				id: product?.id,
				values: toFormData({
					new_attributes,
				}),
				...notificationProps,
			},
			{
				onSuccess: () => {
					invalidate({
						resource: 'products',
						invalidates: ['detail'],
						id: product?.id,
					})
				},
			},
		)
	}

	const isSelected = selectedTermId === `${id}-${name}`

	return (
		<div
			className={`grid grid-cols-[1fr_6rem_4rem] gap-4 justify-start items-center cursor-pointer ${isSelected ? 'bg-[#e6f4ff]' : ''}`}
		>
			<div
				className="flex items-center overflow-hidden"
				onClick={() => setSelectedTermId(`${id}-${name}`)}
			>
				<PostName className="[&_.at-name]:!text-sm" hideImage record={record} />
			</div>
			<div className="text-xs text-gray-400 text-right">
				{id ? '全局商品規格' : '商品規格'}
			</div>
			<div className="flex gap-2 justify-end">
				<PopconfirmDelete
					buttonProps={{
						className: 'mr-0',
						loading: isDeleting,
					}}
					tooltipProps={{ title: `刪除` }}
					popconfirmProps={{
						onConfirm: handleDelete,
						placement: 'right',
					}}
				/>
			</div>
		</div>
	)
}

export default NodeRender
