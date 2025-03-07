import { memo, useState } from 'react'
import { useModal } from '@refinedev/antd'
import { Button, Alert, Modal, Input } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { trim } from 'lodash-es'
import { useDeleteMany } from '@refinedev/core'

const CONFIRM_WORD = '沒錯，誰來阻止我都沒有用，我就是要刪訂單'

const DeleteButton = ({
	selectedRowKeys,
	setSelectedRowKeys,
}: {
	selectedRowKeys: React.Key[]
	setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>
}) => {
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
				disabled={!selectedRowKeys.length}
				className="m-0"
			>
				批次刪除訂單
				{selectedRowKeys.length ? ` (${selectedRowKeys.length})` : ''}
			</Button>

			<Modal
				{...modalProps}
				title={`刪除訂單 ${selectedRowKeys.map((id) => `#${id}`).join(', ')}`}
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
							resource: 'orders',
							ids: selectedRowKeys as string[],
							mutationMode: 'optimistic',
							successNotification: (data, ids, resource) => {
								return {
									message: `訂單 ${ids?.map((id) => `#${id}`).join(', ')} 已刪除成功`,
									type: 'success',
								}
							},
							errorNotification: (data, ids, resource) => {
								return {
									message: 'OOPS，出錯了，請在試一次',
									type: 'error',
								}
							},
						},
						{
							onSuccess: () => {
								close()
								setSelectedRowKeys([])
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
							<p>刪除訂單影響範圍包含:</p>
							<ol className="pl-6">
								<li>買過訂單的用戶將不能再存取</li>
								<li>訂單的章節也將被刪除</li>
								<li>與訂單連動的商品，將不再連動訂單</li>
							</ol>
						</>
					}
					type="error"
					showIcon
				/>
				<p className="mb-2">
					您確定要這麼做嗎?
					如果您已經知曉刪除訂單帶來的影響，並仍想要刪除這些訂單，請在下方輸入框輸入{' '}
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
