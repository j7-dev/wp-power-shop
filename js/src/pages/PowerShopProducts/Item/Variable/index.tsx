import React, { useContext } from 'react'
import { TProduct } from '@/types/wcStoreApi'
import { getProductImageSrc, renderHTML } from '@/utils'
import { Button } from 'antd'
import { ProductsContext } from '@/pages/PowerShopProducts/Main'

const Variable: React.FC<{
  product: TProduct
}> = ({ product }) => {
  const { shop_meta, showFSModal } = useContext(ProductsContext)
  const FSMeta = shop_meta.find((m) => m.productId === product.id)

  const name = renderHTML(product?.name ?? '未知商品')
  const imageSrc = getProductImageSrc(product)
  const price_html = renderHTML(product?.price_html ?? '')

  return (
    <div
      className="relative pb-12 cursor-pointer"
      onClick={showFSModal({ product, FSMeta })}
    >
      <div>
        <img src={imageSrc} className="w-full aspect-square" />
      </div>
      <div className="m-0">{name}</div>
      <div>{price_html}</div>
      <Button
        onClick={showFSModal({ product, FSMeta })}
        type="primary"
        className="w-full absolute bottom-0"
      >
        加入購物車
      </Button>
    </div>
  )
}

export default Variable
