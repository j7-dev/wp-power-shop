import { atom } from 'jotai'
import { TProduct } from '@/types/wcRestApi'

export const addedProductsAtom = atom<TProduct[]>([])
