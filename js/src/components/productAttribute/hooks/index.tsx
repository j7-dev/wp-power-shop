import { useContext, createContext } from 'react'

/** 選中要編輯的 term */
export const SelectedTermIdContext = createContext<{
	selectedTermId: string | null
	setSelectedTermId: React.Dispatch<React.SetStateAction<string | null>>
}>({
	selectedTermId: null,
	setSelectedTermId: () => {},
})

/** 選中要編輯的 term */
export const useSelectedTermId = () => {
	return useContext(SelectedTermIdContext)
}
