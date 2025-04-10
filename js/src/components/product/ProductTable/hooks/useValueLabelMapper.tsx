import { useProductsOptions } from '@/hooks'
import {
	PRODUCT_STATUS,
	PRODUCT_DATE_FIELDS,
	BACKORDERS,
	PRODUCT_STOCK_STATUS,
} from 'antd-toolkit/wp'

/** 額外 key-value 映射 */
const extraMapper = {}

const formattedExtraMapper = [
	...Object.entries(extraMapper)?.map(([key, value]) => ({
		value: key,
		label: value,
	})),
	...BACKORDERS,
	...PRODUCT_STOCK_STATUS,
	...PRODUCT_STATUS,
	...PRODUCT_DATE_FIELDS,
]

export const useValueLabelMapper = () => {
	const options = useProductsOptions()
	const { product_cats = [], product_tags = [], product_brands = [] } = options
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
