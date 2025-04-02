import { atom } from 'jotai'
import { TProductRecord } from '@/pages/admin/Product/types'

export const productsAtom = atom<TProductRecord[]>([])
