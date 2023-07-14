import { atom } from 'jotai'
import {
  TOrderData,
  defaultOrderData,
  TPagination,
  defaultPagination,
} from './types'

export const orderDataAtom = atom<TOrderData>(defaultOrderData)
export const paginationAtom = atom<TPagination>(defaultPagination)
