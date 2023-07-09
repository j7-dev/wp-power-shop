import { atom } from 'jotai'
import { TOrderData, defaultOrderData } from './types'

export const orderDataAtom = atom<TOrderData>(defaultOrderData)
