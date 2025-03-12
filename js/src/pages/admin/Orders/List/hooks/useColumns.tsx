import React from 'react'
import { Table, TableProps, Tag, Tooltip } from 'antd'
import { TOrderBaseRecord } from '@/pages/admin/Orders/List/types'
import { ORDER_STATUS, ProductPrice, UserName } from 'antd-toolkit/wp'
import { PostAction } from '@/components/post'
import { Link } from '@refinedev/core'

const useColumns = () => {
	const columns: TableProps<TOrderBaseRecord>['columns'] = [
		Table.SELECTION_COLUMN,
		{
			title: '訂單',
			dataIndex: 'order_number',
			render: (order_number, { id }) => {
				return <Link to={`/orders/edit/${id}`}>#{order_number}</Link>
			},
		},
		{
			title: '總金額',
			dataIndex: 'total',
			align: 'right',
			render: (total, { payment_method_title }) => {
				return (
					<Tooltip title={`經由 ${payment_method_title}`}>
						<ProductPrice
							record={{
								price_html: total,
							}}
						/>{' '}
					</Tooltip>
				)
			},
		},
		{
			title: '訂單狀態',
			align: 'center',
			dataIndex: 'status',
			render: (status) => {
				const findStatus = ORDER_STATUS.find((item) => item.value === status)
				return (
					<Tag color={findStatus?.color || 'default'} bordered={false}>
						{findStatus?.label || '未知狀態'}
					</Tag>
				)
			},
		},
		{
			title: '付款狀態',
			align: 'center',
			dataIndex: 'payment_complete',
			render: (payment_complete, { date_paid }) => {
				return (
					<Tooltip title={`於 ${date_paid} 付款`}>
						<Tag
							color={payment_complete ? 'green' : 'volcano'}
							bordered={false}
						>
							{payment_complete ? '已付款' : '未付款'}
						</Tag>
					</Tooltip>
				)
			},
		},
		{
			title: '送貨狀態',
			align: 'center',
			dataIndex: 'shipping_status',
			render: (shipping_status) => {
				const findStatus = ORDER_STATUS.find(
					(item) => item.value === shipping_status,
				)
				return (
					<Tag color={findStatus?.color || 'default'} bordered={false}>
						{findStatus?.label || '未知狀態'}
					</Tag>
				)
			},
		},
		{
			title: '訂單內容',
			dataIndex: 'items',
			render: (items) => {
				return items.map(({ id, name, quantity, total }) => {
					return (
						<div key={id} className="text-sm">
							<Link to={`/products/edit/${id}`}>{name}</Link> x {quantity}
						</div>
					)
				})
			},
		},
		{
			title: '訂購人',
			dataIndex: 'customer',
			width: 200,
			render: (customer) => {
				return (
					<Link to={`/users/edit/${customer.id}`}>
						<UserName record={customer} hideImage />
					</Link>
				)
			},
		},
		{
			title: '創建時間',
			align: 'center',
			dataIndex: 'date_created',
			width: 200,
			render: (date_created, { date_modified }) => {
				return (
					<>
						<p className="text-xs text-gray-400 m-0">於 {date_modified} 修改</p>
						<p className="text-xs text-gray-400 m-0">於 {date_created} 創建</p>
					</>
				)
			},
		},
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
