/* eslint-disable @typescript-eslint/no-empty-function */
import { FC, useEffect } from 'react'
import { postId, snake, kebab } from '@/utils'
import { useMany, useAjaxGetPostMeta } from '@/hooks'
import { TFSMeta } from '@/types'
import { TProduct, TProductVariation } from '@/types/wcRestApi'
import { Empty, Result, Button, message } from 'antd'
import { RedoOutlined } from '@ant-design/icons'
import { sortBy } from 'lodash-es'
import Countdown from '@/components/Countdown'
import {
  productsAtom,
  shopMetaAtom,
  isProductModalOpenAtom,
  modalProductIdAtom,
  showCartAtom,
} from '@/pages/PowerShopProducts/atom'
import { useSetAtom, useAtom, useAtomValue } from 'jotai'
import ProductModal from '@/pages/PowerShopProducts/ProductModal'
import Cart from '@/pages/PowerShopProducts/Cart'
import { useQueries } from '@tanstack/react-query'
import { getResource } from '@/api'

const Main: FC<{
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  endTime?: number
}> = ({ isLoading, isSuccess, isError, endTime }) => {
  const mutation = useAjaxGetPostMeta<TFSMeta[]>({
    post_id: postId,
    meta_key: `${snake}_meta`,
    formatter: (post_meta: string) => JSON.parse(post_meta || '[]'),
  })
  const shop_meta = mutation?.meta ?? []
  const showCart = useAtomValue(showCartAtom)

  const setShopMeta = useSetAtom(shopMetaAtom)

  useEffect(() => {
    if (shop_meta.length > 0) {
      setShopMeta(shop_meta)
    }
  }, [shop_meta.length])

  const product_ids = shop_meta?.map((meta) => meta.productId) ?? []

  const productsResult = useMany({
    resource: 'products',
    dataProvider: 'wc',
    args: {
      include: product_ids,
    },
    queryOptions: {
      enabled: product_ids.length > 0,
    },
  })

  const rawProducts = (productsResult?.data?.data ?? []) as TProduct[]

  const variableProductIds = rawProducts
    .filter((p) => p.type === 'variable')
    .map((p) => p.id)

  const variationsResults =
    useQueries({
      queries: variableProductIds.map((vId) => {
        return {
          queryKey: [
            'variations',
            vId,
          ],
          queryFn: () =>
            getResource({
              resource: 'products',
              dataProvider: 'wc',
              pathParams: [
                vId.toString(),
                'variations',
              ],
              args: {
                per_page: 100,
              },
            }),
        }
      }),
    }) ?? []

  const variations = variationsResults
    .map((r) => r.data?.data ?? 0)
    .flat() as TProductVariation[]

  const [
    products,
    setProducts,
  ] = useAtom(productsAtom)

  useEffect(() => {
    // 商品排序與後臺一致

    if (rawProducts.length > 0) {
      const sortOrder = shop_meta.map((m) => m.productId)
      const sortedProducts = sortBy(rawProducts, (p) => {
        return sortOrder.indexOf(p.id)
      })
      const variationFormattedProducts = sortedProducts.map((p) => {
        const theVariations = [...p.variations]
        const variation_objs = theVariations
          .map((vId) => {
            const theVariation = variations.find(
              (variation) => variation.id === vId,
            )
            return theVariation
          })
          .filter((v) => !!v) as TProductVariation[]
        return {
          ...p,
          variation_objs,
        }
      })
      setProducts(variationFormattedProducts)
    }
  }, [
    rawProducts.length,
    variations.length,
  ])

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

  const setIsProductModalOpen = useSetAtom(isProductModalOpenAtom)
  const [
    modalProductId,
    setModalProductId,
  ] = useAtom(modalProductIdAtom)
  const modalProduct = products.find((p) => p.id === modalProductId)

  // addEventListener

  const els = document.querySelectorAll('div[data-ps-product-id]') ?? []
  const handleModalOpen = (id: number) => (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    setIsProductModalOpen(true)
    setModalProductId(id)
  }

  useEffect(() => {
    if (isLoading) {
      // 因為PHP已經有class了，所以這邊不用加
      // els.forEach((el) => {
      // 	el.classList.add('ps-not-ready')
      // })
    } else if (isSuccess) {
      els.forEach((el) => {
        el.classList.remove('ps-not-ready')

        const productId = parseInt(
          el.getAttribute('data-ps-product-id') ?? '0',
          10,
        )
        if (productId) {
          el.addEventListener('click', handleModalOpen(productId))

          // removeEventListener

          return () => {
            el.removeEventListener('click', handleModalOpen(productId))
          }
        }
      })
    } else if (isError) {
      message.open({
        key: 'jsLoaded',
        type: 'error',
        content: ' 商品載入失敗，請重新刷新頁面再試一次',
        duration: 0,
      })
    }
  }, [isLoading])

  return (
    <div className={`${kebab}-products`}>
      {!!endTime && (
        <Countdown toTime={endTime} title="把握最後機會🎉優惠即將到期🎉🎉🎉" />
      )}
      {modalProduct && <ProductModal product={modalProduct} />}
      <div className={showCart ? 'block' : 'hidden'}>
        <Cart />
      </div>
    </div>
  )
}

export default Main
