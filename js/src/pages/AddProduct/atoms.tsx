import { atom } from 'jotai'
import { TProduct } from '@/types/wcRestApi'
import { TFSMeta } from '@/types'

export const addedProductsAtom = atom<TProduct[]>([])
export const FSMetaAtom = atom<TFSMeta[]>([])
export const isChangeAtom = atom<boolean>(false)
