import { useState, useEffect } from 'react'
import { PaginationProps } from 'antd'
import { TTaxonomy } from '@/types/woocommerce'
import { TTerm } from '@/components/term/types'
import { useList, HttpError } from '@refinedev/core'

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
			`共有 ${total} 個 ${taxonomy.label}`,
	})
	const query = useList<TTerm, HttpError>({
		resource: `terms/${taxonomy.value}`,
		pagination: {
			current: paginationProps.current,
			pageSize: paginationProps.pageSize,
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
