/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react'
import { postId, snake, kebab } from '@/utils'
import { useMany, useAjaxGetPostMeta } from '@/hooks'
import { TFSMeta } from '@/types'
import { TProduct } from '@/types/wcStoreApi'
import Item from './Item'
import useCartModal from './hooks/useCartModal'
import Cart from './Cart'
import { LoadingCard } from '@/components/PureComponents'
import { Empty, Result, Button } from 'antd'
import { RedoOutlined } from '@ant-design/icons'

export const ProductsContext = createContext({
  products: [] as TProduct[],
  shop_meta: [] as TFSMeta[],
  showFSModal:
    (_props: { product: TProduct; FSMeta: TFSMeta | undefined }) => () => {},
})

const PowerShopProducts = () => {
  const mutation = useAjaxGetPostMeta<TFSMeta[]>({
    post_id: postId,
    meta_key: `${snake}_meta`,
    formatter: (post_meta: string) => JSON.parse(post_meta || '[]'),
  })
  const shop_meta = mutation?.meta ?? []

  const product_ids = shop_meta?.map((meta) => meta.productId) ?? []

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

  if (product_ids.length === 0 && !productsResult.isLoading) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="沒有資料" />
  }

  if (productsResult.isError) {
    const handleRefresh = () => {
      window.location.reload()
    }

    return (
      <Result
        status="404"
        title="OOPS!"
        subTitle="遭遇一些技術錯誤，請再試一次。"
        extra={
          <Button
            type="primary"
            icon={<RedoOutlined />}
            onClick={handleRefresh}
          >
            再試一次
          </Button>
        }
      />
    )
  }

  return (
    <div className={`${kebab}-products`}>
      <ProductsContext.Provider
        value={{
          products,
          shop_meta,
          showFSModal,
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {productsResult.isLoading &&
            product_ids.length > 0 &&
            [
              1,
              2,
              3,
              4,
            ].map((i) => <LoadingCard key={i} ratio="aspect-[260/385]" />)}
          {!productsResult.isLoading &&
            product_ids.length > 0 &&
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

export default PowerShopProducts
