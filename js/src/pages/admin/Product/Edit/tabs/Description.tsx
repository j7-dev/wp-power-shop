import React from 'react'
import { Form, Input, Select } from 'antd'
import {
	PurchaseNote,
	TaxonomyModal,
	Other,
	Gallery,
} from '@/components/product/fields'
import { useRecord } from '@/pages/admin/Product/Edit/hooks'
import { MediaLibraryModal } from '@/components/general'
import { Heading } from 'antd-toolkit'
import { TProductType } from 'antd-toolkit/wp'

const { Item } = Form

export const Description = () => {
	const record = useRecord()

	return (
		<>
			<div className="grid grid-cols-[3fr_1fr] gap-12">
				<div>
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
					<div className="grid grid-cols-6 gap-x-12">
						<Other type={(record?.type || 'simple') as TProductType} />
					</div>
				</div>
				<div>
					<Gallery />
					<TaxonomyModal />

					<Item name="page_template" label="頁面模板">
						<Select options={record?.page_template_options} />
					</Item>
				</div>
			</div>
			<MediaLibraryModal />
		</>
	)
}
