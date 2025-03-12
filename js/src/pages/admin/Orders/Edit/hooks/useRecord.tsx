import { useContext } from 'react'
import { RecordContext } from '../index'
import { TOrderRecord } from '@/pages/admin/Orders/List/types'

export const useRecord = () => {
	const record = useContext(RecordContext)
	return (record || {}) as TOrderRecord
}
