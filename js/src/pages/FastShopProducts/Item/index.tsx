import React from 'react'
import { TFastShopMeta, TProduct } from '@/types'
import Simple from './Simple'
import Variable from './Variable'

const Item: React.FC<{
  product: TProduct
  meta: TFastShopMeta | undefined
}> = ({ product, meta }) => {
  const type = product?.type ?? ''

  return (
    <>
      {type === 'simple' && <Simple product={product} meta={meta} />}
      {type === 'variable' && <Variable product={product} meta={meta} />}
    </>
  )
}

export default Item
