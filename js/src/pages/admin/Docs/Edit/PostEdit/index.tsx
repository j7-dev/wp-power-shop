import React, { memo, useEffect } from 'react'
import { Form, Input, Switch, Space, Button, Typography } from 'antd'
import { toFormData, CopyText } from 'antd-toolkit'
import { DescriptionDrawer } from '@/components/general'
import { TDocRecord } from '@/pages/admin/Docs/List/types'
import { Edit, useForm } from '@refinedev/antd'
import { ExclamationCircleFilled } from '@ant-design/icons'

const { Item } = Form
const { Text } = Typography

const PostEditComponent = ({ record }: { record: TDocRecord }) => {
	const { id, name, permalink, slug } = record

	// 初始化資料
	const { formProps, form, saveButtonProps, mutation, onFinish } = useForm({
		action: 'edit',
		resource: 'posts',
		id,
		redirect: false,
		queryOptions: {
			enabled: false,
		},
		invalidates: ['list', 'detail'],
		warnWhenUnsavedChanges: true,
		successNotification: false,
		errorNotification: false,
	})

	// 取得課程深度，用來判斷是否為子章節
	const watchDepth = Form.useWatch(['depth'], form)
	const label = watchDepth === 0 ? '章節' : '單元'
	const watchStatus = Form.useWatch(['status'], form)
	const watchSlug = Form.useWatch(['slug'], form)

	useEffect(() => {
		form.setFieldsValue(record)
	}, [record])

	// 將 [] 轉為 '[]'，例如，清除原本分類時，如果空的，前端會是 undefined，轉成 formData 時會遺失
	const handleOnFinish = (values: Partial<TDocRecord>) => {
		onFinish(toFormData(values))
	}

	// 將 permalink 找出 slug 以外的剩餘字串
	const docsUrl = permalink.replace(`${slug}/`, '')

	return (
		<Edit
			resource="posts"
			recordItemId={id}
			breadcrumb={null}
			goBack={null}
			headerButtons={() => null}
			title={
				<div className="pl-4">
					《編輯》 {name} <span className="text-gray-400 text-xs">#{id}</span>
				</div>
			}
			saveButtonProps={{
				...saveButtonProps,
				children: `儲存${label}`,
				icon: null,
				loading: mutation?.isLoading,
			}}
			footerButtons={({ defaultButtons }) => (
				<>
					<div className="text-red-500 font-bold mr-8">
						<ExclamationCircleFilled /> 文章是分開儲存的，編輯完成請記得儲存
					</div>

					<Switch
						className="mr-4"
						checkedChildren="發佈"
						unCheckedChildren="草稿"
						value={watchStatus === 'publish'}
						onChange={(checked) => {
							form.setFieldValue(['status'], checked ? 'publish' : 'draft')
						}}
					/>

					<Space.Compact>
						<Button
							color="default"
							variant="filled"
							href={permalink}
							target="_blank"
							className="!inline-flex"
						>
							預覽
						</Button>
						{defaultButtons}
					</Space.Compact>
				</>
			)}
			wrapperProps={{
				style: {
					boxShadow: '0px 0px 16px 0px #ddd',
					paddingTop: '1rem',
					borderRadius: '0.5rem',
				},
			}}
		>
			<Form {...formProps} onFinish={handleOnFinish} layout="vertical">
				<Item name={['name']} label={'名稱'}>
					<Input allowClear />
				</Item>

				<Item name={['slug']} label="網址">
					<Input
						allowClear
						addonBefore={
							<Text className="max-w-[25rem] text-left" ellipsis>
								{docsUrl}
							</Text>
						}
						addonAfter={<CopyText text={`${docsUrl}${watchSlug}`} />}
					/>
				</Item>
				<div className="mb-8">
					<DescriptionDrawer />
				</div>

				<Item name={['status']} hidden />
				<Item name={['depth']} hidden />
				<Item name={['id']} hidden />
			</Form>
		</Edit>
	)
}

export const PostEdit = memo(PostEditComponent)
