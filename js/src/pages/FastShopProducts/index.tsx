/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react'
import { postId } from '@/utils'
import { useOne, useMany } from '@/hooks'
import { TFSMeta } from '@/types'
import { TProduct } from '@/types/wcStoreApi'
import Item from './Item'
import useCartModal from './hooks/useCartModal'
import Cart from './Cart'

export const ProductsContext = createContext({
  products: [] as TProduct[],
  fast_shop_meta: [] as TFSMeta[],
  showFSModal:
    (_props: { product: TProduct; FSMeta: TFSMeta | undefined }) => () => {},
})

const FastShopProducts = () => {
  const postResult = useOne({
    resource: `fast-shop/${postId}`,
    queryOptions: {
      enabled: !!postId,
    },
  })
  const post = postResult?.data?.data || {}
  const fast_shop_meta = JSON.parse(
    post?.meta?.fast_shop_meta || '[]',
  ) as TFSMeta[]
  const product_ids = fast_shop_meta.map((meta) => meta.productId)

  const productsResult = useMany({
    resource: 'products',
    dataProvider: 'wc-store',
    args: {
      include: product_ids,
    },
    queryOptions: {
      enabled: product_ids.length > 0,
    },
  })

  const products = (productsResult?.data?.data ?? []) as TProduct[]

  const { renderCartModal, showFSModal } = useCartModal()

  return (
    <div className="fast-shop-products">
      <ProductsContext.Provider
        value={{
          products,
          fast_shop_meta,
          showFSModal,
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => {
            return <Item key={product?.id} productId={product?.id} />
          })}
        </div>
      </ProductsContext.Provider>
      {renderCartModal()}
      <div className="mt-20">
        <Cart />
      </div>
    </div>
  )
}

export default FastShopProducts
