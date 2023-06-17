import { atom } from 'jotai'
import { TProduct } from '@/types/wcRestApi'
import { TFastShopMeta } from '@/types'

export const addedProductsAtom = atom<TProduct[]>([])
export const fastShopMetaAtom = atom<TFastShopMeta[]>([])
