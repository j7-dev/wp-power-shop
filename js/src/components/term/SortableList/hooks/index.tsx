import { useContext } from 'react'
import { useAtomValue } from 'jotai'
import {
	selectedTermAtom,
	TaxonomyContext,
} from '@/components/term/SortableList/atom'

/** 選中要編輯的 term */
export const useSelectedTerm = () => {
	return useAtomValue(selectedTermAtom)
}

/** 當前的 List 是屬於哪個 taxonomy */
export const useTaxonomy = () => {
	return useContext(TaxonomyContext)
}
