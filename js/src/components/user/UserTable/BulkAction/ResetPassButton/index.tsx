import { MailOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useAtomValue } from 'jotai'
import { selectedUserIdsAtom } from '@/components/user/UserTable/atom'
import { useCustomMutation, useApiUrl } from '@refinedev/core'

const ResetPassButton = () => {
	const selectedUserIds = useAtomValue(selectedUserIdsAtom)
	const { mutate: resetPass, isLoading } = useCustomMutation()
	const apiUrl = useApiUrl()

	const handleResetPass = () => {
		resetPass({
			url: `${apiUrl}/users/resetpassword`,
			method: 'post',
			values: {
				ids: selectedUserIds,
			},
			successNotification: (data, ids, resource) => {
				return {
					message: `用戶 ${selectedUserIds?.map((id: string) => `#${id}`).join(', ')} 已發送重設密碼信件`,
					type: 'success',
				}
			},
		})
	}

	return (
		<Button
			type="primary"
			icon={<MailOutlined />}
			className="mr-2"
			loading={isLoading}
			onClick={handleResetPass}
		>
			批次傳送密碼重設連結
			{selectedUserIds.length ? ` (${selectedUserIds.length})` : ''}
		</Button>
	)
}

export default ResetPassButton
