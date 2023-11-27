import { useEffect } from 'react'
import { useOne, useAjax } from '@/hooks'
import { useSetAtom, useAtom } from 'jotai'
import { storeApiNonceAtom, cartDataAtom, TCartItem } from '../atom'
import { DeleteOutlined } from '@ant-design/icons'
import { TPSMeta } from '@/types'
import { TCart } from '@/types/wcStoreApi'
import { Popconfirm, notification, Button, Empty } from 'antd'
import { ajaxNonce, checkoutUrl, renderHTML, getPrice } from '@/utils'
import { useQueryClient } from '@tanstack/react-query'
import ShippingField from './ShippingField'
import { BiMoneyWithdraw } from 'react-icons/bi'
import UpdateCartInputNumber from './UpdateCartInputNumber'
import defaultImage from '@/assets/images/defaultImage.jpg'
import { LoadingText } from '@/components/PureComponents'

const Cart = () => {
  const setStoreApiNonce = useSetAtom(storeApiNonceAtom)
  const [
    cartData,
    setCartData,
  ] = useAtom(cartDataAtom)
  const shop_meta = (window?.appData?.products_info?.meta ?? []) as TPSMeta[]

  const { mutate, isLoading } = useAjax({
    mutationOptions: {
      onMutate: (variables) => {
        setCartData((prev) => ({
          ...prev,
          items: prev.items.filter((item) => item.key !== variables.cart_item_key),
        }))

        const rollBack = cartData.items.find((item) => item.key === variables.cart_item_key)
        return rollBack
      },
    },
  })

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
  const rawCartData = (cartResult?.data?.data || {}) as TCart
  const cartIsFetching = cartResult?.isFetching || false
  const currency_minor_unit = rawCartData?.totals?.currency_minor_unit || 0
  const raw_total_items = Number(rawCartData?.totals?.total_items || '0')
  const total_items = getPrice(raw_total_items, currency_minor_unit)
  const raw_total_price = Number(rawCartData?.totals?.total_price || '0')
  const total_price = getPrice(raw_total_price, currency_minor_unit)
  const catItems = cartData?.items ?? []
  console.log('⭐  catItems:', catItems)

  useEffect(() => {
    setStoreApiNonce(wcStoreApiNonce)
  }, [wcStoreApiNonce])

  useEffect(() => {
    if (!cartResult?.isFetching) {
      const items = rawCartData?.items || []
      const formattedCartItems = items.map((item) => ({
        key: item.key,
        id: item.id,
        quantity: item.quantity,
        quantity_raw: item.quantity,
        name: item.name,
        short_description: item.short_description,
        description: item.description,
        images: item.images,
        variation: item.variation,
        isMutating: false,
      })) as TCartItem[]
      setCartData({
        ...rawCartData,
        items: formattedCartItems,
      })
    }
  }, [cartResult?.isFetching])

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
        onError: (error: any, _variables, rollBack) => {
          console.log('Error', error)
          api.error({
            message: error?.response?.data?.message || '移除購物車失敗',
          })
          setCartData((prev) => ({
            ...prev,
            items: prev.items.map((item) => {
              if (item.key === (rollBack as TCartItem).key) {
                return rollBack as TCartItem
              }
              return item
            }),
          }))
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
        {catItems.length === 0 && (
          <tr>
            <td colSpan={5}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="沒有資料" />
            </td>
          </tr>
        )}
        {catItems.length !== 0 &&
          catItems.map((item) => {
            const variation = item?.variation ?? []
            const variationText = variation.map((v) => `${v?.attribute}: ${v?.value}`).join(' | ')
            const isVariable = variation.length > 0
            const image = item?.images?.[0]?.src ?? defaultImage
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
              <tr key={item.key} className={`${item.isMutating ? 'animate-pulse' : ''}`}>
                <td>
                  <div className="flex">
                    <img className="w-16 h-16 rounded-md aspect-square object-cover mr-2" src={image} />
                    <div className="text-left">
                      <h6 className="font-normal text-lg mb-2 mt-0">{renderHTML(item?.name)}</h6>
                      <div className="my-0 text-xs">{variationText}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <UpdateCartInputNumber item={item} />
                </td>
                <td>{`$ ${price.toLocaleString()}`}</td>
                <td>{`$ ${(Number(price) * Number(quantity)).toLocaleString()}`}</td>
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
            <LoadingText width="w-[4rem]" content={`$ ${total_items.toLocaleString()}`} isLoading={isLoading || cartResult.isFetching} />
          </th>
          <th></th>
        </tr>
        <ShippingField cartData={cartData} isLoading={cartIsFetching} />
        <tr>
          <th className="text-left pl-4">合計</th>
          <th></th>
          <th></th>
          <th>
            <LoadingText width="w-[4rem]" content={`$ ${total_price.toLocaleString()}`} isLoading={isLoading || cartResult.isFetching} />
          </th>
          <th></th>
        </tr>
      </tfoot>
    </table>
  )

  return catItems.length === 0 ? null : (
    <div className="w-full mt-20">
      {contextHolder}
      {main}
      <div className="text-right mb-8">
        <a href={checkoutUrl}>
          <Button icon={<BiMoneyWithdraw className="relative top-[2px]" />} size="large" className="px-12" type="primary" disabled={catItems.length === 0 || isLoading || cartIsFetching}>
            前往結帳
          </Button>
        </a>
      </div>
    </div>
  )
}

function getMetaPrice({ productId, isVariable, shop_meta }: { productId: number; isVariable: boolean; shop_meta: TPSMeta[] }) {
  if (!isVariable) return shop_meta.find((m) => m.productId === productId)

  const metaWithVariations = shop_meta.filter((m) => (m?.variations || [])?.length > 0)
  const allVariations = metaWithVariations.map((m) => m.variations).flat()

  return allVariations.find((m) => m?.variationId === productId)
}

export default Cart
