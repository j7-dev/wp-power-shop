import React from 'react'
import { LoadingText, LoadingCard } from '@/components/PureComponents'
import { TCart, TShippingRates } from '@/types/wcStoreApi'
import { Select } from 'antd'
import { useUpdate } from '@/hooks'
import { useAtomValue } from 'jotai'
import { storeApiNonceAtom } from '../atom'
import { useQueryClient } from '@tanstack/react-query'

const renderItem = (shipping_rate: TShippingRates) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {shipping_rate?.name ?? '未知運送方式'}
      </div>

      <div>{`$ ${shipping_rate?.price}`}</div>
    </div>
  )
}

const ShippingField: React.FC<{ cartData: TCart; isLoading: boolean }> = ({
  cartData,
  isLoading,
}) => {
  const shipments = cartData?.shipping_rates ?? []
  const package_id = shipments?.[0]?.package_id ?? 0

  // const shipmentName = shipments?.[0]?.name ?? ''

  const shipping_rates = shipments?.[0]?.shipping_rates ?? []
  const total_shipping = cartData?.totals?.total_shipping || '0'
  const storeApiNonce = useAtomValue(storeApiNonceAtom)
  const queryClient = useQueryClient()
  const options = shipping_rates.map((shipping_rate) => {
    return {
      value: shipping_rate?.rate_id ?? '',
      label: renderItem(shipping_rate),
    }
  })

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

  return (
    <tr>
      <th className="text-left pl-4">
        <span className="mr-2">運費</span>
        <Select
          className="min-w-[12rem]"
          defaultValue={defaultOption}
          options={options}
          onChange={handleChange}
          loading={isLoading}
        />
      </th>
      <th></th>
      <th></th>
      <th>
        <LoadingText
          width="w-[8rem]"
          content={`$ ${parseInt(total_shipping, 10).toLocaleString()}`}
          isLoading={isLoading || updateIsLoading}
        />
      </th>
      <th></th>
    </tr>
  )
}

export default ShippingField
