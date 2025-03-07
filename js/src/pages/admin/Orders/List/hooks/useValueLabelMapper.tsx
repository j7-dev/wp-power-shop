import React from 'react'

// import useOptions from '@/components/product/ProductTable/hooks/useOptions'
import {
	backordersOptions,
	stockStatusOptions,
	statusOptions,
	dateRelatedFields,
} from '@/utils'

const extraMapper = {}

const formattedExtraMapper = [
	...Object.entries(extraMapper)?.map(([key, value]) => ({
		value: key,
		label: value,
	})),
	...backordersOptions,
	...stockStatusOptions,
	...statusOptions,
	...dateRelatedFields,
]

const useValueLabelMapper = () => {
	// const { options } = useOptions({ endpoint: 'docs/options' })
	const { product_cats = [], product_tags = [], product_brands = [] } = {}
	const terms = [...product_cats, ...product_tags, ...product_brands]
	const formattedTerms = terms?.map((term) => ({
		value: term?.id?.toString() || '',
		label: term?.name || '',
	}))
	const valueLabelMapper = (value: string) => {
		const label =
			[...formattedTerms, ...formattedExtraMapper]?.find(
				(formattedTerm) => formattedTerm?.value === value,
			)?.label || value
		return label as string
	}

	return { valueLabelMapper }
}

export default useValueLabelMapper
