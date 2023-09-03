import { atom } from 'jotai'
import { TFSMeta } from '@/types'
import { TProductVariationAttribute } from '@/types/wcStoreApi'

export const storeApiNonceAtom = atom<string>('')
export const shopMetaAtom = atom<TFSMeta[]>([])
export const isProductModalOpenAtom = atom<boolean>(false)
export const modalProductIdAtom = atom<number>(0)
export const showCartAtom = atom<boolean>(false)
export const selectedVariationIdAtom = atom<number | null>(null)
export const selectedAttributesAtom = atom<TProductVariationAttribute[]>([])
