import React, { useState } from 'react'
import {
  TProduct,
  TProductAttribute,
  TProductVariationAttribute,
  TProductAttributeTerm,
} from '@/types/wcStoreApi'
import { useSetAtom } from 'jotai'
import { selectedVariationIdAtom } from '@/pages/FastShopProducts/Item/Variable/atoms'
import { getVariationIdByAttributes } from '@/utils/wcStoreApi'
import { sortBy } from 'lodash-es'
import { nanoid } from 'nanoid'

const ProductVariationsSelect: React.FC<{ product: TProduct }> = ({
  product,
}) => {
  const setSelectedVariationId = useSetAtom(selectedVariationIdAtom)

  const attributes = product?.attributes ?? []

  const [
    selected,
    setSelected,
  ] = useState<TProductVariationAttribute[]>([])

  const handleClick =
    (attribute: TProductAttribute, term: TProductAttributeTerm) => () => {
      const order = attributes.map((a) => a.name)
      const attributeName = attribute?.name ?? ''
      const otherSelectedAttribute = selected.filter(
        (item) => item.name !== attributeName,
      )
      const itemToBeAdded = {
        name: attributeName,
        value: term?.slug ?? '',
      }
      const newSelected = [
        ...otherSelectedAttribute,
        itemToBeAdded,
      ]
      const sortedNewSelected = sortBy(newSelected, (item) => {
        const index = order.indexOf(item.name)
        return index !== -1 ? index : Infinity
      })

      setSelected(sortedNewSelected)
      const variationId = getVariationIdByAttributes(product, sortedNewSelected)
      setSelectedVariationId(variationId)
    }

  return (
    <>
      {attributes.map((attribute) => {
        const terms = attribute?.terms ?? []
        const selectedTerm = selected.find(
          (item) => item.name === attribute?.name,
        ) ?? { name: '', value: '' }
        return (
          <div key={nanoid()} className="mb-4">
            <p className="mb-0">{attribute?.name}</p>
            <div className="flex flex-wrap">
              {terms.map((term) => (
                <div
                  key={term?.slug}
                  className={`fs-product-attribute-option ${
                    selectedTerm?.value === term?.slug ? 'active' : ''
                  }`}
                  onClick={handleClick(attribute, term)}
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
