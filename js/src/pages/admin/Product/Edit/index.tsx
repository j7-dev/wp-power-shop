import { memo, useState } from 'react'
import { Tabs, TabsProps, Form, Switch, Modal, Button, Select } from 'antd'
import { useAtom } from 'jotai'
import { useWoocommerce } from '@/hooks'
import { Edit, useForm } from '@refinedev/antd'
import { useParsed } from '@refinedev/core'
import { Description, Stock, Price } from '@/pages/admin/Product/Edit/tabs'
import { TProductRecord } from '@/components/product/types'
import { RecordContext } from '@/pages/admin/Product/Edit/hooks'
// import { PostEdit } from './PostEdit'
import { defaultSelectProps } from 'antd-toolkit'
import {
	notificationProps,
	mediaLibraryAtom,
	MediaLibrary,
	TBunnyVideo,
} from 'antd-toolkit/refine'

// TAB items
const defaultItems: TabsProps['items'] = [
	{
		key: 'Description',
		forceRender: true,
		label: '描述',
		children: <Description />,
	},
	{
		key: 'Price',
		forceRender: true,
		label: '價格',
		children: <Price />,
	},
	{
		key: 'Stock',
		forceRender: true,
		label: '庫存',
		children: <Stock />,
	},
	{
		key: 'Attributes',
		forceRender: true,
		label: '商品屬性',
		children: <>123</>,
	},
	{
		key: 'Overview', // TODO 也許之後可以讓用戶儲存預設開啟
		forceRender: true,
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

	// 處理 media library
	const [mediaLibrary, setMediaLibrary] = useAtom(mediaLibraryAtom)
	const { modalProps } = mediaLibrary
	const [selectedVideos, setSelectedVideos] = useState<TBunnyVideo[]>([])

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
					<Form {...formProps} layout="vertical">
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

				<Modal
					{...modalProps}
					onCancel={() => {
						setMediaLibrary((prev) => ({
							...prev,
							modalProps: {
								...prev.modalProps,
								open: false,
							},
						}))
					}}
				>
					<div className="max-h-[75vh] overflow-x-hidden overflow-y-auto pr-4">
						<MediaLibrary
							mediaLibraryProps={{
								selectedVideos,
								setSelectedVideos,
								limit: 1,
								selectButtonProps: {
									onClick: () => {
										setMediaLibrary((prev) => ({
											...prev,
											modalProps: {
												...prev.modalProps,
												open: false,
											},
											confirmedSelectedVideos: selectedVideos,
										}))
									},
								},
							}}
						/>
					</div>
				</Modal>
			</RecordContext.Provider>
		</div>
	)
}

export const ProductEdit = memo(EditComponent)
