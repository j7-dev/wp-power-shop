import { atom } from 'jotai'
import {
  TOrderData,
  defaultOrderData,
  TPagination,
  defaultPagination,
  TFilter,
  defaultFilter,
} from './types'

export const orderDataAtom = atom<TOrderData>(defaultOrderData)
export const paginationAtom = atom<TPagination>(defaultPagination)
export const filterAtom = atom<TFilter>(defaultFilter)
