import React from 'react'
import { DatePicker, Button, Select, Form, Checkbox, Tooltip } from 'antd'
import { ProductSelector } from '@/components/product'
import dayjs from 'dayjs'
import { useRevenueContext } from '@/pages/admin/Analytics/hooks'
import { AreaChartOutlined, LineChartOutlined } from '@ant-design/icons'
import { EViewType } from '@/pages/admin/Analytics/types'
import { RANGE_PRESETS, maxDateRange } from '@/pages/admin/Analytics/utils'

const { RangePicker } = DatePicker
const { Item } = Form

const index = () => {
	const { viewType, setViewType, filterProps, form, setQuery, context } =
		useRevenueContext()
	const { isFetching } = filterProps

	const handleSubmit = () => {
		const { date_range, product_includes = [], ...rest } = form.getFieldsValue()
		const query = {
			...rest,
			after: date_range?.[0]?.format('YYYY-MM-DDTHH:mm:ss'),
			before: date_range?.[1]?.format('YYYY-MM-DDTHH:mm:ss'),
			per_page: 10000,
			order: 'asc',
			_locale: 'user',
			product_includes,
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
						presets={RANGE_PRESETS?.filter(({ label }) => '今天' !== label)}
						disabledDate={maxDateRange}
						placeholder={['開始日期', '結束日期']}
						allowClear={false}
						className="w-[16rem]"
					/>
				</Item>
				<ProductSelector
					formItemProps={{
						name: ['product_includes'],
						label: '查看特定商品',
						hidden: 'detail' === context,
					}}
				/>
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
