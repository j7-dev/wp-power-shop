/* eslint-disable @typescript-eslint/no-empty-function */
import { FC, useEffect } from 'react'
import { kebab } from '@/utils'
import { Empty, message } from 'antd'
import Countdown from '@/components/Countdown'
import { isProductModalOpenAtom, modalProductIdAtom, showCartAtom } from '@/pages/PowerShopProducts/atom'
import { useSetAtom, useAtom, useAtomValue } from 'jotai'
import ProductModal from '@/pages/PowerShopProducts/ProductModal'
import Cart from '@/pages/PowerShopProducts/Cart'

const Main: FC<{
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  endTime?: number
}> = ({ isLoading, isSuccess, isError, endTime }) => {
  const showCart = useAtomValue(showCartAtom)

  const products = window?.appData?.products_info?.products ?? []

  if (products.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="沒有資料" />
  }

  const setIsProductModalOpen = useSetAtom(isProductModalOpenAtom)
  const [
    modalProductId,
    setModalProductId,
  ] = useAtom(modalProductIdAtom)
  const modalProduct = products.find((p) => p.id === modalProductId)
  console.log('⭐  modalProduct', modalProduct)

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
        const productId = parseInt(el.getAttribute('data-ps-product-id') ?? '0', 10)
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
      {!!endTime && <Countdown toTime={endTime} title="把握最後機會🎉優惠即將到期🎉🎉🎉" />}
      {modalProduct && <ProductModal product={modalProduct} />}
      <div className={showCart ? 'block' : 'hidden'}>
        <Cart />
      </div>
    </div>
  )
}

export default Main
