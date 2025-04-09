import { memo, useState } from 'react'
import { useModal } from '@refinedev/antd'
import { Button, Alert, Modal, Input } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { trim } from 'lodash-es'
import { useDeleteMany } from '@refinedev/core'
import { useAtom } from 'jotai'
import { selectedUserIdsAtom } from '@/components/user/UserTable/atom'

const CONFIRM_WORD = '沒錯，誰來阻止我都沒有用，我就是要刪用戶'

const DeleteButton = () => {
	const [selectedUserIds, setSelectedUserIds] = useAtom(selectedUserIdsAtom)
	const { show, modalProps, close } = useModal()
	const [value, setValue] = useState('')
	const { mutate: deleteMany, isLoading: isDeleting } = useDeleteMany()

	return (
		<>
			<Button
				type="primary"
				danger
				icon={<DeleteOutlined />}
				onClick={show}
				disabled={!selectedUserIds.length}
				className="m-0"
			>
				批次刪除用戶
				{selectedUserIds.length ? ` (${selectedUserIds.length})` : ''}
			</Button>

			<Modal
				{...modalProps}
				title={`刪除用戶 ${selectedUserIds.map((id) => `#${id}`).join(', ')}`}
				centered
				okButtonProps={{
					danger: true,
					disabled: trim(value) !== CONFIRM_WORD,
				}}
				okText="我已知曉影響，確認刪除"
				cancelText="取消"
				onOk={() => {
					deleteMany(
						{
							resource: 'users',
							ids: selectedUserIds as string[],
							mutationMode: 'optimistic',
							successNotification: (data, ids, resource) => {
								return {
									message: `用戶 ${ids?.map((id) => `#${id}`).join(', ')} 已刪除成功`,
									type: 'success',
								}
							},
						},
						{
							onSuccess: () => {
								close()
								setSelectedUserIds([])
							},
						},
					)
				}}
				confirmLoading={isDeleting}
			>
				<Alert
					message="危險操作"
					className="mb-2"
					description={
						<>
							<p>刪除用戶影響範圍包含:</p>
							<ol className="pl-6">
								<li>該用戶的訂單會變為訪客訂單</li>
								<li>第三方外掛，可能會因為找不到用戶而報錯</li>
							</ol>
						</>
					}
					type="error"
					showIcon
				/>
				<p className="mb-2">
					您確定要這麼做嗎?
					如果您已經知曉刪除用戶帶來的影響，並仍想要刪除這些用戶，請在下方輸入框輸入{' '}
					<b className="italic">{CONFIRM_WORD}</b>{' '}
				</p>
				<Input
					allowClear
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder="請輸入上述文字"
					className="mb-2"
				/>
			</Modal>
		</>
	)
}

export default memo(DeleteButton)
