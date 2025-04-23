import { memo, useEffect, useState } from 'react'
import { Form, Input, Space, Button, UploadFile } from 'antd'
import { toFormData } from 'antd-toolkit'
import { TTerm } from '@/components/term/types'
import { Edit, useForm } from '@refinedev/antd'
import { TTaxonomy } from '@/types/product'
import { FileUpload } from 'antd-toolkit/wp'
import { notificationProps } from 'antd-toolkit/refine'
const { Item } = Form
const { TextArea } = Input

/**
 * 編輯表單元件
 *
 * 用於編輯或新增分類項目（term）的表單元件。
 *
 * @param {Object} props - 元件屬性
 * @param {TTerm} props.record - 要編輯的分類項目資料，如果是新增則傳入預設值
 * @returns {React.FC} 編輯表單元件
 */

const EditFormComponent = ({
	record,
	taxonomy,
}: {
	record: TTerm
	taxonomy: TTaxonomy
}) => {
	// 如果傳入的 record 是 DEFAULT 那就是代表是新增
	const { id, name, permalink, edit_url } = record
	const { label = '' } = taxonomy
	const isCreate = !record?.id

	// 初始化資料
	const { formProps, form, saveButtonProps, mutation, onFinish } = useForm({
		action: isCreate ? 'create' : 'edit',
		resource: `terms/${taxonomy.value}`,
		id,
		redirect: false,
		queryOptions: {
			enabled: false,
		},
		invalidates: ['list', 'detail'],
		warnWhenUnsavedChanges: true,
		...notificationProps,
	})

	// 縮圖
	const [fileList, setFileList] = useState<UploadFile[]>([])

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
		onFinish(
			toFormData({
				...values,
				taxonomy: taxonomy.value,
			}),
		)
	}

	return (
		<Edit
			resource={`terms/${taxonomy.value}`}
			recordItemId={id}
			breadcrumb={null}
			goBack={null}
			headerButtons={() => null}
			title={
				<div className="pl-4">
					{isCreate ? (
						<>《新增{label}》</>
					) : (
						<>
							《編輯》 {name}{' '}
							<span className="text-gray-400 text-xs">#{id}</span>
						</>
					)}
				</div>
			}
			saveButtonProps={{
				...saveButtonProps,
				children: isCreate ? `新增${label}` : `儲存${label}`,
				icon: null,
				loading: mutation?.isLoading,
			}}
			footerButtons={({ defaultButtons }) =>
				isCreate ? (
					defaultButtons
				) : (
					<>
						<Button
							target="_blank"
							href={edit_url}
							className="place-content-center mr-4"
						>
							前往傳統編輯介面
						</Button>
						<Space.Compact block>
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
				)
			}
			wrapperProps={{
				style: {
					boxShadow: '0px 0px 16px 0px #ddd',
					paddingTop: '1rem',
					borderRadius: '0.5rem',
				},
			}}
		>
			<Form {...formProps} onFinish={handleOnFinish} layout="vertical">
				<Item name={['name']} label={'名稱'} required={true}>
					<Input allowClear />
				</Item>

				<Item
					name={['slug']}
					label="代稱"
					tooltip="代稱的英文原文為 Slug，是用於網址中的易記名稱，通常由小寫英文字母、數字及連字號 - 組成。"
				>
					<Input allowClear />
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
			</Form>
		</Edit>
	)
}

export const EditForm = memo(EditFormComponent)
