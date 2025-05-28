import { useState, useEffect } from 'react'
import {
	Tabs,
	TabsProps,
	Card,
	Button,
	Modal,
	Form,
	Spin,
	Alert,
	Tag,
} from 'antd'
import { useCreate, useUpdate } from '@refinedev/core'
import { EditOutlined } from '@ant-design/icons'
import { useModal, DeleteButton } from '@refinedev/antd'
import { useList } from '@refinedev/core'
import { SortableList, useSortableTreeList } from '@/components/term'
import AttributesForm, {
	TFormValues,
} from '@/pages/admin/Product/Attributes/Form'
import { useEnv } from 'antd-toolkit'
import { TTaxonomy } from 'antd-toolkit/wp'
import { notificationProps } from 'antd-toolkit/refine'

export type TAttributeTaxonomy = {
	id: string
	name: string
	slug: string
	type: string
	order_by: string
	has_archives: boolean
}

export const ProductAttributes = () => {
	const sortableTreeListProps = useSortableTreeList()
	/** 編輯的商品規格有值時，表示編輯模式，沒有就是新增 */
	const [attribute, setAttribute] = useState<TAttributeTaxonomy | null>(null)
	const { SITE_URL } = useEnv()
	const { show, close, modalProps } = useModal()
	const [form] = Form.useForm()
	const { data, isLoading } = useList<TAttributeTaxonomy>({
		resource: 'product-attributes',
	})

	const attributes = data?.data || []

	// ID 有值為更新，沒有為新增
	const watchId = Form.useWatch('id', form)

	const { mutate: create, isLoading: isCreating } = useCreate({
		resource: 'product-attributes',
	})
	const { mutate: update, isLoading: isUpdating } = useUpdate({
		resource: 'product-attributes',
	})

	const onFinish = (formValues: TFormValues) => {
		const { id, ...values } = formValues
		const options = {
			onSuccess: close,
		}

		if (watchId) {
			update(
				{
					id,
					values,
					...notificationProps,
				},
				options,
			)
		} else {
			create(
				{
					values,
					...notificationProps,
				},
				options,
			)
		}
	}

	const handleEdit = (attribute: TAttributeTaxonomy) => () => {
		setAttribute(attribute)
		show()
	}

	const handleAdd = () => {
		setAttribute(null)
		show()
	}

	useEffect(() => {
		if (attribute) {
			form.setFieldsValue(attribute)
		} else {
			form.resetFields()
		}
	}, [attribute])

	return (
		<Spin spinning={isLoading}>
			<Card title="全局商品規格">
				<Alert
					className="mb-4"
					message="什麼時候該建立全局商品規格？"
					description={
						<>
							<p className="m-0">
								當你想要在所有商品中使用相同的商品規格時，可以使用全局商品規格。
							</p>
							<p className="m-0">
								例如：你商店的衣服商品都有固定衣服尺寸 ( S, M, L, XL )
								，可以設定 <Tag color="blue">衣服尺寸</Tag>
								為全局商品規格，這樣所有商品都會有衣服尺寸這個商品規格。
							</p>
						</>
					}
					type="info"
					showIcon
					closable
				/>
				<div className="flex gap-2 mb-4 justify-between">
					<Button type="primary" onClick={handleAdd}>
						新增全局商品規格
					</Button>
					<Button
						href={`${SITE_URL}/wp-admin/edit.php?post_type=product&page=product_attributes`}
						target="_blank"
					>
						前往傳統介面編輯
					</Button>
				</div>
				<Tabs
					tabPosition="left"
					items={
						attributes?.map((attr) => {
							const { id, name, slug, has_archives } = attr

							// 重組成 TTaxonomy 格式
							const taxonomy: TTaxonomy = {
								value: slug,
								label: name,
								hierarchical: false,
								publicly_queryable: has_archives,
							}
							return {
								key: slug,
								label: (
									<>
										{name}
										<EditOutlined onClick={handleEdit(attr)} className="ml-2" />
									</>
								),
								children: (
									<SortableList
										{...sortableTreeListProps}
										taxonomy={taxonomy}
									/>
								),
							}
						}) as TabsProps['items']
					}
				/>
				<Modal
					{...modalProps}
					centered
					title={
						attribute ? `《編輯》 ${attribute.name}` : '《新增》全局商品規格'
					}
					onOk={form.submit}
					okText={attribute ? '更新' : '新增'}
					cancelText="取消"
					footer={
						<div className="flex justify-between">
							{attribute ? (
								<DeleteButton
									resource="product-attributes"
									recordItemId={attribute?.id}
									children="刪除"
									icon={null}
									confirmTitle="確認刪除"
									confirmOkText="確認"
									confirmCancelText="取消"
									onSuccess={close}
									{...notificationProps}
								/>
							) : (
								<div></div>
							)}

							<div className="flex gap-2">
								<Button type="default" onClick={close} className="justify-end">
									取消
								</Button>
								<Button
									type="primary"
									onClick={form.submit}
									loading={isUpdating || isCreating}
									className="justify-end"
								>
									{attribute ? '更新' : '新增'}
								</Button>
							</div>
						</div>
					}
				>
					<AttributesForm form={form} onFinish={onFinish} />
				</Modal>
			</Card>
		</Spin>
	)
}
