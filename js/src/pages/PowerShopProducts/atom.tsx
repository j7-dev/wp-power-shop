import { atom } from 'jotai'
import { TFSMeta, TFormattedProduct } from '@/types'

export const storeApiNonceAtom = atom<string>('')
export const productsAtom = atom<TFormattedProduct[]>([])
export const shopMetaAtom = atom<TFSMeta[]>([])
export const isProductModalOpenAtom = atom<boolean>(false)
export const modalProductIdAtom = atom<number>(0)
export const showCartAtom = atom<boolean>(false)
export const selectedVariationIdAtom = atom<number | null>(null)
