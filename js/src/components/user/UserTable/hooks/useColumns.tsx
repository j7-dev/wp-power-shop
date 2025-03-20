import { TableProps } from 'antd'
import { TUserRecord } from '@/pages/admin/Users/types'
import { UserName, UserRole } from 'antd-toolkit/wp'
import { Price } from '@/components/general'
import dayjs from 'dayjs'

const useColumns = () => {
	const columns: TableProps<TUserRecord>['columns'] = [
		{
			title: '會員',
			dataIndex: 'id',
			width: 300,
			render: (_, record) => <UserName record={record} />,
		},
		{
			title: '角色',
			dataIndex: 'roles',
			width: 120,
			render: (roles: string[]) =>
				roles?.map((role) => <UserRole key={role} role={role} />),
		},
		{
			title: '手機',
			dataIndex: 'billing_phone',
			width: 180,
		},
		{
			title: '生日',
			dataIndex: 'pc_birthday',
			width: 180,
			render: (pc_birthday) =>
				pc_birthday ? dayjs.unix(pc_birthday).format('YYYY-MM-DD') : '',
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
	]

	return columns
}

export default useColumns
