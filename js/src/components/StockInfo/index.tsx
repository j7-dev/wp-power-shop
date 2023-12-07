import { FC } from 'react'
import { TAjaxProduct, TStockInfo } from '@/types/custom'
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled } from '@ant-design/icons'
import { showStock } from '@/utils'

const defaultStock: TStockInfo = {
  manageStock: false,
  stockQuantity: null,
  stockStatus: 'instock',
}

const SoldOut: FC = () => (
  <>
    <CloseCircleFilled className="mr-2 text-red-500" />
    此商品已售完
  </>
)
const InStock: FC<{ qty?: number; text?: string }> = ({ qty, text = '此商品還有庫存' }) => {
  return (
    <>
      <CheckCircleFilled className="mr-2 text-green-500" />
      {text}
      {qty !== undefined ? ` ${qty} 件` : ''}
    </>
  )
}
const Onbackorder: FC = () => (
  <>
    <ExclamationCircleFilled className="mr-2 text-orange-500" />
    此商品為延期交貨商品
  </>
)

const index: FC<{ product: TAjaxProduct; selectedVariationId: number | null }> = ({ product, selectedVariationId }) => {
  if (!showStock) return <></>

  const stockText = getStockText(product, selectedVariationId)

  return <p className="m-0 text-gray-500 text-xs">{stockText}</p>
}

function getStockText(product: TAjaxProduct, selectedVariationId: number | null) {
  let stock = defaultStock
  if (!selectedVariationId) {
    stock = product?.stock ?? defaultStock
  } else {
    const variation = product?.variations?.find((v) => v.variation_id === selectedVariationId)
    stock = variation?.stock ?? defaultStock
  }

  const { manageStock, stockQuantity, stockStatus } = stock

  switch (stockStatus) {
    case 'instock':
      if (!manageStock) return <InStock />
      if (manageStock && !!stockQuantity) {
        if (stockQuantity <= 10) return <InStock qty={stockQuantity} text="此商品只剩最後" />
        return <InStock qty={stockQuantity} text="此商品剩餘" />
      }
      return <SoldOut />

    case 'outofstock':
      return <SoldOut />
    case 'onbackorder':
      return <Onbackorder />
    default:
      return <InStock />
  }
}

export default index
