import React, { memo, useEffect } from 'react'
import { Form, Input, InputNumber, Select, Space } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { useWoocommerce } from 'antd-toolkit/wp'

const { Item } = Form

export enum SUBSCRIPTION {
	PRICE = 'subscription_price', // 訂閱價格每 M 個月 [N 元] - number
	PERIOD_INTERVAL = 'subscription_period_interval', // 訂閱價格每 [M 個] 月 N 元 - number
	PERIOD = 'subscription_period', // 訂閱價格每 M 個 [月] N 元 - day | week | month | year
	LENGTH = 'subscription_length', // 續訂截止日，0 = 無期限 - number
	SIGN_UP_FEE = 'subscription_sign_up_fee', // 註冊費 - number
	TRIAL_LENGTH = 'subscription_trial_length', // 免費試用 [N] 天 - number
	TRIAL_PERIOD = 'subscription_trial_period', // 免費試用 N [天] - day | week | month | year
	// LIMIT = '_subscription_limit', // 續訂限制 - number
	// ONE_TIME_SHIPPING = '_subscription_one_time_shipping', // 一次性運費 - number
}

const PERIOD_OPTIONS = [
	{
		value: 'day',
		label: '天',
	},
	{
		value: 'week',
		label: '週',
	},
	{
		value: 'month',
		label: '月',
	},
	{
		value: 'year',
		label: '年',
	},
]

const lengthOptions = new Array(31).fill(0).map((_, index) => ({
	value: index,
	label: index ? `${index}` : '直到取消為止',
}))

const Subscription = ({ id, size }: { id?: string; size?: SizeType }) => {
	const form = Form.useFormInstance()
	const periodName = id ? [id, SUBSCRIPTION.PERIOD] : [SUBSCRIPTION.PERIOD]
	const regularPriceName = id ? [id, 'regular_price'] : ['regular_price']
	const watchPeriod = Form.useWatch(periodName, form)
	const watchPeriodLabel = watchPeriod
		? PERIOD_OPTIONS.find((option) => option.value === watchPeriod)?.label
		: ''

	const watchPrice = Form.useWatch(SUBSCRIPTION.PRICE, form)

	useEffect(() => {
		form.setFieldValue(regularPriceName, watchPrice)
	}, [watchPrice])

	const {
		currency: { symbol },
	} = useWoocommerce()

	return (
		<>
			<Item name={regularPriceName} label="原價" hidden />

			<div className="ant-form-item">
				<div className="ant-form-item-label">
					<label className="tw-block mb-2">訂閱價格 ({symbol})</label>
				</div>
				<Space.Compact block>
					<Item
						name={id ? [id, SUBSCRIPTION.PRICE] : [SUBSCRIPTION.PRICE]}
						noStyle
						rules={[{ required: true }]}
					>
						<InputNumber className="w-[37%]" addonAfter="元" size={size} />
					</Item>
					<Item
						name={
							id
								? [id, SUBSCRIPTION.PERIOD_INTERVAL]
								: [SUBSCRIPTION.PERIOD_INTERVAL]
						}
						noStyle
						initialValue={1}
					>
						<InputNumber
							className="w-[37%]"
							addonBefore="每"
							addonAfter="個"
							min={1}
							size={size}
						/>
					</Item>
					<Item name={periodName} noStyle initialValue="month">
						<Select options={PERIOD_OPTIONS} className="w-[26%]" size={size} />
					</Item>
				</Space.Compact>
			</div>

			<div className="ant-form-item">
				<div className="ant-form-item-label">
					<label className="tw-block mb-2">續訂截止日(扣款期數)</label>
				</div>
				<Space.Compact block>
					<Item
						name={id ? [id, SUBSCRIPTION.LENGTH] : [SUBSCRIPTION.LENGTH]}
						label="續訂截止日(扣款期數)"
						noStyle
						initialValue={0}
					>
						<Select options={lengthOptions} className="flex-1" size={size} />
					</Item>
					<Input
						className="w-[32%] pointer-events-none"
						addonBefore="個"
						value={watchPeriodLabel}
						size={size}
					/>
				</Space.Compact>
			</div>

			<Item
				name={id ? [id, SUBSCRIPTION.SIGN_UP_FEE] : [SUBSCRIPTION.SIGN_UP_FEE]}
				label={`註冊費 (${symbol})`}
				initialValue={0}
			>
				<InputNumber className="w-full" size={size} />
			</Item>

			<div className="ant-form-item">
				<div className="ant-form-item-label">
					<label className="tw-block mb-2">免費試用</label>
				</div>
				<Space.Compact block>
					<Item
						name={
							id ? [id, SUBSCRIPTION.TRIAL_LENGTH] : [SUBSCRIPTION.TRIAL_LENGTH]
						}
						noStyle
						initialValue={0}
					>
						<InputNumber className="w-[74%]" addonAfter="個" size={size} />
					</Item>
					<Item
						name={
							id ? [id, SUBSCRIPTION.TRIAL_PERIOD] : [SUBSCRIPTION.TRIAL_PERIOD]
						}
						noStyle
						initialValue="month"
					>
						<Select options={PERIOD_OPTIONS} className="w-[26%]" size={size} />
					</Item>
				</Space.Compact>
			</div>
		</>
	)
}

export default memo(Subscription)
