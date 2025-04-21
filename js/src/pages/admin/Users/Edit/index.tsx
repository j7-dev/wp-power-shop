import { memo, useMemo, useState, useEffect } from 'react'
import { Edit, useForm } from '@refinedev/antd'
import { Form, Button, Space } from 'antd'
import { Detail } from './Detail'
import { TUserDetails } from '@/components/user/types'
import { useParsed } from '@refinedev/core'
import { EditOutlined } from '@ant-design/icons'
import { IsEditingContext, RecordContext } from './hooks'
import { UserName } from 'antd-toolkit/wp'
import { NameId } from 'antd-toolkit'

const EditComponent = () => {
	const { id } = useParsed()
	const [isEditing, setIsEditing] = useState(false)

	// 初始化資料
	const { formProps, saveButtonProps, query, mutation, onFinish } =
		useForm<TUserDetails>({
			action: 'edit',
			resource: 'users',
			id,
			redirect: false,
			successNotification: false,
			errorNotification: false,
		})

	const record: TUserDetails | undefined = useMemo(
		() => query?.data?.data,
		[query?.isFetching],
	)

	useEffect(() => {
		if (isEditing) {
			formProps?.form?.resetFields()
		}
	}, [isEditing])

	const handleOnFinish = (values: TUserDetails) => {
		// 傳給後端前將 billing 和 shipping 的資料轉換為 billing_{field} 和 shipping_{field}， 並刪除原本的 billing 和 shipping 資料
		const billing_or_shipping = ['billing', 'shipping']
		let newValues = values
		billing_or_shipping.forEach((type) => {
			if (newValues?.[type as keyof TUserDetails]) {
				const renamedInfo = Object.fromEntries(
					Object.entries(newValues?.[type]).map(([key, value]) => {
						return [`${type}_${key}`, value]
					}),
				)
				newValues = {
					...newValues,
					...renamedInfo,
				}
				delete newValues[type as keyof TUserDetails]
			}
		})

		onFinish(newValues)
	}

	return (
		<IsEditingContext.Provider value={isEditing}>
			<RecordContext.Provider value={record}>
				<div className="sticky-card-actions sticky-tabs-nav">
					<Edit
						resource="posts"
						title={<NameId name={record?.display_name} id={record?.id || ''} />}
						headerButtons={() => null}
						saveButtonProps={{
							...saveButtonProps,
							children: '儲存',
							icon: null,
							loading: mutation?.isLoading,
						}}
						isLoading={query?.isLoading}
						footerButtons={({ defaultButtons }) => (
							<>
								{!isEditing && (
									<Button
										type="default"
										onClick={() => setIsEditing(true)}
										icon={<EditOutlined />}
									>
										編輯用戶
									</Button>
								)}

								{isEditing && (
									<Space.Compact>
										<Button type="default" onClick={() => setIsEditing(false)}>
											取消
										</Button>
										{defaultButtons}
									</Space.Compact>
								)}
							</>
						)}
					>
						<Form {...formProps} onFinish={handleOnFinish} layout="vertical">
							<div className="flex justify-between pc-nav py-2">
								<div>{record && <UserName record={record} />}</div>
								<Button type="default" target="_blank" href={record?.edit_url}>
									前往傳統用戶編輯介面
								</Button>
							</div>
							<Detail />
						</Form>
					</Edit>
				</div>
			</RecordContext.Provider>
		</IsEditingContext.Provider>
	)
}

export const UsersEdit = memo(EditComponent)
