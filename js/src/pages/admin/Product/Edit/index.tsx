import { memo } from 'react'
import { Tabs, TabsProps, Form, Switch, Button, Select } from 'antd'
import { useWoocommerce } from '@/hooks'
import { Edit, useForm } from '@refinedev/antd'
import { useParsed } from '@refinedev/core'
import {
	Description,
	Stock,
	Price,
	Other,
	Attributes,
} from '@/pages/admin/Product/Edit/tabs'
import { TProductRecord } from '@/components/product/types'
import { RecordContext } from '@/pages/admin/Product/Edit/hooks'
// import { PostEdit } from './PostEdit'
import { defaultSelectProps } from 'antd-toolkit'
import { TImage } from 'antd-toolkit/wp'
import { notificationProps } from 'antd-toolkit/refine'

// TAB items
const defaultItems: TabsProps['items'] = [
	{
		key: 'Description',
		label: '描述',
		children: <Description />,
	},
	{
		key: 'Price',
		label: '價格',
		children: <Price />,
	},
	{
		key: 'Stock',
		label: '庫存',
		children: <Stock />,
	},
	{
		key: 'Attributes',
		label: '商品屬性',
		children: <Attributes />,
	},
	{
		key: 'Other',
		label: '其他設定',
		children: <Other />,
	},
	{
		key: 'Overview', // TODO 也許之後可以讓用戶儲存預設開啟
		label: '總覽',
		children: <>123</>,
		// children: <Description />,
	},
]

const { Item } = Form

const EditComponent = () => {
	const { id } = useParsed()
	const wc = useWoocommerce()

	// 初始化資料
	const { formProps, form, saveButtonProps, query, mutation, onFinish } =
		useForm<TProductRecord>({
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

	const record: TProductRecord | undefined = query?.data?.data

	const items = defaultItems

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
					footerButtons={({ defaultButtons }) => (
						<>
							<Switch
								className="mr-4"
								checkedChildren="發佈"
								unCheckedChildren="草稿"
								value={record?.status === 'publish'}
								onChange={(checked) => {
									form.setFieldValue(['status'], checked ? 'publish' : 'draft')
								}}
							/>
							{defaultButtons}
						</>
					)}
					isLoading={query?.isLoading}
				>
					<Form {...formProps} onFinish={handleOnFinish} layout="vertical">
						<Item name="type" label="商品類型">
							<Select
								{...defaultSelectProps}
								options={wc?.product_types}
								mode={undefined}
							/>
						</Item>
						<Tabs
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
					</Form>
				</Edit>
			</RecordContext.Provider>
		</div>
	)
}

export const ProductEdit = memo(EditComponent)
