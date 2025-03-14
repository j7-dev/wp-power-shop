import React from 'react'
import {
	DatePicker,
	TimeRangePickerProps,
	Button,
	Select,
	Form,
	Checkbox,
	Tooltip,
	FormInstance,
	DatePickerProps,
	Tag,
} from 'antd'
import { useSelect } from '@refinedev/antd'
import dayjs from 'dayjs'
import { TProductSelectOption } from '../types'
import { productTypes } from '@/utils'
import { TQuery } from '../hooks/useRevenue'
import { AreaChartOutlined, LineChartOutlined } from '@ant-design/icons'
import { EViewType } from '../types'
import { defaultSelectProps } from 'antd-toolkit'

const { RangePicker } = DatePicker
const { Item } = Form

const RANGE_PRESETS: TimeRangePickerProps['presets'] = [
	{
		label: '最近 7 天',
		value: [dayjs().add(-7, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '最近 14 天',
		value: [dayjs().add(-14, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '最近 30 天',
		value: [dayjs().add(-30, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '最近 90 天',
		value: [dayjs().add(-90, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '最近 180 天',
		value: [dayjs().add(-180, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '最近 365 天',
		value: [dayjs().add(-365, 'd').startOf('day'), dayjs().endOf('day')],
	},
	{
		label: '月初至今',
		value: [dayjs().startOf('month'), dayjs().endOf('day')],
	},
	{ label: '年初至今', value: [dayjs().startOf('year'), dayjs().endOf('day')] },
]

// Disabled 732 days from the selected date
const maxDateRange: DatePickerProps['disabledDate'] = (
	current,
	{ from, type },
) => {
	if (current && current > dayjs().endOf('day')) {
		return true
	}
	if (from) {
		return Math.abs(current.diff(from, 'days')) >= 366
	}

	return false
}

export type TFilterProps = {
	isFetching: boolean
	isLoading: boolean
	setQuery: React.Dispatch<React.SetStateAction<TQuery>>
	query: TQuery
	totalPages: number
	total: number
	form: FormInstance
	viewType: EViewType
	setViewType: React.Dispatch<React.SetStateAction<EViewType>>
}

const index = ({
	setQuery,
	isFetching,
	form,
	viewType,
	setViewType,
}: TFilterProps) => {
	const { selectProps: productSelectProps, query: productQuery } =
		useSelect<TProductSelectOption>({
			resource: 'products/select',
			optionLabel: 'name',
			optionValue: 'id',
			onSearch: (value) => [
				{
					field: 's',
					operator: 'eq',
					value,
				},
			],
			filters: [],
		})

	const productSelectOptions = productQuery?.data?.data || []

	const handleSubmit = () => {
		const {
			date_range,
			products = [],
			bundle_products = [],
			...rest
		} = form.getFieldsValue()
		const query = {
			...rest,
			after: date_range?.[0]?.format('YYYY-MM-DDTHH:mm:ss'),
			before: date_range?.[1]?.format('YYYY-MM-DDTHH:mm:ss'),
			per_page: 10000,
			order: 'asc',
			_locale: 'user',
			product_includes: [...products, ...bundle_products],
		}
		setQuery(query)
	}

	return (
		<Form form={form} onFinish={handleSubmit} layout="vertical">
			<div className="flex items-center gap-x-4 mb-4">
				<Item
					label="日期範圍"
					name={['date_range']}
					tooltip="最大選取範圍為 1 年"
					initialValue={[
						dayjs()?.add(-7, 'd')?.startOf('day'),
						dayjs()?.endOf('day'),
					]}
					rules={[
						{
							required: true,
							message: '請選擇日期範圍',
						},
					]}
				>
					<RangePicker
						presets={RANGE_PRESETS}
						disabledDate={maxDateRange}
						placeholder={['開始日期', '結束日期']}
						allowClear={false}
						className="w-[16rem]"
					/>
				</Item>

				<Item name={['products']} className="w-full" label="查看特定商品">
					<Select
						{...defaultSelectProps}
						{...productSelectProps}
						placeholder="可多選，可搜尋關鍵字"
						optionRender={({ value, label }) => {
							const option = productSelectOptions.find(
								(productOption) => productOption?.id === value,
							)
							const productType = productTypes.find(
								(pt) => pt?.value === option?.type,
							)
							return (
								<span>
									<span className="text-gray-400 text-xs">#{value}</span>{' '}
									{label}{' '}
									<Tag color={productType?.color}>{productType?.label}</Tag>
								</span>
							)
						}}
					/>
				</Item>
				<Item name={['interval']} initialValue={'day'} label="時間間格">
					<Select
						className="w-24"
						options={[
							{
								label: '依天',
								value: 'day',
							},
							{
								label: '依週',
								value: 'week',
							},
							{
								label: '依月',
								value: 'month',
							},
							{
								label: '依季度',
								value: 'quarter',
							},
						]}
					/>
				</Item>
				<Item label=" ">
					<Button type="primary" htmlType="submit" loading={isFetching}>
						查詢
					</Button>
				</Item>
			</div>

			<div className="flex justify-between">
				<div className="flex items-center gap-x-4">
					<Item
						name={['compare_last_year']}
						initialValue={false}
						noStyle
						valuePropName="checked"
					>
						<Checkbox>與去年同期比較</Checkbox>
					</Item>
				</div>
				<div className="flex items-center gap-x-2">
					<Tooltip title="分開顯示">
						<LineChartOutlined
							className={`text-xl ${EViewType.DEFAULT === viewType ? 'text-primary' : 'text-gray-400'}`}
							onClick={() => setViewType(EViewType.DEFAULT)}
						/>
					</Tooltip>
					<Tooltip title="堆疊比較">
						<AreaChartOutlined
							className={`text-xl ${EViewType.AREA === viewType ? 'text-primary' : 'text-gray-400'}`}
							onClick={() => setViewType(EViewType.AREA)}
						/>
					</Tooltip>
				</div>
			</div>
		</Form>
	)
}

export default index
