import { atom } from 'jotai'
import { TProduct } from '@/types/wcRestApi'
import { TPSMeta } from '@/types'

export const addedProductsAtom = atom<TProduct[]>([])
export const PSMetaAtom = atom<TPSMeta[]>([])
export const isChangeAtom = atom<boolean>(false)
