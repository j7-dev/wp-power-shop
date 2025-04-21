import { TTerm } from '@/components/term/types'
import { useList, HttpError } from '@refinedev/core'
import { useAtomValue } from 'jotai'
import { selectedTermAtom } from '../atom'
import { objToCrudFilters } from 'antd-toolkit/refine'

export const useTermsList = (taxonomy: string) => {
	const query = useList<TTerm, HttpError>({
		resource: 'terms',
		filters: objToCrudFilters({
			taxonomy,
		}),
		pagination: {
			current: 1,
			pageSize: -1,
		},
	})

	return query
}

export const useSelectedTerm = () => {
	return useAtomValue(selectedTermAtom)
}
