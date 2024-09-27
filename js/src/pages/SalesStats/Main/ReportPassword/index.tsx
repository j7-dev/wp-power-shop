import { useEffect } from 'react'
import { Modal, Input, Alert, notification, Form } from 'antd'
import { KeyOutlined, LinkOutlined } from '@ant-design/icons'
import { useModal, useAjaxGetPostMeta, useAjax } from '@/hooks'
import { permalink, postId, snake } from '@/utils'

const ReportPassword = () => {
	const [form] = Form.useForm()
	const [
		api,
		contextHolder,
	] = notification.useNotification()

	const { showModal, modalProps: deaultModalProps, setIsModalOpen } = useModal()

	const { mutate: updatePostMeta, isLoading: updateIsLoading } = useAjax()

	const handleUpdate = () => {
		form.validateFields().then((values) => {
			const { password } = values
			const encryptedPassword = btoa(password)
			updatePostMeta(
				{
					action: 'handle_update_post_meta',
					post_id: postId,
					meta_key: `${snake}_report_password`,
					meta_value: encryptedPassword,
				},
				{
					onSuccess: () => {
						api.success({
							message: '頁面報告密碼更新成功',
						})
						setIsModalOpen(false)
					},
					onError: (error) => {
						console.log(error)
						api.error({
							message: '頁面報告密碼更新失敗，請再試一次',
						})
					},
				},
			)
		})
	}

	const modalProps = {
		...deaultModalProps,
		title: '設定頁面報告密碼',
		centered: true,
		onOk: handleUpdate,
		okText: '儲存',
		cancelText: '取消',
		confirmLoading: updateIsLoading,
	}

	const result = useAjaxGetPostMeta<string>({
		post_id: postId,
		meta_key: `${snake}_report_password`,
	})
	const fetchedReportPassword = result?.meta ?? ''

	useEffect(() => {
		const decryptedReportPassword = atob(fetchedReportPassword)
		if (decryptedReportPassword) {
			form.setFieldValue(['password'], decryptedReportPassword)
		}
	}, [fetchedReportPassword])

	return (
		<Form form={form}>
			{contextHolder}
			<div
				className="flex items-center my-2  cursor-pointer"
				onClick={showModal}
			>
				<KeyOutlined className="text-yellow-400 text-2xl mr-2" />
				設定頁面報告密碼
			</div>
			<Modal {...modalProps}>
				<Alert
					message="Power Shop 提供一個頁面報告，使用者可以直接輸入網址與密碼後，直接看到頁面報告"
					type="info"
					className="mb-8"
					showIcon
				/>
				<div className="flex justify-between">
					<span>設定密碼</span>
					<a target="_blank" href={`${permalink}report`} rel="noreferrer">
						前往頁面報告
						<LinkOutlined className="ml-1" />
					</a>
				</div>
				<Form.Item
					name={['password']}
					rules={[{ required: true, message: '密碼不能為空' }]}
					hasFeedback={true}
				>
					<Input placeholder="請輸入密碼" />
				</Form.Item>
			</Modal>
		</Form>
	)
}

export default ReportPassword
