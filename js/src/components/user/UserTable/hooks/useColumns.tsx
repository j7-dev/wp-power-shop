import { TableProps } from 'antd'
import { TUserRecord } from '@/pages/admin/Users/types'
import { UserName, UserRole } from 'antd-toolkit/wp'
import { Price } from '@/components/general'
import dayjs from 'dayjs'
import { useNavigation } from '@refinedev/core'

const useColumns = () => {
	const { edit } = useNavigation()
	const columns: TableProps<TUserRecord>['columns'] = [
		{
			title: '會員',
			dataIndex: 'id',
			width: 300,
			render: (id, record) => (
				<UserName record={record} onClick={() => edit('users', id)} />
			),
			fixed: 'left',
		},
		{
			title: '角色',
			dataIndex: 'role',
			width: 120,
			render: (role: string) => <UserRole role={role} />,
		},
		{
			title: '手機',
			dataIndex: 'billing_phone',
			width: 180,
		},
		{
			title: '生日',
			dataIndex: 'user_birthday',
			width: 180,
		},
		{
			title: '總訂單數',
			dataIndex: 'orders_count',
			align: 'right',
			width: 120,
		},
		{
			title: '總消費金額',
			dataIndex: 'total_spend',
			align: 'right',
			width: 180,
			render: (total_spend) => <Price amount={total_spend} />,
		},
		{
			title: '平均每筆訂單消費',
			dataIndex: 'avg_order_value',
			align: 'right',
			width: 180,
			render: (avg_order_value) => (
				<Price amount={avg_order_value} precision={2} />
			),
		},

		{
			title: '註冊時間',
			dataIndex: 'user_registered',
			width: 180,
			align: 'right',
			render: (user_registered, record) => (
				<>
					<p className="m-0">已註冊 {record?.user_registered_human}</p>
					<p className="m-0 text-gray-400 text-xs">{user_registered}</p>
				</>
			),
		},
		// TODO 操作
	]

	return columns
}

export default useColumns
