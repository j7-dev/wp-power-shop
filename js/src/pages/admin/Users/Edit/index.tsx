import { memo, useMemo, useState } from 'react'
import { Edit, useForm } from '@refinedev/antd'
import { Form, Button, Space } from 'antd'
import { Detail } from './Detail'
import { TUserDetails } from '@/pages/admin/Users/types'
import { useParsed } from '@refinedev/core'
import { EditOutlined } from '@ant-design/icons'
import { IsEditingContext, RecordContext } from './hooks'
import { UserName } from 'antd-toolkit/wp'
import { NameId } from 'antd-toolkit'

const EditComponent = () => {
	const { id } = useParsed()
	const [isEditing, setIsEditing] = useState(false)

	// 初始化資料
	const { formProps, saveButtonProps, query, mutation } = useForm<TUserDetails>(
		{
			action: 'edit',
			resource: 'users',
			id,
			redirect: false,
			successNotification: false,
			errorNotification: false,
		},
	)

	const record: TUserDetails | undefined = useMemo(
		() => query?.data?.data,
		[query?.isFetching],
	)

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
						<Form {...formProps} layout="vertical">
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
