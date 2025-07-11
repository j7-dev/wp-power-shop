import { Select, Form, Tag, FormItemProps } from 'antd'
import { useSelect } from '@refinedev/antd'
import { TProductSelectOption } from '@/pages/admin/Analytics/types'
import { defaultSelectProps, NameId } from 'antd-toolkit'
import { useWoocommerce } from 'antd-toolkit/wp'

const { Item } = Form

export const ProductSelector = ({
	formItemProps,
}: {
	formItemProps: FormItemProps
}) => {
	const { product_types } = useWoocommerce()
	const form = Form.useFormInstance()
	const name = formItemProps?.name
	const ids = Form.useWatch(name, form)
	const { selectProps: productSelectProps, query: productQuery } =
		useSelect<TProductSelectOption>({
			resource: 'products/select',
			optionLabel: 'name',
			optionValue: 'id',
			filters: [
				{
					field: 'post__in',
					operator: 'eq',
					value: ids,
				},
			],
			onSearch: (value) => [
				{
					field: 's',
					operator: 'eq',
					value,
				},
			],
		})

	const productSelectOptions = productQuery?.data?.data || []

	return (
		<Item className="w-full" {...formItemProps}>
			<Select
				{...defaultSelectProps}
				{...productSelectProps}
				placeholder="可多選，可搜尋關鍵字，輸入數字的話會搜尋商品 ID"
				optionRender={({ value, label }) => {
					const option = productSelectOptions.find(
						(productOption) => productOption?.id === value,
					)
					const productType = product_types.find(
						(pt) => pt?.value === option?.type,
					)
					return (
						<div className="flex items-center gap-x-2 justify-between pr-4">
							<NameId name={label} id={value as string} />
							<Tag color={productType?.color}>{productType?.label}</Tag>
						</div>
					)
				}}
			/>
		</Item>
	)
}
