import { FC } from 'react'
import { LikeFilled } from '@ant-design/icons'
import { showBuyerCount } from '@/utils'
import { TAjaxProduct } from '@/types'

const index: FC<{ product: TAjaxProduct; selectedVariationId: number | null }> = ({ product, selectedVariationId }) => {
  if (!showBuyerCount) return <></>
  const { type } = product
  const count = product?.total_sales || 0

  if (type === 'simple') {
    const extraBuyerCount = product?.extraBuyerCount || 0
    return (
      <p className="m-0 text-gray-500 text-xs">
        <LikeFilled className="mr-2 text-blue-500" />
        已有 {count + extraBuyerCount} 人購買
      </p>
    )
  }

  if (type === 'variable') {
    if (selectedVariationId) {
      const variation = product?.variations?.find((v) => v.variation_id === selectedVariationId)
      const extraBuyerCount = variation?.extraBuyerCount || 0
      return (
        <p className="m-0 text-gray-500 text-xs">
          <LikeFilled className="mr-2 text-blue-500" />
          已有 {count + extraBuyerCount} 人購買
        </p>
      )
    }
    return <></>
  }

  return <></>
}

export default index
