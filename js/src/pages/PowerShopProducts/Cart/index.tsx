import { useEffect } from 'react'
import { useOne, useAjax } from '@/hooks'
import { useSetAtom } from 'jotai'
import { storeApiNonceAtom } from '../atom'
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { TPSMeta } from '@/types'
import { TCart } from '@/types/wcStoreApi'
import { Popconfirm, notification, Button, Empty, Spin } from 'antd'
import { ajaxNonce, checkoutUrl, renderHTML, getPrice } from '@/utils'
import { useQueryClient } from '@tanstack/react-query'
import { LoadingText, LoadingCard } from '@/components/PureComponents'
import ShippingField from './ShippingField'
import { BiMoneyWithdraw } from 'react-icons/bi'
import UpdateCartInputNumber from './UpdateCartInputNumber'
import { toNumber } from 'lodash-es'

const Cart = () => {
  const setStoreApiNonce = useSetAtom(storeApiNonceAtom)
  const shop_meta = (window?.appData?.products_info?.meta ?? []) as TPSMeta[]

  const { mutate, isLoading } = useAjax()
  const [
    api,
    contextHolder,
  ] = notification.useNotification()
  const queryClient = useQueryClient()

  const cartResult = useOne({
    resource: 'cart',
    dataProvider: 'wc-store',
  })
  const wcStoreApiNonce = cartResult?.data?.headers?.['x-wc-store-api-nonce'] || ''
  const cartData = (cartResult?.data?.data || {}) as TCart
  const cartIsFetching = cartResult?.isFetching || false
  const currency_minor_unit = cartData?.totals?.currency_minor_unit || 0
  const raw_total_items = parseInt(cartData?.totals?.total_items || '0', 10)
  const total_items = getPrice(raw_total_items, currency_minor_unit)
  const raw_total_price = parseInt(cartData?.totals?.total_price || '0', 10)
  const total_price = getPrice(raw_total_price, currency_minor_unit)

  const items = cartData?.items || []

  useEffect(() => {
    setStoreApiNonce(wcStoreApiNonce)
  }, [wcStoreApiNonce])

  const confirm = (cart_item_key: string) => () => {
    mutate(
      {
        action: 'handle_remove_cart',
        nonce: ajaxNonce,
        cart_item_key,
      },
      {
        onSuccess: () => {
          api.success({
            message: '移除購物車成功',
          })
          queryClient.invalidateQueries({ queryKey: ['get_cart'] })
        },
        onError: (error) => {
          console.log('Error', error)
          api.error({
            message: '移除購物車失敗',
          })
        },
      },
    )
  }

  const main = (
    <table id="ps-cart-table" className="ps-cart-table">
      <thead>
        <tr>
          <th data-key="product">商品</th>
          <th data-key="qty">數量</th>
          <th data-key="unit_price">單價</th>
          <th data-key="total">小計</th>
          <th data-key="action"></th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 && (
          <tr>
            <td colSpan={5}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="沒有資料" />
            </td>
          </tr>
        )}
        {items.length !== 0 &&
          items.map((item: any) => {
            const variation = item?.variation ?? []
            const variationText = variation.map((v: any) => `${v?.attribute}: ${v?.value}`).join(' | ')
            const isVariable = variation.length > 0
            const image = item?.images?.[0]?.src ?? ''
            const id = item?.id ?? ''
            const metaPrice = getMetaPrice({
              productId: id,
              isVariable,
              shop_meta,
            })
            const regularPrice = metaPrice?.regularPrice ?? 0
            const salesPrice = metaPrice?.salesPrice ?? 0
            const price = !!salesPrice ? salesPrice : regularPrice
            const quantity = item?.quantity ?? 1

            return (
              <tr key={item.key}>
                <td>
                  <div className="flex">
                    {isLoading || cartIsFetching ? (
                      <div className="w-16 h-16 mr-2">
                        <LoadingCard ratio="aspect-square" />
                      </div>
                    ) : (
                      <img className="w-16 h-16 rounded-md aspect-square object-cover mr-2" src={image} />
                    )}

                    <div className="text-left">
                      <h6 className="font-normal text-lg mb-2 mt-0">
                        <LoadingText width="w-[8rem]" content={renderHTML(item?.name)} isLoading={isLoading || cartIsFetching} />
                      </h6>
                      <div className="my-0 text-xs">
                        <LoadingText width="w-[12rem]" content={variationText} isLoading={isLoading || cartIsFetching} />
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <UpdateCartInputNumber item={item} />
                </td>
                <td>
                  <LoadingText width="w-[4rem]" content={`$ ${price.toLocaleString()}`} isLoading={isLoading || cartIsFetching} />
                </td>
                <td>
                  <LoadingText width="w-[4rem]" content={`$ ${(toNumber(price) * quantity).toLocaleString()}`} isLoading={isLoading || cartIsFetching} />
                </td>
                <td>
                  <Popconfirm title="確定要從購物車移除嗎?" onConfirm={confirm(item.key)} okText="確認" cancelText="再想想">
                    <DeleteOutlined className="text-red-500 cursor-pointer" />
                  </Popconfirm>
                </td>
              </tr>
            )
          })}
      </tbody>
      <tfoot>
        <tr>
          <th className="text-left pl-4">小計</th>
          <th></th>
          <th></th>
          <th>
            <LoadingText width="w-[4rem]" content={`$ ${total_items.toLocaleString()}`} isLoading={isLoading} />
          </th>
          <th></th>
        </tr>
        <ShippingField cartData={cartData} isLoading={cartIsFetching} />
        <tr>
          <th className="text-left pl-4">合計</th>
          <th></th>
          <th></th>
          <th>
            <LoadingText width="w-[4rem]" content={`$ ${total_price.toLocaleString()}`} isLoading={isLoading} />
          </th>
          <th></th>
        </tr>
      </tfoot>
    </table>
  )

  return items.length === 0 ? null : (
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} spinning={isLoading || cartIsFetching}>
      <div className="w-full mt-20">
        {contextHolder}
        {main}
        <div className="text-right mb-8">
          <a href={checkoutUrl}>
            <Button icon={<BiMoneyWithdraw className="relative top-[2px]" />} size="large" className="px-12" type="primary" disabled={items.length === 0 || isLoading || cartIsFetching}>
              前往結帳
            </Button>
          </a>
        </div>
      </div>
    </Spin>
  )
}

function getMetaPrice({ productId, isVariable, shop_meta }: { productId: number; isVariable: boolean; shop_meta: TPSMeta[] }) {
  if (!isVariable) return shop_meta.find((m) => m.productId === productId)

  const metaWithVariations = shop_meta.filter((m) => (m?.variations || [])?.length > 0)
  const allVariations = metaWithVariations.map((m) => m.variations).flat()

  return allVariations.find((m) => m?.variationId === productId)
}

export default Cart
