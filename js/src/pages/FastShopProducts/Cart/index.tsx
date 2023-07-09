import { useEffect, useContext } from 'react'
import { useOne, useAjax } from '@/hooks'
import { useSetAtom } from 'jotai'
import { storeApiNonceAtom } from '../atom'
import { DeleteOutlined } from '@ant-design/icons'
import { ProductsContext } from '@/pages/FastShopProducts'
import { TFSMeta } from '@/types'
import { TCart } from '@/types/wcStoreApi'
import { Popconfirm, notification, Button } from 'antd'
import { ajaxNonce, checkoutUrl } from '@/utils'
import { useQueryClient } from '@tanstack/react-query'
import { LoadingText, LoadingCard } from '@/components/PureComponents'
import ShippingField from './ShippingField'
import { BiMoneyWithdraw } from 'react-icons/bi'

const Cart = () => {
  const setStoreApiNonce = useSetAtom(storeApiNonceAtom)
  const { fast_shop_meta } = useContext(ProductsContext)
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
  const wcStoreApiNonce =
    cartResult?.data?.headers?.['x-wc-store-api-nonce'] || ''
  const cartData = (cartResult?.data?.data || {}) as TCart
  const cartIsLoading = cartResult?.isLoading || false
  const total_items = cartData?.totals?.total_items || '0'
  const total_price = cartData?.totals?.total_price || '0'

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

  return (
    <div>
      {items.length === 0 ? null : (
        <>
          {contextHolder}
          <table className="fs-cart-table">
            <thead>
              <tr>
                <th>商品</th>
                <th>數量</th>
                <th>單價</th>
                <th>小計</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => {
                const variation = item?.variation ?? []
                const variationText = variation
                  .map((v: any) => `${v?.attribute}: ${v?.value}`)
                  .join(' | ')
                const isVariable = variation.length > 0
                const image = item?.images?.[0]?.src ?? ''
                const id = item?.id ?? ''
                const metaPrice = getMetaPrice({
                  productId: id,
                  isVariable,
                  fast_shop_meta,
                })
                const regularPrice = metaPrice?.regularPrice ?? 0
                const salesPrice = metaPrice?.salesPrice ?? 0
                const price = !!salesPrice ? salesPrice : regularPrice
                const quantity = item?.quantity ?? 1
                return (
                  <tr key={item.key}>
                    <td>
                      <div className="flex">
                        {isLoading ? (
                          <div className="w-16 h-16 mr-2">
                            <LoadingCard ratio="aspect-square" />
                          </div>
                        ) : (
                          <img
                            className="w-16 h-16 rounded-md aspect-square object-cover mr-2"
                            src={image}
                          />
                        )}

                        <div className="text-left">
                          <h6 className="font-normal text-lg mb-2">
                            <LoadingText
                              width="w-[8rem]"
                              content={item?.name}
                              isLoading={isLoading}
                            />
                          </h6>
                          <p className="my-0 text-xs">
                            <LoadingText
                              width="w-[12rem]"
                              content={variationText}
                              isLoading={isLoading}
                            />
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <LoadingText
                        width="w-[2rem]"
                        content={quantity}
                        isLoading={isLoading}
                      />
                    </td>
                    <td>
                      <LoadingText
                        width="w-[4rem]"
                        content={`$ ${price.toLocaleString()}`}
                        isLoading={isLoading}
                      />
                    </td>
                    <td>
                      <LoadingText
                        width="w-[4rem]"
                        content={`$ ${(price * quantity).toLocaleString()}`}
                        isLoading={isLoading}
                      />
                    </td>
                    <td>
                      <Popconfirm
                        title="確定要從購物車移除嗎?"
                        onConfirm={confirm(item.key)}
                        okText="確認"
                        cancelText="再想想"
                      >
                        <DeleteOutlined className="text-red-500 cursor-pointer" />
                      </Popconfirm>
                    </td>
                  </tr>
                )
              })}
              <tr>
                <th className="text-left pl-4">小計</th>
                <th></th>
                <th></th>
                <th>
                  <LoadingText
                    width="w-[4rem]"
                    content={`$ ${parseInt(total_items, 10).toLocaleString()}`}
                    isLoading={isLoading}
                  />
                </th>
                <th></th>
              </tr>
              <ShippingField cartData={cartData} isLoading={cartIsLoading} />
              <tr>
                <th className="text-left pl-4">合計</th>
                <th></th>
                <th></th>
                <th>
                  <LoadingText
                    width="w-[4rem]"
                    content={`$ ${parseInt(total_price, 10).toLocaleString()}`}
                    isLoading={isLoading}
                  />
                </th>
                <th></th>
              </tr>
            </tbody>
          </table>
          <div className="text-right mb-8">
            <a href={checkoutUrl}>
              <Button
                icon={<BiMoneyWithdraw className="relative top-[2px]" />}
                size="large"
                className="px-12"
                type="primary"
              >
                前往結帳
              </Button>
            </a>
          </div>
        </>
      )}
    </div>
  )
}

function getMetaPrice({
  productId,
  isVariable,
  fast_shop_meta,
}: {
  productId: number
  isVariable: boolean
  fast_shop_meta: TFSMeta[]
}) {
  if (!isVariable) return fast_shop_meta.find((m) => m.productId === productId)

  const metaWithVariations = fast_shop_meta.filter(
    (m) => (m?.variations || [])?.length > 0,
  )
  const allVariations = metaWithVariations.map((m) => m.variations).flat()

  return allVariations.find((m) => m?.variationId === productId)
}

export default Cart
