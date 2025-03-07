import React from 'react'
import { Table, TableProps, Tag } from 'antd'
import { TDocBaseRecord } from '@/pages/admin/Docs/List/types'
import { ProductName as PostName, POST_STATUS } from 'antd-toolkit/wp'
import { PostAction } from '@/components/post'
import { useNavigation } from '@refinedev/core'

const useColumns = () => {
	const { edit } = useNavigation()
	const onClick = (record: TDocBaseRecord) => () => {
		edit('docs', record.id)
	}
	const columns: TableProps<TDocBaseRecord>['columns'] = [
		Table.SELECTION_COLUMN,
		{
			title: '商品名稱',
			dataIndex: 'name',
			width: 300,
			render: (_, record) => (
				<PostName<TDocBaseRecord> record={record} onClick={onClick(record)} />
			),
		},
		{
			title: '需要開通權限',
			dataIndex: 'need_access',
			width: 80,
			render: (need_access) => {
				const needAccess = 'yes' === need_access
				return (
					<Tag color={needAccess ? 'gold' : 'cyan'} bordered={false}>
						{needAccess ? '需要' : '不需要'}
					</Tag>
				)
			},
		},
		{
			title: '狀態',
			dataIndex: 'status',
			width: 80,
			render: (status) => {
				const findStatus = POST_STATUS.find((item) => item.value === status)
				return (
					<Tag color={findStatus?.color || 'default'} bordered={false}>
						{findStatus?.label || '未知狀態'}
					</Tag>
				)
			},
		},

		// {
		// 	title: '商品分類 / 商品標籤',
		// 	dataIndex: 'category_ids',
		// 	key: 'category_ids',
		// 	render: (_, record) => <ProductCat record={record} />,
		// },
		{
			title: '操作',
			dataIndex: '_actions',
			width: 120,
			render: (_, record) => <PostAction record={record} />,
		},
	]

	return columns
}

export default useColumns
