import { createContext, useContext } from 'react'
import { TProductRecord } from '@/components/product/types'

export const RecordContext = createContext<TProductRecord | undefined>(
	undefined,
)

/**
 * 取得商品記錄
 * @returns TProductRecord
 */
export const useRecord = () => {
	const context = useContext(RecordContext)
	return context
}
