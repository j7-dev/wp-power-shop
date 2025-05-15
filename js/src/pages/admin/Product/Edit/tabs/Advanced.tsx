import React from 'react'
import { Form, FormProps, InputNumber } from 'antd'

const { Item } = Form

export const Advanced = ({ formProps }: { formProps: FormProps }) => {
	return (
		<Form {...formProps}>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 xl:gap-x-12"></div>
		</Form>
	)
}
