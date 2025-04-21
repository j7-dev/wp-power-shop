import { useContext, createContext } from 'react'
import { TUserDetails } from '@/components/user/types'

export const RecordContext = createContext<TUserDetails | undefined>(undefined)

export const useRecord = () => {
	const record = useContext(RecordContext)
	return (record || {}) as TUserDetails
}
