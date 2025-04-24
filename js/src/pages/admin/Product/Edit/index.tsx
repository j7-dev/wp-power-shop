import { memo, useState } from 'react'
import { Tabs, TabsProps, Form, Switch, Modal, Button } from 'antd'
import { useAtom } from 'jotai'

import { Edit, useForm } from '@refinedev/antd'
import { useParsed } from '@refinedev/core'
// import { Description, SortablePosts } from './tabs'
import { TProductRecord } from '@/components/product/types'
import { RecordContext } from '@/pages/admin/Product/Edit/hooks'
import {
	Status,
	Price,
	Size,
	Stock,
	PurchaseNote,
	Other,
	Taxonomy,
} from '@/components/product/fields'
// import { PostEdit } from './PostEdit'
import {
	notificationProps,
	mediaLibraryAtom,
	MediaLibrary,
	TBunnyVideo,
} from 'antd-toolkit/refine'

// TAB items
const defaultItems: TabsProps['items'] = [
	{
		key: 'Overview', // TODO 也許之後可以讓用戶儲存預設開啟
		forceRender: true,
		label: '總覽',
		children: <>123</>,
		// children: <Description />,
	},
	{
		key: 'Description',
		forceRender: true,
		label: '描述',
		children: <>123</>,
		// children: <Description />,
	},
	{
		key: 'SortablePosts',
		forceRender: false,
		label: '文章管理',
		// children: <SortablePosts PostEdit={PostEdit} />,
	},
]

const EditComponent = () => {
	const { id } = useParsed()

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
						<Status />
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
