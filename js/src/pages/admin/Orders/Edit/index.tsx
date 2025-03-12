import { memo, useState, createContext, useMemo } from 'react'
import { Edit, useForm } from '@refinedev/antd'
import { Tabs, TabsProps, Form, Switch, Modal, Button } from 'antd'
import { Description, SortablePosts } from './tabs'
import { useAtom } from 'jotai'
import { TOrderRecord, TOrderBaseRecord } from '@/pages/admin/Orders/List/types'
import { useParsed } from '@refinedev/core'
import { PostEdit } from './PostEdit'
import { UserTable } from '@/components/user'

import {
	mediaLibraryAtom,
	MediaLibrary,
	TBunnyVideo,
} from 'antd-toolkit/refine'

// TAB items
const items: TabsProps['items'] = [
	{
		key: 'Description',
		forceRender: true,
		label: '描述',
		children: <Description />,
	},
	{
		key: 'SortablePosts',
		forceRender: false,
		label: '文章管理',
		children: <SortablePosts PostEdit={PostEdit} />,
	},
]

export const RecordContext = createContext<TOrderRecord | undefined>(undefined)

const EditComponent = () => {
	const { id } = useParsed()

	// 初始化資料
	const { formProps, form, saveButtonProps, query, mutation, onFinish } =
		useForm<TOrderRecord>({
			action: 'edit',
			resource: 'orders',
			id,
			redirect: false,
			successNotification: false,
			errorNotification: false,
		})

	// 顯示
	const watchId = Form.useWatch(['id'], form)

	const record: TOrderBaseRecord | undefined = useMemo(
		() => query?.data?.data,
		[query?.isFetching],
	)

	// 處理 media library
	const [mediaLibrary, setMediaLibrary] = useAtom(mediaLibraryAtom)
	const { modalProps } = mediaLibrary
	const [selectedVideos, setSelectedVideos] = useState<TBunnyVideo[]>([])

	return (
		<RecordContext.Provider value={record}>
			<div className="sticky-card-actions sticky-tabs-nav">
				<Edit
					resource="posts"
					title={<>訂單 #{watchId}</>}
					headerButtons={() => null}
					saveButtonProps={{
						...saveButtonProps,
						children: '儲存',
						icon: null,
						loading: mutation?.isLoading,
					}}
					isLoading={query?.isLoading}
				>
					<Form {...formProps} layout="vertical">
						<Tabs items={items} />
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
			</div>
		</RecordContext.Provider>
	)
}

export const OrdersEdit = memo(EditComponent)
