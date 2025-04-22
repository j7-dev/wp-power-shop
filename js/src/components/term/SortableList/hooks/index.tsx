import { useContext } from 'react'
import { TTerm } from '@/components/term/types'
import { useList, HttpError } from '@refinedev/core'
import { useAtomValue } from 'jotai'
import {
	selectedTermAtom,
	TaxonomyContext,
} from '@/components/term/SortableList/atom'

/** 取得 taxonomy 的 terms List */
export const useTermsList = (taxonomy: string) => {
	const query = useList<TTerm, HttpError>({
		resource: `terms/${taxonomy}`,
		pagination: {
			current: 1,
			pageSize: 50,
		},
	})

	return query
}

/** 選中要編輯的 term */
export const useSelectedTerm = () => {
	return useAtomValue(selectedTermAtom)
}

/** 當前的 List 是屬於哪個 taxonomy */
export const useTaxonomy = () => {
	return useContext(TaxonomyContext)
}
