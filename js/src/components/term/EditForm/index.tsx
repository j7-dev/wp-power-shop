import { memo, useEffect, useState } from 'react'
import { Form, Input, Space, Button, Typography, UploadFile } from 'antd'
import { toFormData, CopyText } from 'antd-toolkit'
import { TTerm } from '@/components/term/types'
import { Edit, useForm } from '@refinedev/antd'
import { useTaxonomy } from '@/components/term/SortableTree/hooks'
import { FileUpload } from 'antd-toolkit/wp'

const { Item } = Form
const { Text } = Typography
const { TextArea } = Input

const EditFormComponent = ({ record }: { record: TTerm }) => {
	const { id, name, permalink, slug } = record
	const { label = '', value: taxonomy = '' } = useTaxonomy()

	// 初始化資料
	const { formProps, form, saveButtonProps, mutation, onFinish } = useForm({
		action: 'edit',
		resource: 'terms',
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

	// 縮圖
	const [fileList, setFileList] = useState<UploadFile[]>([])

	// 取得課程深度，用來判斷是否為子章節
	const watchSlug = Form.useWatch(['slug'], form)

	useEffect(() => {
		form.setFieldsValue(record)

		if (record) {
			const thumbnail = form.getFieldValue(['thumbnail_id'])
			setFileList([
				{
					uid: '-1',
					name: 'thumbnail.png',
					status: 'done',
					url: thumbnail,
				},
			])
		}
	}, [record])

	// 將 [] 轉為 '[]'，例如，清除原本分類時，如果空的，前端會是 undefined，轉成 formData 時會遺失
	const handleOnFinish = (values: Partial<TTerm>) => {
		onFinish(toFormData(values))
	}

	// 將 permalink 找出 slug 以外的剩餘字串
	const baseUrl = permalink.replace(`${slug}/`, '')

	return (
		<Edit
			resource="terms"
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

				<Item
					name={['slug']}
					label="代稱"
					tooltip="代稱的英文原文為 Slug，是用於網址中的易記名稱，通常由小寫英文字母、數字及連字號 - 組成。"
				>
					<Input
						allowClear
						addonBefore={
							<Text className="max-w-[25rem] text-left" ellipsis>
								{baseUrl}
							</Text>
						}
						addonAfter={<CopyText text={`${baseUrl}${watchSlug}`} />}
					/>
				</Item>
				<Item
					name={['description']}
					label="內容說明"
					tooltip="[內容說明] 欄位中的資料預設不會顯示，但有些佈景主題在其版面的特定位置會顯示這些資料。"
				>
					<TextArea rows={4} />
				</Item>

				<div className="w-40 [&_.ant-upload-text]:tw-hidden [&_.ant-upload-hint]:text-xs">
					<label className="mb-3 tw-block">縮圖</label>
					<FileUpload
						fileList={fileList}
						setFileList={setFileList}
						formItemProps={{ name: ['thumbnail_id'] }}
					/>
				</div>

				<Item name={['taxonomy']} initialValue={taxonomy} hidden />
			</Form>
		</Edit>
	)
}

export const EditForm = memo(EditFormComponent)
