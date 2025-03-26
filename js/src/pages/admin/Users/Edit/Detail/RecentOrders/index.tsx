import { useRecord } from '@/pages/admin/Users/Edit/hooks'
import { Price } from '@/components/general'
import { Tag } from 'antd'
import { ORDER_STATUS } from 'antd-toolkit/wp'

const RecentOrders = () => {
	const record = useRecord()
	const { recent_orders } = record
	return (
		<div className="mb-12">
			{recent_orders?.map(
				({ order_id, order_date, order_total, order_status, order_items }) => {
					const findStatus = ORDER_STATUS.find(
						(item) => item.value === order_status,
					)
					return (
						<div
							key={order_id}
							className="rounded-lg border border-gray-200 border-solid p-3 mb-4"
						>
							<div className="flex items-center justify-between mb-2">
								<div>
									<h3 className="text-sm font-medium">#{order_id}</h3>
									<p className="text-xs text-gray-400 mb-0">{order_date}</p>
								</div>
								<Tag
									className="m-0"
									color={findStatus?.color || 'default'}
									bordered={false}
								>
									{findStatus?.label || '未知狀態'}
								</Tag>
							</div>
							{order_items?.map(
								({ product_id, product_name, quantity, product_image }) => (
									<div
										key={product_id}
										className="grid grid-cols-[2rem_1fr_0.5rem_2rem] items-center mb-2 text-xs"
									>
										<img
											alt={product_name}
											loading="lazy"
											decoding="async"
											className="rounded-md text-transparent size-8 object-cover"
											src={product_image}
										/>
										<span className="mx-2 truncate">{product_name}</span>
										<span>x</span>
										<span className="text-right">{quantity}</span>
									</div>
								),
							)}
							<div className="bg-gray-200 h-[1px] w-full my-2" />
							<div className="flex justify-between items-center text-xs">
								<span>訂單總額</span>
								<Price amount={order_total} />
							</div>
						</div>
					)
				},
			)}
		</div>
	)
}

export default RecentOrders
