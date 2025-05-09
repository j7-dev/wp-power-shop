import { useList, HttpError } from '@refinedev/core'
import { TTerm } from '@/components/term/types'

/**
 * 依照選擇不同的全局商品規格(Attribute Taxonomy)，取得不同的選項
 *
 * @param {string | undefined} taxonomyName - 全局商品規格(Attribute Taxonomy)的名稱
 * @return {options: {label: string, value: string}[], isLoading: boolean}}
 * */
export const useAttributeTaxonomyOptions = (
	taxonomyName: string | undefined,
) => {
	const { data, isLoading } = useList<TTerm, HttpError>({
		resource: `terms/${taxonomyName}`,
		queryOptions: {
			enabled: !!taxonomyName,
		},
	})

	const terms = data?.data || []
	return {
		options: terms.map((term) => ({
			label: term.name,
			value: term.name,
		})),
		isLoading,
	}
}
