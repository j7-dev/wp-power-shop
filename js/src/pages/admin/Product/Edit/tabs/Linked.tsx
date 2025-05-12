import React from 'react'
import { Form, FormProps, InputNumber } from 'antd'

const { Item } = Form

export const Linked = ({ formProps }: { formProps: FormProps }) => {
	return (
		<Form {...formProps}>
			<div className="grid grid-cols-3 gap-x-12">追加銷售 交叉銷售</div>
		</Form>
	)
}
