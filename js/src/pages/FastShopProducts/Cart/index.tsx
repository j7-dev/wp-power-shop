import { useEffect, useContext } from 'react'
import { useOne } from '@/hooks'
import { useSetAtom } from 'jotai'
import { storeApiNonceAtom } from '../atom'
import { DeleteOutlined } from '@ant-design/icons'
import { ProductsContext } from '@/pages/FastShopProducts'

const Cart = () => {
  const setStoreApiNonce = useSetAtom(storeApiNonceAtom)
  const { fast_shop_meta } = useContext(ProductsContext)
  console.log('⭐ ~ Cart ~ fast_shop_meta:', fast_shop_meta)

  const cartResult = useOne({
    resource: 'cart',
    dataProvider: 'wc-store',
  })
  const wcStoreApiNonce =
    cartResult?.data?.headers?.['x-wc-store-api-nonce'] || ''
  const cartData = cartResult?.data?.data || {}
  const items = cartData?.items || []

  useEffect(() => {
    setStoreApiNonce(wcStoreApiNonce)
  }, [wcStoreApiNonce])

  return (
    <div>
      <table className="fs-cart-table">
        <tr>
          <th>商品</th>
          <th>數量</th>
          <th>小計</th>
          <th></th>
        </tr>
        {items.map((item: any) => {
          const image = item?.images?.[0]?.src ?? ''
          const id = item?.id ?? ''
          const meta = fast_shop_meta.find((m) => m.productId === id)
          const regularPrice = meta?.regularPrice ?? 0
          const salesPrice = meta?.salesPrice ?? 0
          const price = !!salesPrice ? salesPrice : regularPrice
          return (
            <tr key={item.key}>
              <td>
                <div className="flex">
                  <img
                    className="w-12 h-12 aspect-square object-cover mr-2"
                    src={image}
                  />
                  <h6 className="font-normal text-lg">{item?.name}</h6>
                </div>
              </td>
              <td>{`${item?.quantity}`}</td>
              <td>${price}</td>
              <td>
                <DeleteOutlined className="text-red-500" />
              </td>
            </tr>
          )
        })}
      </table>
    </div>
  )
}

export default Cart
