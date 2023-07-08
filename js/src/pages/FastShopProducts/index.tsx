/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useEffect, useState } from 'react'
import { postId, ajaxNonce } from '@/utils'
import { useMany, useAdminAjax } from '@/hooks'
import { TFSMeta } from '@/types'
import { TProduct } from '@/types/wcStoreApi'
import Item from './Item'
import useCartModal from './hooks/useCartModal'
import Cart from './Cart'
import { LoadingCard } from '@/components/PureComponents'

export const ProductsContext = createContext({
  products: [] as TProduct[],
  fast_shop_meta: [] as TFSMeta[],
  showFSModal:
    (_props: { product: TProduct; FSMeta: TFSMeta | undefined }) => () => {},
})

const FastShopProducts = () => {
  const [
    fast_shop_meta,
    setFast_shop_meta,
  ] = useState<TFSMeta[]>([])

  const { mutate } = useAdminAjax()

  useEffect(() => {
    mutate(
      {
        action: 'handle_get_post_meta',
        nonce: ajaxNonce,
        post_id: postId,
        meta_key: 'fast_shop_meta',
      },
      {
        onSuccess: (data) => {
          const post_meta = JSON.parse(
            data?.data?.data?.post_meta || '[]',
          ) as TFSMeta[]
          setFast_shop_meta(post_meta)
        },
        onError: (error) => {
          console.log(error)
        },
      },
    )
  }, [])

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
          {productsResult.isLoading &&
            [
              1,
              2,
              3,
              4,
            ].map((i) => <LoadingCard key={i} ratio="aspect-[260/385]" />)}
          {!productsResult.isLoading &&
            products.map((product) => {
              return <Item key={product?.id} productId={product?.id} />
            })}
        </div>

        {renderCartModal()}
        <div className="mt-20">
          <Cart />
        </div>
      </ProductsContext.Provider>
    </div>
  )
}

export default FastShopProducts
