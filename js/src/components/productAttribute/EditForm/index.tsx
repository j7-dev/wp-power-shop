import { memo, useEffect } from 'react'
import { Form } from 'antd'
import {
	prepareAttributes,
	prepareAttribute,
} from '@/components/productAttribute/SortableList/utils'
import AttributeTaxonomyForm from './Form'
import {
	useInvalidate,
	CreateResponse,
	UpdateResponse,
	BaseRecord,
} from '@refinedev/core'
import { Edit, useForm } from '@refinedev/antd'
import { useRecord } from '@/pages/admin/Product/Edit/hooks'
import { toFormData } from 'antd-toolkit'
import { TProductAttribute } from 'antd-toolkit/wp'
import { notificationProps } from 'antd-toolkit/refine'

/**
 * 編輯表單元件
 *
 * 用於編輯或新增分類項目（term）的表單元件。
 *
 * @param {Object} props - 元件屬性
 * @param {TProductAttribute[]} props.attributes - 屬性列表
 * @param {TTerm} props.record - 要編輯的分類項目資料，如果是新增則傳入預設值
 * @returns {React.FC} 編輯表單元件
 */
const EditFormComponent = ({
	attributes,
	record,
	onMutationSuccess,
}: {
	attributes: TProductAttribute[]
	record: TProductAttribute
	onMutationSuccess?: (
		data: CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>,
		variables: any,
		context: any,
	) => void
}) => {
	// 如果傳入的 record 是 DEFAULT 那就是代表是新增
	const product = useRecord()
	const { id = '', name = '' } = record
	const isCreate = !id && !name

	const invalidate = useInvalidate()

	// 初始化資料
	const { formProps, form, saveButtonProps, mutation, onFinish } = useForm({
		action: 'edit',
		resource: `products/attributes`,
		id: product?.id,
		redirect: false,
		queryOptions: {
			enabled: false,
		},
		invalidates: [],
		onMutationSuccess: (data, variables, context) => {
			invalidate({
				resource: 'products',
				invalidates: ['detail'],
				id: product?.id,
			})
			if (onMutationSuccess) {
				onMutationSuccess(data, variables, context)
			}
		},
		warnWhenUnsavedChanges: true,
		...notificationProps,
	})

	useEffect(() => {
		form.setFieldsValue(record)

		if (!record?.name) {
			form.resetFields()
		}
	}, [record])

	// 將 [] 轉為 '[]'，例如，清除原本分類時，如果空的，前端會是 undefined，轉成 formData 時會遺失
	const handleOnFinish = (values: Partial<TProductAttribute>) => {
		const prepared_value = prepareAttribute(values)
		const prepared_attributes = prepareAttributes(attributes)

		const new_attributes = isCreate
			? [...prepared_attributes, prepared_value]
			: prepared_attributes.map((a) => {
					if (`${a.id}-${a.name}` === `${id}-${name}`) {
						return prepared_value
					}
					return a
				})

		onFinish(
			toFormData({
				new_attributes,
			}),
		)
	}

	return (
		<Edit
			resource="products/attributes"
			recordItemId={product?.id}
			breadcrumb={null}
			goBack={null}
			headerButtons={() => null}
			title={
				<div className="pl-4">
					{isCreate ? (
						'《新增屬性》'
					) : (
						<>
							《編輯{id ? '全局' : ''}屬性》 {name}{' '}
							{id && <span className="text-gray-400 text-xs">#{id}</span>}
						</>
					)}
				</div>
			}
			saveButtonProps={{
				...saveButtonProps,
				children: isCreate ? `新增屬性` : `儲存屬性`,
				icon: null,
				loading: mutation?.isLoading,
			}}
			wrapperProps={{
				style: {
					boxShadow: '0px 0px 16px 0px #ddd',
					paddingTop: '1rem',
					borderRadius: '0.5rem',
				},
			}}
		>
			<Form {...formProps} onFinish={handleOnFinish} layout="vertical">
				<AttributeTaxonomyForm record={record} />
			</Form>
		</Edit>
	)
}

export const EditForm = memo(EditFormComponent)
