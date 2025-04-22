import { useContext } from 'react'
import { TTerm } from '@/components/term/types'
import { useList, HttpError } from '@refinedev/core'
import { useAtomValue } from 'jotai'
import {
	selectedTermAtom,
	TaxonomyContext,
} from '@/components/term/SortableTree/atom'

/**
 * 取得 taxonomy 的 terms List
 * TODO 分頁
 * 做分頁儲存時，需考慮到 order
 * ex 第二頁的第 0 筆 order 應該加上 pageSize 的值
 * */
export const useTermsList = (taxonomy: string) => {
	const query = useList<TTerm, HttpError>({
		resource: `terms/${taxonomy}`,
		pagination: {
			current: 1,
			pageSize: -1,
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
