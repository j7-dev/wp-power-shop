import React from 'react'
import { Form, Input, Select, FormInstance, Switch } from 'antd'

const { Item } = Form

const OPTIONS = [
	{
		label: '自訂排序',
		value: 'menu_order',
	},
	{
		label: '名稱',
		value: 'name',
	},
	{
		label: '名稱 (數值的)',
		value: 'name_num',
	},
	{
		label: 'ID',
		value: 'id',
	},
]

export type TFormValues = {
	id: string
	name: string
	slug: string
	type: 'select' | 'text'
	order_by: (typeof OPTIONS)[number]['value']
	has_archives: boolean
}

const AttributesForm = ({
	form,
	onFinish,
}: {
	form: FormInstance
	onFinish: (values: TFormValues) => void
}) => {
	return (
		<Form<TFormValues> form={form} layout="vertical" onFinish={onFinish}>
			<Item name="id" hidden />
			<Item
				label="名稱"
				name="name"
				tooltip="商品規格名稱 (在前台顯示)"
				rules={[{ required: true, message: '請輸入名稱' }]}
			>
				<Input allowClear />
			</Item>
			<Item
				label="代稱"
				name="slug"
				tooltip="商品規格唯一的網址別名/參考; 長度需少於 28 字元。"
				rules={[{ required: true, message: '請輸入代稱' }]}
				getValueProps={(rawSlug?: string) => {
					const slug = rawSlug?.replace('pa_', '')
					return {
						value: slug,
					}
				}}
			>
				<Input maxLength={28} showCount allowClear addonBefore="pa_" />
			</Item>
			<Item
				label="啟用彙整?"
				name="has_archives"
				tooltip="如果你希望商店商品的此一屬性有彙整請啟用此項"
				normalize={(value) => {
					return value ? '1' : '0'
				}}
			>
				<Switch />
			</Item>

			{/* <Item
				label="預設排列順序"
				name="orderby"
				tooltip="決定項目在前台商品頁面的排列順序，如果使用自訂排序的話，你可以拖拉項目來調整順序"
				initialValue="menu_order"
			>
				<Select options={OPTIONS} allowClear />
			</Item> */}
		</Form>
	)
}

export default AttributesForm
