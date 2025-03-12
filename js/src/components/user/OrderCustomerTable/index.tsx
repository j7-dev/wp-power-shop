import React from 'react'
import { TOrderCustomer } from '@/pages/admin/Orders/List/types'

export const OrderCustomerTable = ({
	customer,
}: {
	customer: TOrderCustomer
}) => {
	const {
		avg_order_value,
		date_last_active,
		date_last_order,
		display_name,
		id,
		ip_address,
		orders_count,
		total_spend,
		user_email,
		user_login,
		user_registered,
		user_registered_human,
	} = customer || {}
	return (
		<>
			<p className="text-sm text-[rgba(0,0,0,0.45)]">詳細資訊</p>
			<table className="table table-vertical table-xs text-xs">
				<tbody>
					<tr>
						<th>ID</th>
						<td>#{id}</td>
					</tr>
					<tr>
						<th>顯示名稱</th>
						<td>{display_name}</td>
					</tr>
					<tr>
						<th>帳號</th>
						<td>{user_login}</td>
					</tr>
					<tr>
						<th>Email</th>
						<td>{user_email}</td>
					</tr>
					<tr>
						<th>總訂單數</th>
						<td>{orders_count?.toLocaleString()}</td>
					</tr>
					<tr>
						<th>總消費金額</th>
						<td>{total_spend?.toLocaleString()}</td>
					</tr>
					<tr>
						<th>平均每筆訂單消費</th>
						<td>
							{(Math.round(avg_order_value * 100) / 100)?.toLocaleString()}
						</td>
					</tr>
					<tr>
						<th>下單時的 IP 位址</th>
						<td>{ip_address}</td>
					</tr>
					<tr>
						<th>上次登入帳號</th>
						<td>{date_last_active}</td>
					</tr>
					<tr>
						<th>上次下單時間</th>
						<td>{date_last_order}</td>
					</tr>
					<tr>
						<th>註冊時間</th>
						<td>
							{user_registered} ( {user_registered_human} )
						</td>
					</tr>
				</tbody>
			</table>
		</>
	)
}
