import { MailOutlined } from '@ant-design/icons'
import { Button, ButtonProps } from 'antd'
import { useCustomMutation, useApiUrl } from '@refinedev/core'

const ResetPassButton = ({
	user_ids,
	mode = undefined,
	...buttonProps
}: ButtonProps & {
	user_ids?: string[]
	mode?: 'multiple' | undefined
}) => {
	const { mutate: resetPass, isLoading } = useCustomMutation()
	const apiUrl = useApiUrl()

	const handleResetPass = () => {
		resetPass({
			url: `${apiUrl}/users/resetpassword`,
			method: 'post',
			values: {
				ids: user_ids,
			},
			successNotification: (data, ids, resource) => {
				return {
					message: `用戶 ${user_ids?.map((id: string) => `#${id}`).join(', ')} 已發送重設密碼信件`,
					type: 'success',
				}
			},
		})
	}

	const btnText =
		mode === 'multiple'
			? `批次傳送密碼重設連結 ${user_ids?.length ? ` (${user_ids?.length})` : ''}`
			: '傳送密碼重設連結'

	return (
		<Button
			color="primary"
			variant="solid"
			icon={<MailOutlined />}
			{...buttonProps}
			loading={isLoading}
			onClick={handleResetPass}
		>
			{btnText}
		</Button>
	)
}

export default ResetPassButton
