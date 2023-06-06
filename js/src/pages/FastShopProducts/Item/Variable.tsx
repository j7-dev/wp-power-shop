import React from 'react'
import { TFastShopMeta, TProduct } from '@/types'
import { getProductImageSrc, getCurrencyString } from '@/utils'

const Variable: React.FC<{
  product: TProduct
  meta: TFastShopMeta | undefined
}> = ({ product, meta }) => {
  // console.log('🚀 ~ file: Simple.tsx:9 ~ meta:', meta)

  const name = product?.name ?? '未知商品'
  const imageSrc = getProductImageSrc(product)

  const regularPrice = getCurrencyString({
    price: meta?.regularPrice ?? 0,
  })
  const salesPrice = getCurrencyString({
    price: meta?.salesPrice ?? 0,
  })

  return (
    <div>
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
    </div>
  )
}

export default Variable
