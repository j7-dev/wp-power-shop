import React from 'react'
import { TFastShopMeta, TProduct } from '@/types'
import { getProductImageSrc, getCurrencyString } from '@/utils'
import { Button } from 'antd'
import useCartModal from './useCartModal'

const Simple: React.FC<{
  product: TProduct
  meta: TFastShopMeta | undefined
}> = ({ product, meta }) => {
  const name = product?.name ?? '未知商品'
  const imageSrc = getProductImageSrc(product)

  const regularPrice = getCurrencyString({
    price: meta?.regularPrice ?? 0,
  })
  const salesPrice = getCurrencyString({
    price: meta?.salesPrice ?? 0,
  })

  const { renderCartModal, showModal } = useCartModal()

  return (
    <div className="relative pb-12">
      <div>
        <img src={imageSrc} className="w-full aspect-square" />
      </div>
      <p className="m-0">{name}</p>
      {!!meta?.salesPrice ? (
        <>
          <p className="m-0">
            <del>{regularPrice}</del>
          </p>
          <p className="m-0 text-red-800">{salesPrice}</p>
        </>
      ) : (
        <p className="m-0">{regularPrice}</p>
      )}
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

export default Simple
