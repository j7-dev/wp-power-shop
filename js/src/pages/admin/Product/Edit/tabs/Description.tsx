import React from 'react'
import { Form, Input, Select, FormProps } from 'antd'
import {
	PurchaseNote,
	TaxonomyModals,
	Other,
	Gallery,
} from '@/components/product/fields'
import { useRecord } from '@/pages/admin/Product/Edit/hooks'
import { Heading } from 'antd-toolkit'
import { TProductType } from 'antd-toolkit/wp'

const { Item } = Form

export const Description = ({ formProps }: { formProps: FormProps }) => {
	const record = useRecord()

	return (
		<Form {...formProps}>
			<div className="flex flex-col xl:flex-row gap-12">
				<div className="w-full xl:flex-1">
					<Item name="name" label="商品名稱">
						<Input allowClear />
					</Item>

					<Item name="slug" label="永久連結">
						<Input allowClear />
					</Item>

					<PurchaseNote />

					<div>簡短說明</div>
					<div>編輯器</div>

					<Heading>其他</Heading>
					<div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
						<Other type={(record?.type || 'simple') as TProductType} />
					</div>
				</div>
				<div className="w-full xl:w-[30rem]">
					<Gallery />
					<TaxonomyModals />

					<Item name="page_template" label="頁面模板">
						<Select options={record?.page_template_options} />
					</Item>
				</div>
			</div>
		</Form>
	)
}
