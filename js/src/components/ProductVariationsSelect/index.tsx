import React, { useState } from 'react'
import { useMany } from '@/hooks'
import { TProduct } from '@/types/wcStoreApi'

type TTerm = {
  id: number
  name: string
  slug: string
}
const ProductVariationsSelect: React.FC<{ product: TProduct }> = ({
  product,
}) => {
  const id = product?.id ?? 0
  const attributes = product?.attributes ?? []
  const [
    selected,
    setSelected,
  ] = useState<(TTerm & { attributeId: number })[]>([])
  const handleClick = (attributeId: number, term: TTerm) => () => {
    const otherSelectedAttribute = selected.filter(
      (item) => item.attributeId !== attributeId,
    )
    const itemToBeAdded = {
      ...term,
      attributeId,
    }
    setSelected([
      ...otherSelectedAttribute,
      itemToBeAdded,
    ])
  }
  console.log('🚀 ~ file: index.tsx:62 ~ selected:', selected)

  return (
    <>
      {attributes.map((attribute) => {
        const terms = attribute?.terms ?? []
        const selectedTerm = selected.find(
          (item) => item.attributeId === attribute?.id,
        ) ?? { slug: '' }
        return (
          <div key={attribute?.id} className="mb-4">
            <p className="mb-0">{attribute?.name}</p>
            <div className="flex">
              {terms.map((term) => (
                <div
                  key={term?.slug}
                  className={`fs-product-attribute-option ${
                    selectedTerm?.slug === term?.slug ? 'active' : ''
                  }`}
                  onClick={handleClick(attribute?.id, term)}
                >
                  <div>{term?.name}</div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </>
  )
}

export default ProductVariationsSelect
