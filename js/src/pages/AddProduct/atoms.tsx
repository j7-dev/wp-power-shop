import { atom } from 'jotai'
import { TProduct } from '@/types'

export const addedProductsAtom = atom<TProduct[]>([])
