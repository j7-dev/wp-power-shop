import { TableProps } from 'antd'
import { TUserRecord } from '@/pages/admin/Users/types'
import { UserName } from 'antd-toolkit/wp'
import { WatchStatusTag, getWatchStatusTagTooltip, NameId } from 'antd-toolkit'
import { TGrantedDoc } from '@/types'

type TUseColumnsParams = {
	onClick?: (_record: TUserRecord | undefined) => () => void
}

const useColumns = (params?: TUseColumnsParams) => {
	const handleClick = params?.onClick
	const columns: TableProps<TUserRecord>['columns'] = [
		{
			title: '會員',
			dataIndex: 'id',
			width: 180,
			render: (_, record) => <UserName record={record} onClick={handleClick} />,
		},
		{
			title: '已開通知識庫',
			dataIndex: 'granted_docs',
			width: 240,
			render: (granted_docs: TGrantedDoc[], { id: user_id, display_name }) => {
				return granted_docs?.map(({ id, name, expire_date }) => (
					<div key={id} className="grid grid-cols-[1fr_4rem_12rem] gap-1 my-1">
						<NameId name={name} id={id} />

						<div className="text-center">
							<WatchStatusTag expireDate={expire_date} />
						</div>

						<div className="text-left">
							{getWatchStatusTagTooltip(expire_date)}
						</div>
					</div>
				))
			},
		},
		{
			title: '註冊時間',
			dataIndex: 'user_registered',
			width: 180,
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
