import { memo, createContext, useMemo } from 'react'
import { Edit, useForm } from '@refinedev/antd'
import { Form, Tag, Button } from 'antd'
import { Detail } from './Detail'
import { TOrderRecord, TOrderBaseRecord } from '@/pages/admin/Orders/List/types'
import { useParsed } from '@refinedev/core'

import { ORDER_STATUS } from 'antd-toolkit/wp'

export const RecordContext = createContext<TOrderRecord | undefined>(undefined)

const EditComponent = () => {
	const { id } = useParsed()

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
				>
					<Form {...formProps} layout="vertical">
						<div className="flex justify-end">
							<Button
								type="default"
								target="_blank"
								href={record?.edit_order_url}
							>
								前往 WordPress 訂單介面
							</Button>
						</div>
						<Detail />
					</Form>
				</Edit>
			</div>
		</RecordContext.Provider>
	)
}

export const OrdersEdit = memo(EditComponent)
