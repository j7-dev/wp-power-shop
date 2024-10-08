import React from 'react'
import { LoadingText } from '@/components/PureComponents'
import { TShippingRates } from '@/types/wcStoreApi'
import { Select, Tooltip } from 'antd'
import { useUpdate } from '@/hooks'
import { useAtomValue } from 'jotai'
import { storeApiNonceAtom, TCartData } from '../atom'
import { useQueryClient } from '@tanstack/react-query'
import { InfoCircleFilled } from '@ant-design/icons'
import { getPrice } from '@/utils'

const renderItem = (
	shipping_rate: TShippingRates,
	currency_minor_unit: number,
) => {
	const price = getPrice(
		parseInt(shipping_rate?.price ?? '0', 10),
		currency_minor_unit,
	)

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center">
				{shipping_rate?.name ?? '未知運送方式'}
			</div>

			<div>{`$ ${price}`}</div>
		</div>
	)
}

const ShippingField: React.FC<{ cartData: TCartData; isLoading: boolean }> = ({
	cartData,
	isLoading,
}) => {
	const shipments = cartData?.shipping_rates ?? []
	const currency_minor_unit = cartData?.totals?.currency_minor_unit || 0
	const package_id = shipments?.[0]?.package_id ?? 0

	// const shipmentName = shipments?.[0]?.name ?? ''

	const shipping_rates = shipments?.[0]?.shipping_rates ?? []
	const raw_total_shipping = parseInt(
		cartData?.totals?.total_shipping || '0',
		10,
	)
	const total_shipping = getPrice(raw_total_shipping, currency_minor_unit)
	const storeApiNonce = useAtomValue(storeApiNonceAtom)
	const queryClient = useQueryClient()
	const options = shipping_rates.map((shipping_rate) => {
		return {
			value: shipping_rate?.rate_id ?? '',
			label: renderItem(shipping_rate, currency_minor_unit),
		}
	})

	const nonOptions = [
		{
			value: 'none',
			label: <>請選擇運送方式</>,
		},
	]

	const defaultOption =
		shipping_rates.find((shipping_rate) => shipping_rate.selected)?.rate_id ??
		''

	const { mutate, isLoading: updateIsLoading } = useUpdate({
		resource: 'cart/select-shipping-rate',
		dataProvider: 'wc-store',
		config: {
			headers: {
				Nonce: storeApiNonce,
			},
		},
	})

	const handleChange = (rate_id: string) => {
		mutate(
			{
				package_id,
				rate_id,
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ['get_cart'] })
				},
			},
		)
	}

	if (options.length === 0) {
		return null
	}

	return (
		<tr>
			<th className="text-left pl-4" colSpan={3}>
				<span className="mr-2">運費</span>
				<Select
					className="min-w-[12rem]"
					defaultValue={nonOptions[0].value}
					value={options.length > 0 ? defaultOption : nonOptions[0].value}
					options={options.length > 0 ? options : nonOptions}
					onChange={handleChange}
					loading={isLoading}
					disabled={options.length === 0}
				/>
				{options.length === 0 && (
					<Tooltip title='請確認您的地址"國家"欄位有可用的運送方式或者確認購物車有商品'>
						<InfoCircleFilled className="ml-2 text-orange-500" />
					</Tooltip>
				)}
			</th>
			<th className="text-right">
				<LoadingText
					width="w-[4rem]"
					content={`$ ${total_shipping.toLocaleString()}`}
					isLoading={isLoading || updateIsLoading}
				/>
			</th>
			<th></th>
		</tr>
	)
}

export default ShippingField
