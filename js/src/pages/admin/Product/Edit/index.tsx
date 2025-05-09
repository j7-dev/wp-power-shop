import { memo, useState } from 'react'
import { Tabs, TabsProps, Form, Switch, Button, Select, FormProps } from 'antd'
import { useWoocommerce } from '@/hooks'
import { Edit, useForm } from '@refinedev/antd'
import { useParsed } from '@refinedev/core'
import {
	Description,
	Stock,
	Price,
	Attributes,
	Variation,
} from '@/pages/admin/Product/Edit/tabs'
import { TProductRecord } from '@/components/product/types'
import { RecordContext } from '@/pages/admin/Product/Edit/hooks'
// import { PostEdit } from './PostEdit'
import { defaultSelectProps } from 'antd-toolkit'
import { TImage } from 'antd-toolkit/wp'
import { notificationProps } from 'antd-toolkit/refine'

const { Item } = Form

const EditComponent = () => {
	const { id } = useParsed()
	const { product_types } = useWoocommerce()
	const [activeKey, setActiveKey] = useState('Description')

	// 初始化資料
	const {
		formProps: _formProps,
		form,
		saveButtonProps,
		query,
		mutation,
		onFinish,
	} = useForm<TProductRecord>({
		action: 'edit',
		resource: 'products',
		id,
		redirect: false,
		...notificationProps,
		queryMeta: {
			variables: {
				partials: [
					'basic',
					'detail',
					'price',
					'stock',
					'sales',
					'size',
					'subscription',
					'taxonomy',
					'attribute',
					'variation',
				],
				meta_keys: [], // 額外暴露的欄位
			},
		},
	})

	/**
	 * change the form data before submitting
	 * @see https://refine.dev/docs/ui-integrations/ant-design/hooks/use-form/#how-can-i-change-the-form-data-before-submitting-it-to-the-api
	 * @param values @type {any}
	 */
	const handleOnFinish = (values: any) => {
		// 將圖片從 images 轉成 PHP WC_Product 儲存的 key
		const { images = [], ...rest } = values
		const [image, ...gallery_images] = images as TImage[]

		onFinish({
			...rest,
			image_id: image ? image?.id : 0,
			gallery_image_ids: gallery_images?.length
				? gallery_images?.map(({ id }) => id)
				: '[]',
		})
	}

	// 重組 formProps
	const formProps: FormProps = {
		..._formProps,
		layout: 'vertical',
		onFinish: handleOnFinish,
	}

	const record: TProductRecord | undefined = query?.data?.data

	const items: TabsProps['items'] = [
		{
			key: 'Description',
			label: '描述',
			children: <Description formProps={formProps} />,
		},
		{
			key: 'Price',
			label: '價格',
			children: <Price formProps={formProps} />,
		},
		{
			key: 'Stock',
			label: '庫存',
			children: <Stock formProps={formProps} />,
		},
		{
			key: 'Attributes',
			label: '商品屬性',
			children: <Attributes />,
		},
		{
			key: 'Variation',
			label: '變體商品',
			children: <Variation />,
		},
		{
			key: 'Advanced',
			label: '進階設定',
			children: <>123</>,
		},
		// {// TODO
		// 	key: 'Download',
		// 	label: '下載管理',
		// 	children: <>123</>,
		// },
		{
			key: 'Overview', // TODO 也許之後可以讓用戶儲存預設開啟
			label: '總覽',
			children: <>123</>,
			// children: <Description />,
		},
	]

	return (
		<div className="sticky-card-actions sticky-tabs-nav">
			<RecordContext.Provider value={record}>
				<Edit
					resource="posts"
					title={
						<>
							{record?.name}{' '}
							<span className="text-gray-400 text-xs">#{record?.id}</span>
						</>
					}
					headerButtons={() => null}
					saveButtonProps={{
						...saveButtonProps,
						children: '儲存',
						icon: null,
						loading: mutation?.isLoading,
					}}
					footerButtons={({ defaultButtons }) =>
						['Attributes', 'Variation'].includes(activeKey) ? null : (
							<>
								<Switch
									className="mr-4"
									checkedChildren="發佈"
									unCheckedChildren="草稿"
									value={record?.status === 'publish'}
									onChange={(checked) => {
										form.setFieldValue(
											['status'],
											checked ? 'publish' : 'draft',
										)
									}}
								/>
								{defaultButtons}
							</>
						)
					}
					isLoading={query?.isLoading}
				>
					<Form {...formProps}>
						<Item name="type" label="商品類型">
							<Select
								{...defaultSelectProps}
								options={product_types}
								mode={undefined}
							/>
						</Item>
					</Form>
					<Tabs
						activeKey={activeKey}
						onChange={(key) => setActiveKey(key)}
						items={items}
						tabBarExtraContent={
							<>
								<Button
									className="ml-4"
									type="default"
									href={record?.edit_url}
									target="_blank"
									rel="noreferrer"
								>
									前往傳統商品編輯介面
								</Button>
								<Button
									className="ml-4"
									type="default"
									href={record?.permalink}
									target="_blank"
									rel="noreferrer"
								>
									檢視
								</Button>
							</>
						}
					/>
				</Edit>
			</RecordContext.Provider>
		</div>
	)
}

export const ProductEdit = memo(EditComponent)
