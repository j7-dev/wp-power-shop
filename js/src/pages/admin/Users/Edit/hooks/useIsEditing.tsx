import { useContext, createContext } from 'react'

export const IsEditingContext = createContext<boolean>(false)

export const useIsEditing = () => {
	const isEditing = useContext(IsEditingContext)
	return isEditing
}
