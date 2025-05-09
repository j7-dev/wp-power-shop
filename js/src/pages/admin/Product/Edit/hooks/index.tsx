import { createContext, useContext } from 'react'
import { TProductRecord } from '@/components/product/types'

export const RecordContext = createContext<TProductRecord | undefined>(
	undefined,
)

/**
 * 取得商品記錄
 * @returns TProductRecord | undefined
 */
export const useRecord = (): TProductRecord | undefined => {
	const context = useContext(RecordContext)
	return context
}
