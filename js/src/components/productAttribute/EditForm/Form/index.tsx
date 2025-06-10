import { useEffect, useState } from 'react'
import { Form, Select, Input } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import { TAttributeTaxonomy } from '@/pages/admin/Product/Attributes'
import { useSelect } from '@refinedev/antd'
import { useRecord } from '@/pages/admin/Product/Edit/hooks'
import { useAttributeTaxonomyOptions } from './hooks'
import { NameId, Segmented } from 'antd-toolkit'
import { isVariable, TProductAttribute } from 'antd-toolkit/wp'

const { Item } = Form

const index = ({ record }: { record: TProductAttribute }) => {
	const form = Form.useFormInstance()
	const product = useRecord()
	const watchId = Form.useWatch('id', form)
	const watchIsTaxonomy = Form.useWatch('is_taxonomy', form) === 'yes'
	const { id = '', name = '', options: initialOptions = [] } = record
	const isCreate = !id && !name

	const [options, setOptions] =
		useState<{ label: string; value: string }[]>(initialOptions)
	const [showCreateFields, setShowCreateFields] = useState(false)

	// 從現有全局商品規格挑選
	const { selectProps, query } = useSelect<TAttributeTaxonomy>({
		resource: 'product-attributes',
		optionLabel: 'name',
		optionValue: 'id',
	})

	// 所有的全局商品規格
	const attributeTaxonomies = query.data?.data || []

	// 已選擇的全局商品規格
	const chosenAttributeTaxonomy = attributeTaxonomies.find(
		(a) => a.id === watchId,
	)

	// 已選擇的全局商品規格選項 terms options
	const { options: chosenAttributeTaxonomyOptions, isLoading } =
		useAttributeTaxonomyOptions(chosenAttributeTaxonomy?.slug)

	// 當已選擇的全局商品規格變更時，更新選項
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
		// 如果是新增，則不顯示創建為全局商品規格
		if (!record?.name) {
			form.resetFields()
		}
	}, [record])

	const showSlug = isCreate && watchIsTaxonomy && showCreateFields

	return (
		<>
			<Item
				hidden={!isCreate || showCreateFields}
				label="從現有的全局商品規格加入"
				name="id"
				help={
					<p
						className="mt-0 mb-2 text-blue-500 cursor-pointer"
						onClick={() => {
							setShowCreateFields(true)
							form.resetFields()
						}}
					>
						或創建新的商品規格
					</p>
				}
			>
				<Select
					{...selectProps}
					// 這邊重新覆蓋 options ，因為如果不這樣做，新增完規格後就算 invalidate 後 selectProps 還是不會更新
					options={attributeTaxonomies.map((a) => ({
						label: a.name,
						value: a.id,
					}))}
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
				tooltip="商品規格名稱 (在前台顯示)"
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
							從現有的全局商品規格加入
						</p>
					)
				}
			>
				<Input disabled={!!watchId} allowClear />
			</Item>

			{isCreate && showCreateFields && (
				<Segmented
					formItemProps={{
						name: 'is_taxonomy',
						hidden: !showCreateFields || !isCreate,
						label: '創建為全局商品規格',
						initialValue: 'yes',
						help: (
							<p className="text-orange-400 mt-0 mb-2">
								<WarningOutlined className="mr-2" />
								推薦創建為全局商品規格
							</p>
						),
						tooltip:
							'創建為全局商品規格後，下個商品可以直接套用帶入商品規格，無須再次創建',
					}}
				/>
			)}

			<Item
				label="代稱"
				name="taxonomy"
				hidden={!showSlug}
				tooltip="商品規格唯一的網址別名/參考; 長度需少於 28 字元。"
				rules={[
					{ required: watchIsTaxonomy && isCreate, message: '請輸入代稱' },
					{
						pattern: /^[A-Za-z0-9_]+$/,
						message: '只能接受英文、數字、_',
					},
				]}
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

			<div className="grid grid-cols-2 gap-x-8">
				<Segmented
					formItemProps={{
						name: 'visible',
						label: '在商品頁面中可見',
						initialValue: 'yes',
					}}
				/>

				{isVariable(product?.type as string) && (
					<Segmented
						formItemProps={{
							name: 'variation',
							label: '用於產生商品款式',
							tooltip: '如果否，商品規格僅作顯示，不會產生款式',
							initialValue: 'yes',
						}}
					/>
				)}
			</div>

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
