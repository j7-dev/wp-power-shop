import { atom } from 'jotai'
import { TProductRecord } from '@/components/product/types'

export const selectedProductsAtom = atom<TProductRecord[]>([])
