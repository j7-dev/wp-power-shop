import { useState, useEffect, useContext, createContext } from 'react'
import { useList, HttpError } from '@refinedev/core'
import { PaginationProps } from 'antd'
import { TTaxonomy } from '@/types/woocommerce'
import { TTerm, TSortableTreeListProps } from '@/components/term/types'
import { EditForm } from '@/components/term'

/**
 * 取得 taxonomy 的 terms List
 * */
export const useTermsList = (taxonomy: TTaxonomy) => {
	const [paginationProps, setPaginationProps] = useState<PaginationProps>({
		current: 1,
		pageSize: 20,
		total: 0,
		className: 'mt-4',
		align: 'center',
		size: 'small',
		hideOnSinglePage: false,
		showSizeChanger: true,
		showTotal: (total: number, range: [number, number]) =>
			`共有 ${total} 個 ${taxonomy?.label}`,
	})
	const query = useList<TTerm, HttpError>({
		resource: `terms/${taxonomy?.value}`,
		pagination: {
			current: paginationProps.current,
			pageSize: paginationProps.pageSize,
		},
		queryOptions: {
			enabled: !!taxonomy?.value,
		},
	})

	const { data, isLoading } = query

	useEffect(() => {
		if (!isLoading) {
			setPaginationProps((prev) => ({
				...prev,
				total: data?.total,
				current: data?.currentPage,
			}))
		}
	}, [isLoading])

	return {
		...query,
		paginationProps,
		setPaginationProps,
	}
}

/** 當前的 List 是屬於哪個 taxonomy */
export const TaxonomyContext = createContext<TTaxonomy>({
	value: '',
	label: '',
	hierarchical: false,
	publicly_queryable: false,
})

/** 選中要編輯的 term */
export const SelectedTermIdContext = createContext<{
	selectedTermId: string | null
	setSelectedTermId: React.Dispatch<React.SetStateAction<string | null>>
}>({
	selectedTermId: null,
	setSelectedTermId: () => {},
})

/** 複選選中的 terms */
export const SelectedTermIdsContext = createContext<{
	selectedTermIds: string[]
	setSelectedTermIds: React.Dispatch<React.SetStateAction<string[]>>
}>({
	selectedTermIds: [],
	setSelectedTermIds: () => {},
})

/** 選中要編輯的 term */
export const useSelectedTermId = () => {
	return useContext(SelectedTermIdContext)
}

/** 複選選中的 terms */
export const useSelectedTermIds = () => {
	return useContext(SelectedTermIdsContext)
}

/** 當前的 List 是屬於哪個 taxonomy */
export const useTaxonomy = () => {
	return useContext(TaxonomyContext)
}

/** 可排序樹的 TSortableTreeProps */
export const useSortableTreeList = (): Omit<
	TSortableTreeListProps,
	'taxonomy'
> => {
	const [selectedTermIds, setSelectedTermIds] = useState<string[]>([])
	const [selectedTermId, setSelectedTermId] = useState<string | null>(null)
	return {
		selectedTermIds,
		setSelectedTermIds,
		selectedTermId,
		setSelectedTermId,
		Edit: EditForm,
	}
}
