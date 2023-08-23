import { atom } from 'jotai'
import { TProduct } from '@/types/wcStoreApi'
import { TFSMeta } from '@/types'

export const storeApiNonceAtom = atom<string>('')
export const productsAtom = atom<TProduct[]>([])
export const shopMetaAtom = atom<TFSMeta[]>([])
export const isProductModalOpenAtom = atom<boolean>(false)
export const modalProductIdAtom = atom<number>(0)
export const showCartAtom = atom<boolean>(false)
export const selectedVariationIdAtom = atom<number | null>(null)
