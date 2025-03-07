import { FC } from 'react'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { TDocBaseRecord } from '@/pages/admin/Docs/List/types'
import { Tooltip, Button } from 'antd'
import { useUpdate } from '@refinedev/core'
import { toFormData } from 'antd-toolkit'

const ToggleVisibility: FC<{
	record: TDocBaseRecord
}> = ({ record }) => {
	const { mutate: update, isLoading } = useUpdate({
		successNotification: false,
		errorNotification: false,
	})
	const { id, status } = record
	const isPublished = status === 'publish'

	const handleToggle = () => {
		const formData = toFormData({
			status: isPublished ? 'draft' : 'publish',
		})
		update({
			resource: 'posts',
			values: formData,
			id,
			meta: {
				headers: { 'Content-Type': 'multipart/form-data;' },
			},
		})
	}

	return (
		<Tooltip title={`調整知識庫為${!isPublished ? '已發布' : '草稿'}`}>
			<Button
				loading={isLoading}
				type="text"
				icon={
					isPublished ? (
						<EyeOutlined className="text-gray-400" />
					) : (
						<EyeInvisibleOutlined className="text-yellow-700" />
					)
				}
				onClick={handleToggle}
				className="m-0"
			/>
		</Tooltip>
	)
}

export default ToggleVisibility
