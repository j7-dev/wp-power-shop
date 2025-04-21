import { atom } from 'jotai'
import { TTerm } from '@/components/term/types'

/**
 * 選中要編輯的 term
 */
export const selectedTermAtom = atom<TTerm | null>(null)

/**
 * 批量選取
 * 刪除用
 */
export const selectedIdsAtom = atom<string[]>([])
