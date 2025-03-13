import { memo, createContext, useMemo, useState } from 'react'
import { Edit, useForm } from '@refinedev/antd'
import { Form, Tag, Button, Space } from 'antd'
import { Detail } from './Detail'
import { TOrderRecord, TOrderBaseRecord } from '@/pages/admin/Orders/List/types'
import { useParsed } from '@refinedev/core'
import { EditOutlined } from '@ant-design/icons'
import { ORDER_STATUS } from 'antd-toolkit/wp'

export const RecordContext = createContext<TOrderRecord | undefined>(undefined)
export const IsEditingContext = createContext<boolean>(false)

const EditComponent = () => {
	const { id } = useParsed()
	const [isEditing, setIsEditing] = useState(false)

	// 初始化資料
	const { formProps, saveButtonProps, query, mutation } = useForm<TOrderRecord>(
		{
			action: 'edit',
			resource: 'orders',
			id,
			redirect: false,
			successNotification: false,
			errorNotification: false,
		},
	)

	const record: TOrderBaseRecord | undefined = useMemo(
		() => query?.data?.data,
		[query?.isFetching],
	)

	const status = ORDER_STATUS.find(
		(order_status) => order_status.value === record?.status,
	)

	return (
		<IsEditingContext.Provider value={isEditing}>
			<RecordContext.Provider value={record}>
				<div className="sticky-card-actions sticky-tabs-nav">
					<Edit
						resource="posts"
						title={
							<>
								訂單 #{record?.id}{' '}
								<Tag color={status?.color} bordered={false}>
									{status?.label}
								</Tag>
							</>
						}
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
										編輯訂單
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
							<div className="flex justify-end">
								<Button
									type="default"
									target="_blank"
									href={record?.edit_order_url}
								>
									前往傳統訂單介面
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

export const OrdersEdit = memo(EditComponent)
