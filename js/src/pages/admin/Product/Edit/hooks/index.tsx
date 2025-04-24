import { createContext, useContext } from 'react'
import { TProductRecord } from '@/components/product/types'

export const RecordContext = createContext<TProductRecord | undefined>(
	undefined,
)

export const useProductEditContext = () => {
	const context = useContext(RecordContext)
	return context
}
