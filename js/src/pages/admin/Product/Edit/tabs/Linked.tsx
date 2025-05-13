import React from 'react'
import { Form, FormProps } from 'antd'
import { ProductSelector } from '@/components/product'
import upsell_ids_img from '@/assets/images/upsell_ids.jpg'
import cross_sell_ids_img from '@/assets/images/cross_sell_ids.jpg'

export const Linked = ({ formProps }: { formProps: FormProps }) => {
	return (
		<Form {...formProps}>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<ProductSelector
						formItemProps={{
							name: ['upsell_ids'],
							label: '追加銷售',
							help: '追加銷售商品會顯示在商品頁下方，如下圖',
						}}
					/>
					<img className="w-full mt-4" src={upsell_ids_img} alt="追加銷售" />
				</div>
				<div>
					<ProductSelector
						formItemProps={{
							name: ['cross_sell_ids'],
							label: '交叉銷售',
							help: '交叉銷售商品會在結帳時顯示在購物車頁面下方，如下圖',
						}}
					/>
					<img
						className="w-full mt-4"
						src={cross_sell_ids_img}
						alt="交叉銷售"
					/>
				</div>
			</div>
		</Form>
	)
}
