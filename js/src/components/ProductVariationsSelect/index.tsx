import React from 'react'
import { useMany } from '@/hooks'
import { TProduct, TProductVariation } from '@/types/wcRestApi'

const ProductVariationsSelect: React.FC<{ product: TProduct }> = ({
  product,
}) => {
  const id = product?.id ?? 0
  const variations = product?.variations ?? []
  const productVariationsResult = useMany({
    resource: `products/${id}/variations`,
    dataProvider: 'wc',
    queryOptions: {
      enabled: variations.length > 0,
    },
  })

  const productVariations: TProductVariation[] =
    productVariationsResult?.data?.data ?? []

  return (
    <>
      {productVariations.map((productVariation) => {
        console.log(
          '🚀 ~ file: index.tsx:26 ~ {productVariations.map ~ productVariation:',
          productVariation,
        )
        const attributes = productVariation?.attributes ?? []
        const attributesLabel = attributes
          .map((attribute) => `${attribute.name}: ${attribute.option}`)
          .join(' ')

        return (
          <p key={productVariation?.id} className="fs-variation">
            {attributesLabel}
          </p>
        )
      })}
    </>
  )
}

export default ProductVariationsSelect
