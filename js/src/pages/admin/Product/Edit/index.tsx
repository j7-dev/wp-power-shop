import { memo, useState } from 'react'
import { useWoocommerce } from '@/hooks'
import { Tabs, TabsProps, Form, Switch, Button, FormProps } from 'antd'
import { Edit, useForm } from '@refinedev/antd'
import { useParsed } from '@refinedev/core'
import dayjs from 'dayjs'
import {
	Description,
	Stock,
	Price,
	Attributes,
	Variation,
	Linked,
	Advanced,
	Analytics,
} from '@/pages/admin/Product/Edit/tabs'
import { TProductRecord } from '@/components/product/types'
import { RecordContext } from '@/pages/admin/Product/Edit/hooks'

import { TImage, isVariable } from 'antd-toolkit/wp'
import { notificationProps } from 'antd-toolkit/refine'

const EditComponent = () => {
	const { id } = useParsed()
	const { product_types = [] } = useWoocommerce()
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

	const watchProductType = Form.useWatch(['type'], form)

	/**
	 * change the form data before submitting
	 * @see https://refine.dev/docs/ui-integrations/ant-design/hooks/use-form/#how-can-i-change-the-form-data-before-submitting-it-to-the-api
	 * @param values @type {any}
	 */
	const handleOnFinish = (values: any) => {
		// 將圖片從 images 轉成 PHP WC_Product 儲存的 key
		const { images = [], sale_date_range = [], ...rest } = values
		const [image, ...gallery_images] = images as TImage[]

		const sale_dates = sale_date_range?.every(dayjs.isDayjs)
			? {
					date_on_sale_from: sale_date_range[0]?.unix(),
					date_on_sale_to: sale_date_range[1]?.unix(),
				}
			: {}

		onFinish({
			...rest,
			image_id: image ? image?.id : '0',
			gallery_image_ids: gallery_images?.length
				? gallery_images?.map(({ id }) => id)
				: '[]',
			...sale_dates,
		})
	}

	// 重組 formProps
	const formProps: FormProps = {
		..._formProps,
		layout: 'vertical',
		onFinish: handleOnFinish,
	}

	const record: TProductRecord | undefined = query?.data?.data
	const findType = product_types.find((type) => type.value === record?.type)

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
			label: '商品規格',
			children: <Attributes />,
		},
		{
			key: 'Variation',
			label: '商品款式',
			children: <Variation />,
		},
		{
			key: 'Linked',
			label: '連接商品',
			children: <Linked formProps={formProps} />,
		},
		// {
		// 	key: 'Advanced',
		// 	label: '進階設定',
		// 	children: <Advanced formProps={formProps} />,
		// },
		// {// TODO
		// 	key: 'Download',
		// 	label: '下載管理',
		// 	children: <>123</>,
		// },
		{
			key: 'Analytics', // TODO 也許之後可以讓用戶儲存預設開啟
			label: '銷售數據',
			children: <Analytics />,
		},
	].filter((item) => {
		// 合併所有條件判斷
		const conditions = {
			// 如果不是變體商品，移除 Variation 標籤
			Variation: isVariable(watchProductType),
			// 如果是組合商品，移除 Price 標籤
			Price: watchProductType !== 'grouped',
		}

		// 如果條件為 false，則移除該標籤，不為 false 則保留
		// @ts-ignore
		return conditions?.[item.key] !== false
	})

	const disableSaveButton = ['Attributes', 'Variation', 'Analytics'].includes(
		activeKey,
	)

	return (
		<div className="sticky-card-actions sticky-tabs-nav">
			<RecordContext.Provider value={record}>
				<Edit
					resource="posts"
					title={
						<>
							{record?.name}{' '}
							<span className="text-gray-400 text-xs">
								{findType?.label} #{record?.id}
							</span>
						</>
					}
					headerButtons={() => null}
					saveButtonProps={{
						...saveButtonProps,
						children: '儲存',
						icon: null,
						loading: mutation?.isLoading,
						disabled: disableSaveButton,
					}}
					footerButtons={({ defaultButtons }) => (
						<>
							<Switch
								className="mr-4"
								checkedChildren="發佈"
								unCheckedChildren="草稿"
								value={record?.status === 'publish'}
								disabled={disableSaveButton}
								onChange={(checked) => {
									form.setFieldValue(['status'], checked ? 'publish' : 'draft')
								}}
							/>
							{defaultButtons}
						</>
					)}
					isLoading={query?.isLoading}
				>
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
