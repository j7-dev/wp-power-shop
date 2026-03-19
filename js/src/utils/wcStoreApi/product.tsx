import { isEqual, differenceBy } from 'lodash-es'

import { TProduct, TProductVariationAttribute } from '@/types/wcStoreApi'

/**
 * @deprecated 棄用 wcstore api
 * @param      product
 * @param      attributes
 * @return
 */
export const getVariationIdByAttributes = (
	product: TProduct,
	attributes: TProductVariationAttribute[]
) => {
	const variations = product?.variations ?? []
	const theVariation = variations.find((v) => {
		const theAttributes = v?.attributes ?? []
		const theAttributesWithoutAny = theAttributes.filter(
			(a) => a.value !== null
		)

		// null 代表接受 any 屬性選項

		const allowAnyAttr = theAttributes.filter((a) => a.value === null)
		const filteredAttributes = differenceBy(attributes, allowAnyAttr, 'name')

		return isEqual(theAttributesWithoutAny, filteredAttributes)
	})

	return theVariation?.id ?? null
}
