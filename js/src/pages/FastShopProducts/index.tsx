import { postId } from '@/utils'
import { useOne, useMany } from '@/hooks'
import { TFastShopMeta } from '@/types'
import { TProduct } from '@/types/wcRestApi'
import Item from './Item'

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
  ) as TFastShopMeta[]
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
  console.log(
    '🚀 ~ file: index.tsx:32 ~ FastShopProducts ~ products:',
    products,
  )

  return (
    <div className="fast-shop-products">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => {
          const productMeta = fast_shop_meta.find(
            (meta) => meta.productId === product.id,
          )
          return <Item key={product?.id} product={product} meta={productMeta} />
        })}
      </div>
    </div>
  )
}

export default FastShopProducts
