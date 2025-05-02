import { createContext } from 'react'
import { atom } from 'jotai'
import { TTerm } from '@/components/term/types'
import { TTaxonomy } from '@/types/woocommerce'

/** 選中要編輯的 term */
export const selectedTermAtom = atom<TTerm | null>(null)

/** 批量選取 刪除用 */
export const selectedIdsAtom = atom<string[]>([])

/** 當前的 List 是屬於哪個 taxonomy */
export const TaxonomyContext = createContext<TTaxonomy>({
	value: '',
	label: '',
	hierarchical: false,
	publicly_queryable: false,
})
