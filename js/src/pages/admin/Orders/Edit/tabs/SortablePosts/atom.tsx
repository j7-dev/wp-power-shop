import { atom } from 'jotai'
import { TOrderRecord } from '@/pages/admin/Orders/List/types'

/**
 * 選中的文章
 */
export const selectedPostAtom = atom<TOrderRecord | null>(null)

/**
 * 批次選取
 * 刪除用
 */
export const selectedIdsAtom = atom<string[]>([])
