import { atom } from 'jotai'
import { TDocRecord } from '@/pages/admin/Docs/List/types'

/**
 * 選中的文章
 */
export const selectedPostAtom = atom<TDocRecord | null>(null)

/**
 * 批量選取
 * 刪除用
 */
export const selectedIdsAtom = atom<string[]>([])
