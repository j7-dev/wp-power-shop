import { memo, useEffect } from 'react'
import { Form } from 'antd'
import { prepareAttributes } from '@/components/productAttribute/SortableList/utils'
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
 * @param {TProductAttribute[]} props.attributes - 商品規格列表
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
		isCreate: boolean,
	) => void
}) => {
	const product = useRecord()
	// 如果傳入的 record 是 DEFAULT 那就是代表是新增
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
				onMutationSuccess(data, variables, isCreate)
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
	const handleOnFinish = async (values: Partial<TProductAttribute>) => {
		const new_attributes = isCreate
			? [...attributes, values]
			: attributes.map((a) => {
					if (`${a.id}-${a.name}` === `${id}-${name}`) {
						return values
					}
					return a
				})
		const prepared_new_attributes = prepareAttributes(new_attributes)

		await onFinish(
			toFormData({
				new_attributes: prepared_new_attributes,
			}),
		)

		invalidate({
			resource: 'product-attributes',
			invalidates: ['list'],
		})
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
						'《新增商品規格》'
					) : (
						<>
							《編輯商品規格》 {name}{' '}
							{id && <span className="text-gray-400 text-xs">#{id}</span>}
						</>
					)}
				</div>
			}
			saveButtonProps={{
				...saveButtonProps,
				children: isCreate ? `新增商品規格` : `儲存商品規格`,
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
