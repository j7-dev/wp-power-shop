import { createContext, useContext } from 'react'
import { TProductRecord } from '@/components/product/types'

export const RecordContext = createContext<
	| (TProductRecord & {
			isLoading: boolean
			isFetching: boolean
	  })
	| undefined
>(undefined)

/**
 * 取得商品記錄
 * @returns TProductRecord & { isLoading: boolean, isFetching: boolean } | undefined
 */
export const useRecord = ():
	| (TProductRecord & {
			isLoading: boolean
			isFetching: boolean
	  })
	| undefined => {
	const context = useContext(RecordContext)
	return context
}
