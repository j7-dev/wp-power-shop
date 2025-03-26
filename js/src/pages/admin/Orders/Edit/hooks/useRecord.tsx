import { useContext, createContext } from 'react'
import { TOrderRecord } from '@/pages/admin/Orders/List/types'

export const RecordContext = createContext<TOrderRecord | undefined>(undefined)

export const useRecord = () => {
	const record = useContext(RecordContext)
	return (record || {}) as TOrderRecord
}
