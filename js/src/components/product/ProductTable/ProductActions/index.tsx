import React, { FC, memo } from 'react'
import { TProductRecord, TProductVariation } from '@/components/product/types'
import { ExportOutlined } from '@ant-design/icons'
import { Tooltip, Button } from 'antd'
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
