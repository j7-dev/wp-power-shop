import React from 'react'
import { Form, FormProps } from 'antd'
import { Price as PriceField } from '@/components/product/fields'
import { useRecord } from '@/pages/admin/Product/Edit/hooks'
import { TProductType } from 'antd-toolkit/wp'

export const Price = ({ formProps }: { formProps: FormProps }) => {
	const record = useRecord()
	return (
		<Form {...formProps}>
			<div className="grid grid-cols-3 gap-x-12">
				<PriceField type={record?.type as TProductType} />
			</div>
		</Form>
	)
}
