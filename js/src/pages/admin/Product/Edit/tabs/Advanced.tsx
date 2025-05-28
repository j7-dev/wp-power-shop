import React from 'react'
import { Form, FormProps, InputNumber } from 'antd'
import { PurchaseNote } from '@/components/product/fields'
import { isVariation, TProductType } from 'antd-toolkit/wp'

const { Item } = Form

export const Advanced = ({ formProps }: { formProps: FormProps }) => {
	const watchProductType = Form.useWatch(['type'], formProps.form)

	const name = isVariation(watchProductType as string)
		? '_variation_description'
		: 'purchase_note'

	return (
		<Form {...formProps}>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 xl:gap-x-12">
				{!['grouped', 'external'].includes(
					watchProductType as TProductType,
				) && <PurchaseNote name={name} />}

				<Item name={['menu_order']} label="選單順序">
					<InputNumber className="w-full" />
				</Item>
			</div>
		</Form>
	)
}
