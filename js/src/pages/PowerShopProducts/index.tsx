import { useEffect } from 'react'
import Main from './Main'
import ShopClosed from './ShopClosed'
import ShopComing from './ShopComing'
import { useAjaxGetPostMeta } from '@/hooks'
import { postId, snake } from '@/utils'
import { TSettings, defaultSettings } from '@/types'
import dayjs from 'dayjs'
import { message } from 'antd'
import { isProductModalOpenAtom, modalProductIdAtom, shopStatusAtom } from '@/pages/PowerShopProducts/atom'
import { useSetAtom, useAtom } from 'jotai'
import ProductModal from '@/pages/PowerShopProducts/ProductModal'

const getStatus = ({ startTime, endTime }: { startTime: number | undefined; endTime: number | undefined }): 'published' | 'coming' | 'closed' => {
  const now = dayjs().valueOf()

  if (!startTime && !endTime) return 'published'

  if (!startTime && endTime) {
    return now < endTime ? 'published' : 'closed'
  }

  if (startTime && !endTime) {
    return now > startTime ? 'published' : 'coming'
  }

  if (startTime && endTime) {
    if (now < startTime) return 'coming'
    if (now > endTime) return 'closed'
    if (now > startTime && now < endTime) return 'published'
  }
  return 'published'
}

const PowerShopProducts = () => {
  const result = useAjaxGetPostMeta<TSettings>({
    post_id: postId,
    meta_key: `${snake}_settings`,
    formatter: (post_meta: string) => JSON.parse(post_meta || '{}'),
  })
  const { isLoading, isSuccess, isError, error } = result
  const settings = result?.meta ?? defaultSettings
  const startTime = settings?.startTime
  const endTime = settings?.endTime
  const shopStatus = getStatus({ startTime, endTime })
  const setShopStatus = useSetAtom(shopStatusAtom)

  const products = window?.appData?.products_info?.products ?? []

  const setIsProductModalOpen = useSetAtom(isProductModalOpenAtom)
  const [
    modalProductId,
    setModalProductId,
  ] = useAtom(modalProductIdAtom)
  const modalProduct = products.find((p) => p.id === modalProductId)

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
        const productId = parseInt(el.getAttribute('data-ps-product-id') ?? '0', 10)
        if (productId) {
          el.addEventListener('click', handleModalOpen(productId))

          return () => {
            el.removeEventListener('click', handleModalOpen(productId))
          }
        }
      })
    } else if (isError) {
      const status: number = error?.response?.status ?? 500
      if (status !== 403) {
        message.open({
          key: 'jsLoaded',
          type: 'error',
          content: ' 商品載入失敗，請重新刷新頁面再試一次',
          duration: 0,
        })
      }
    }
  }, [isLoading])

  useEffect(() => {
    setShopStatus(shopStatus)
  }, [shopStatus])

  return (
    <>
      {shopStatus === 'published' && <Main endTime={endTime} products={products} />}
      {shopStatus === 'coming' && <ShopComing startTime={startTime} />}
      {shopStatus === 'closed' && <ShopClosed endTime={endTime} />}

      {shopStatus !== 'published' && shopStatus !== 'coming' && shopStatus !== 'closed' && <Main products={products} />}
      {modalProduct && <ProductModal product={modalProduct} />}
    </>
  )
}

export default PowerShopProducts
