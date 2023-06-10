import React from 'react'
import { TFastShopMeta } from '@/types'
import { TProduct } from '@/types/wcRestApi'
import { getProductImageSrc, renderHTML } from '@/utils'
import { Button } from 'antd'
import useCartModal from './useCartModal'

const Variable: React.FC<{
  product: TProduct
  meta: TFastShopMeta | undefined
}> = ({ product, meta }) => {
  const name = product?.name ?? '未知商品'
  const imageSrc = getProductImageSrc(product)
  const price_html = renderHTML(product?.price_html ?? '')

  const { renderCartModal, showModal } = useCartModal()

  return (
    <div className="relative pb-12">
      <div>
        <img src={imageSrc} className="w-full aspect-square" />
      </div>
      <p className="m-0">{name}</p>
      <p className="m-0">{price_html}</p>
      <Button
        onClick={showModal}
        type="primary"
        className="w-full absolute bottom-0"
      >
        加入購物車
      </Button>
      {renderCartModal({ product, meta })}
    </div>
  )
}

export default Variable
