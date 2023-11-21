import { atom } from 'jotai'
import { TPSMeta } from '@/types'
import { TProductVariationAttribute } from '@/types/wcStoreApi'

export const storeApiNonceAtom = atom<string>('')
export const shopMetaAtom = atom<TPSMeta[]>([])
export const isProductModalOpenAtom = atom<boolean>(false)
export const modalProductIdAtom = atom<number>(0)
export const selectedVariationIdAtom = atom<number | null>(null)
export const selectedAttributesAtom = atom<TProductVariationAttribute[]>([])

type TShopStatus = 'published' | 'coming' | 'closed'
export const shopStatusAtom = atom<TShopStatus>('published')
