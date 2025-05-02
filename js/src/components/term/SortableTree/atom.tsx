import { createContext } from 'react'
import { atom } from 'jotai'
import { TTerm } from '@/components/term/types'
import { TTaxonomy } from '@/types/woocommerce'

/** 單選中要編輯的 term */
export const selectedTermAtom = atom<TTerm | null>(null)

/** 多選批量選取 刪除用 */
export const selectedTermsAtom = atom<TTerm[]>([])

/** 當前的 List 是屬於哪個 taxonomy */
export const TaxonomyContext = createContext<TTaxonomy>({
	value: '',
	label: '',
	hierarchical: false,
	publicly_queryable: false,
})
