import React, { FC, memo } from 'react'
import { TProductRecord, TProductVariation } from '@/components/product/types'
import { ExportOutlined } from '@ant-design/icons'
import { Tooltip, Button } from 'antd'
import { FaWordpress } from 'react-icons/fa'
import { CopyButton } from '@/components/general'
import { cn } from 'antd-toolkit'

export const ProductActionsComponent: FC<{
	record: TProductRecord | TProductVariation
}> = ({ record }) => {
	const isTrash = 'trash' === record?.status

	return (
		<div className="flex gap-1">
			<CopyButton
				id={record?.id}
				invalidateProps={{ resource: 'products' }}
				tooltipProps={{ title: '複製商品' }}
			/>
			<Tooltip title="傳統介面檢視">
				<Button
					disabled={isTrash}
					type="text"
					href={record?.edit_url}
					target="_blank"
					rel="noreferrer"
					icon={<FaWordpress className="text-gray-400" />}
					className={cn('m-0', isTrash && 'opacity-50')}
				/>
			</Tooltip>

			{/* 如果狀態為回收桶，則不可見 */}
			<Tooltip title="檢視">
				<Button
					disabled={isTrash}
					type="text"
					href={record?.permalink}
					target="_blank"
					rel="noreferrer"
					icon={<ExportOutlined className="text-gray-400" />}
					className={cn('m-0', isTrash && 'opacity-50')}
				/>
			</Tooltip>
		</div>
	)
}

export const ProductActions = memo(ProductActionsComponent)
