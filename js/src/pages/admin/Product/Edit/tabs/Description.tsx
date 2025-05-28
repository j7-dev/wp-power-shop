import React from 'react'
import { Form, Input, Select, FormProps } from 'antd'
import { TaxonomyModals, Other, Gallery } from '@/components/product/fields'
import { useRecord } from '@/pages/admin/Product/Edit/hooks'
import {
	Heading,
	DatePicker,
	NameId,
	useEnv,
	CopyText,
	BlockNoteDrawer,
	DescriptionDrawer,
} from 'antd-toolkit'
import { TProductType, useWoocommerce } from 'antd-toolkit/wp'

const { Item } = Form

export const Description = ({ formProps }: { formProps: FormProps }) => {
	const watchProductType = Form.useWatch(['type'], formProps.form)
	const record = useRecord()
	const { product_types, permalinks } = useWoocommerce()
	const { SITE_URL } = useEnv()

	const product_base_url = `${SITE_URL}/${permalinks.product_base}`
	const watchSlug = Form.useWatch(['slug'], formProps.form)
	return (
		<Form {...formProps}>
			<div className="flex flex-col xl:flex-row gap-12">
				<div className="w-full xl:flex-1">
					<Item name={['id']} hidden />
					<Item
						name={['type']}
						label="商品類型"
						tooltip="非簡單類型商品不能轉換為其他商品類型"
					>
						<Select
							optionRender={(option) => (
								<NameId name={option.label} id={option.value as string} />
							)}
							options={product_types}
							disabled={record?.type !== 'simple'}
						/>
					</Item>

					<Item name={['name']} label="商品名稱">
						<Input allowClear />
					</Item>

					<Item name={['slug']} label="永久連結">
						<Input
							addonBefore={`${product_base_url}/`}
							addonAfter={
								<CopyText text={`${product_base_url}/${watchSlug}`} />
							}
							allowClear
						/>
					</Item>

					<div className="grid grid-cols-2 gap-4 mb-8">
						<div>
							<label className="text-sm pb-2 inline-block">簡短說明</label>
							<div>
								<BlockNoteDrawer resource="products" />
							</div>
						</div>
						<div>
							<DescriptionDrawer
								resource="products"
								editorFormItemProps={{
									label: '商品內容',
								}}
							/>
						</div>
					</div>

					<Heading>其他設定</Heading>
					<div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
						<Other type={watchProductType as TProductType} />
					</div>
				</div>
				<div className="w-full xl:w-[30rem]">
					<Heading>發佈時間</Heading>
					<DatePicker
						formItemProps={{
							name: ['date_created'],
							label: '發佈時間',
							className: 'mb-0',
							tooltip: '你可以透過控制發布時間，搭配短代碼，控制課程的排列順序',
						}}
					/>
					<Heading>商品圖片</Heading>
					<div className="mb-6">
						<Gallery />
					</div>

					<Heading>商品分類</Heading>
					<div className="mb-8">
						<TaxonomyModals />
					</div>

					<Heading>頁面模板</Heading>
					<Item name="page_template" label="頁面模板">
						<Select options={record?.page_template_options} />
					</Item>
				</div>
			</div>
		</Form>
	)
}
