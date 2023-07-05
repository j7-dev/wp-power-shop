import { useEffect, useContext } from 'react'
import { useOne, useAdminAjax } from '@/hooks'
import { useSetAtom } from 'jotai'
import { storeApiNonceAtom } from '../atom'
import { DeleteOutlined } from '@ant-design/icons'
import { ProductsContext } from '@/pages/FastShopProducts'
import { TFSMeta } from '@/types'
import { Popconfirm, notification } from 'antd'
import { ajaxNonce } from '@/utils'
import { useQueryClient } from '@tanstack/react-query'


const Cart = () => {
  const setStoreApiNonce = useSetAtom(storeApiNonceAtom)
  const { fast_shop_meta } = useContext(ProductsContext)
  const { mutate, isLoading } = useAdminAjax()
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
  const cartData = cartResult?.data?.data || {}
	const total_items	= cartData?.totals?.total_items	|| 0
	const total_shipping = cartData?.totals?.total_shipping || 0
	const total_price = cartData?.totals?.total_price || 0

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
                    <img
                      className="w-16 h-16 rounded-md aspect-square object-cover mr-2"
                      src={image}
                    />
                    <div className="text-left">
                      <h6 className="font-normal text-lg mb-2">{item?.name}</h6>
                      <p className="my-0 text-xs">{variationText}</p>
                    </div>
                  </div>
                </td>
                <td>{quantity}</td>
                <td>${price}</td>
                <td>${price * quantity}</td>
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
            <th>小計</th>
            <th></th>
            <th></th>
            <th>{total_items}</th>
            <th></th>
          </tr>
					<tr>
            <th>運費</th>
            <th></th>
            <th></th>
            <th>{total_shipping}</th>
            <th></th>
          </tr>
					<tr>
            <th>合計</th>
            <th></th>
            <th></th>
            <th>{total_price}</th>
            <th></th>
          </tr>
        </tbody>
      </table>
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
