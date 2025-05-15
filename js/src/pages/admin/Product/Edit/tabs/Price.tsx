import React from 'react'
import { Form, FormProps, Input } from 'antd'
import { Price as PriceField } from '@/components/product/fields'
import { TProductType } from 'antd-toolkit/wp'

const { Item } = Form
export const Price = ({ formProps }: { formProps: FormProps }) => {
	const watchProductType = Form.useWatch(['type'], formProps.form)
	return (
		<Form {...formProps}>
			{'external' === watchProductType && (
				<>
					<Item name={['_product_url']} label="商品網址">
						<Input className="w-full" allowClear />
					</Item>
					<Item name={['_button_text']} label="按鈕文字">
						<Input className="w-full" allowClear />
					</Item>
				</>
			)}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 xl:gap-x-12">
				<PriceField type={watchProductType as TProductType} />
			</div>
		</Form>
	)
}
