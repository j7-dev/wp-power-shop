import { useRecord } from '@/pages/admin/Users/Edit/hooks'
import { Price } from '@/components/general'
import { Empty } from 'antd'

const RecentOrders = () => {
	const record = useRecord()
	const { cart } = record
	const cartTotal = cart?.reduce((acc, item) => acc + item?.line_total, 0)
	return (
		<div className="rounded-lg border border-gray-200 border-solid p-3 mb-12">
			<h3 className="text-xs font-medium mb-2">用戶當前購物車包含：</h3>
			{!cart?.length && (
				<Empty className="text-xs" description="用戶購物車空空如也" />
			)}

			{!!cart?.length &&
				cart?.map(({ product_id, product_name, quantity, product_image }) => (
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
				))}
			<div className="bg-gray-200 h-[1px] w-full my-2" />
			<div className="flex justify-between items-center text-xs">
				<span>購物車金額</span>
				<Price amount={cartTotal} />
			</div>
		</div>
	)
}

export default RecentOrders
