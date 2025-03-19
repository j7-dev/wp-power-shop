import { memo } from 'react'
import {
	FormProps,
	Form,
	Input,
	Button,
	FormInstance,
	Select,
	DatePicker,
} from 'antd'
import { UndoOutlined, SearchOutlined } from '@ant-design/icons'
import { useOptions } from '../hooks/useOptions'
import { defaultSelectProps } from 'antd-toolkit'

export type TFilterValues = {
	search?: string
	role__in?: string[]
	billing_phone?: string
	birthday?: any[]
	include?: string[]
}

const { Item } = Form

const { RangePicker } = DatePicker
const Filter = ({
	formProps,
	initialValues,
}: {
	formProps: FormProps<TFilterValues>
	initialValues: TFilterValues
}) => {
	const form = formProps?.form as FormInstance<TFilterValues>
	const { roles } = useOptions()

	return (
		<div className="mb-2">
			<Form {...formProps} layout="vertical" initialValues={initialValues}>
				<div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-x-4">
					<Item name={['search']} label="關鍵字搜尋">
						<Input
							placeholder="可以輸入用戶ID, 帳號, Email, 顯示名稱"
							allowClear
						/>
					</Item>
					<Item name={['role__in']} label="角色">
						<Select {...defaultSelectProps} options={roles} />
					</Item>
					<Item name={['billing_phone']} label="手機">
						<Input placeholder="輸入手機號碼" allowClear />
					</Item>
					<Item name={['birthday']} label="生日">
						<RangePicker
							placeholder={['開始日期', '結束日期']}
							className="w-full"
						/>
					</Item>

					<Item
						name="include"
						label="包含指定用戶"
						className="col-span-2"
						hidden
					>
						<Select mode="tags" placeholder="輸入用戶 ID" allowClear />
					</Item>
					{/* <Item name="bought_product_ids" label="已買過指定商品的用戶">
						<Input
							placeholder="可以輸入用戶ID, 帳號, Email, 顯示名稱"
							allowClear
						/>
					</Item> */}
				</div>
				<div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-x-4">
					<Button
						onClick={form?.submit}
						type="primary"
						className="w-full"
						icon={<SearchOutlined />}
					>
						篩選
					</Button>
					<Button
						type="default"
						className="w-full"
						onClick={() => {
							form.resetFields()
							form.submit()
						}}
						icon={<UndoOutlined />}
					>
						重置
					</Button>
				</div>
			</Form>
		</div>
	)
}

export default memo(Filter)
