/* eslint-disable @typescript-eslint/no-empty-function */
import { FC, useEffect } from 'react'
import { postId, snake, kebab } from '@/utils'
import { useMany, useAjaxGetPostMeta } from '@/hooks'
import { TFSMeta } from '@/types'
import { TProduct } from '@/types/wcStoreApi'
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
    dataProvider: 'wc-store',
    args: {
      include: product_ids,
    },
    queryOptions: {
      enabled: product_ids.length > 0,
    },
  })

  const rawProducts = (productsResult?.data?.data ?? []) as TProduct[]

  const setProducts = useSetAtom(productsAtom)

  useEffect(() => {
    // 商品排序與後臺一致

    if (rawProducts.length > 0) {
      const sortOrder = shop_meta.map((m) => m.productId)
      const products = sortBy(rawProducts, (p) => {
        return sortOrder.indexOf(p.id)
      })
      setProducts(products)
    }
  }, [rawProducts.length])

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
  const modalProduct = rawProducts.find((p) => p.id === modalProductId)

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

      message.open({
        key: 'jsLoaded',
        type: 'loading',
        content: ' 商品載入中 ...',
        duration: 0,
      })
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

      message.open({
        key: 'jsLoaded',
        type: 'success',
        content: ' 商品載入完成',
        duration: 2,
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
