import { useContext } from 'react'
import { IsEditingContext } from '../index'

export const useIsEditing = () => {
	const isEditing = useContext(IsEditingContext)
	return isEditing
}
