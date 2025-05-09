import { useEffect, useState } from 'react'
import { Form, Select, Input } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import { TAttributeTaxonomy } from '@/pages/admin/Product/Attributes'
import { useSelect } from '@refinedev/antd'
import { useAttributeTaxonomyOptions } from './hooks'
import { NameId, Segmented } from 'antd-toolkit'
import { TProductAttribute } from 'antd-toolkit/wp'

const { Item } = Form

const index = ({ record }: { record: TProductAttribute }) => {
	const form = Form.useFormInstance()
	const watchId = Form.useWatch('id', form)
	const watchIsTaxonomy = Form.useWatch('is_taxonomy', form) === 'yes'
	const { id = '', name = '', options: initialOptions = [] } = record
	const isCreate = !id && !name

	const [options, setOptions] =
		useState<{ label: string; value: string }[]>(initialOptions)
	const [showCreateFields, setShowCreateFields] = useState(false)

	// 從現有全局屬性挑選
	const { selectProps, query } = useSelect<TAttributeTaxonomy>({
		resource: 'product-attributes',
		optionLabel: 'name',
		optionValue: 'id',
	})

	// 所有的全局屬性
	const attributeTaxonomies = query.data?.data || []

	// 已選擇的全局屬性
	const chosenAttributeTaxonomy = attributeTaxonomies.find(
		(a) => a.id === watchId,
	)

	// 已選擇的全局屬性選項 terms options
	const { options: chosenAttributeTaxonomyOptions, isLoading } =
		useAttributeTaxonomyOptions(chosenAttributeTaxonomy?.slug)

	// 當已選擇的全局屬性變更時，更新選項
	useEffect(() => {
		if (chosenAttributeTaxonomy) {
			form.setFieldsValue({
				name: chosenAttributeTaxonomy.name,
				taxonomy: chosenAttributeTaxonomy.slug,
			})

			setOptions(chosenAttributeTaxonomyOptions)

			return
		}

		setOptions(initialOptions)
	}, [
		chosenAttributeTaxonomy?.id,
		chosenAttributeTaxonomyOptions.map((o) => o.value).join(','),
	])

	useEffect(() => {
		setShowCreateFields(false)
		// 如果是新增，則不顯示創建為全局屬性
		if (!record?.name) {
			form.resetFields()
		}
	}, [record])

	const showSlug = isCreate && watchIsTaxonomy && showCreateFields

	return (
		<>
			<Item
				hidden={!isCreate || showCreateFields}
				label="從現有的全局屬性加入"
				name="id"
				help={
					<p
						className="mt-0 mb-2 text-blue-500 cursor-pointer"
						onClick={() => {
							setShowCreateFields(true)
							form.resetFields()
						}}
					>
						或創建新的屬性
					</p>
				}
			>
				<Select
					{...selectProps}
					optionRender={(option) => {
						return <NameId name={option.label} id={option.value as string} />
					}}
					showSearch={false}
					onSearch={undefined}
				/>
			</Item>

			<Item
				label="名稱"
				name="name"
				tooltip="屬性名稱 (在前台顯示)"
				rules={[{ required: true, message: '請輸入名稱' }]}
				hidden={!showCreateFields && isCreate}
				help={
					showCreateFields &&
					isCreate && (
						<p
							className="mt-0 mb-2 text-blue-500 cursor-pointer"
							onClick={() => {
								setShowCreateFields(false)
								form.resetFields()
							}}
						>
							從現有的全局屬性加入
						</p>
					)
				}
			>
				<Input disabled={!!watchId} allowClear />
			</Item>

			<Segmented
				formItemProps={{
					name: 'is_taxonomy',
					hidden: !showCreateFields || !isCreate,
					label: '創建為全局屬性',
					initialValue: 'yes',
					help: (
						<p className="text-orange-400 mt-0 mb-2">
							<WarningOutlined className="mr-2" />
							推薦創建為全局屬性
						</p>
					),
					tooltip:
						'創建為全局屬性後，下個商品可以直接套用帶入屬性，無須再次創建',
				}}
			/>

			<Item
				label="代稱"
				name="taxonomy"
				hidden={!showSlug}
				tooltip="屬性唯一的網址別名/參考; 長度需少於 28 字元。"
				rules={[{ required: watchIsTaxonomy, message: '請輸入代稱' }]}
				getValueProps={(rawSlug?: string) => {
					if (!showSlug) {
						return {
							value: undefined,
						}
					}
					const slug = rawSlug?.replace('pa_', '')
					return {
						value: slug,
					}
				}}
			>
				<Input maxLength={28} showCount allowClear addonBefore="pa_" />
			</Item>

			<Segmented
				formItemProps={{
					name: 'visible',
					label: '在商品頁面中可見',
					initialValue: 'yes',
				}}
			/>

			<Item label="選項" name="options" help="輸入文字，按下 Enter 新增選項">
				<Select
					loading={isLoading}
					mode="tags"
					options={options}
					placeholder="請選擇選項"
					allowClear
				/>
			</Item>
		</>
	)
}

export default index
