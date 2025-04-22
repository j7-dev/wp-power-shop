import { TTerm } from '@/components/term/types'
import { PaginationProps } from 'antd'

export type TParam = {
	id: string
	depth: number
	order: number
	parent?: string
	name?: string
}

/**
 * 將 TTerm[] 轉換成 Create API 傳送的參數
 * 攤平 array
 *
 * @param {TTerm[]} data
 * @param {PaginationProps} paginationProps 分頁參數，用來計算分頁的 order 值
 * @return {TParam[]}
 */
export function toParams(
	data: TTerm[],
	paginationProps: PaginationProps,
): TParam[] {
	const { current = 1, pageSize = 50 } = paginationProps
	return data.map((term, index) => ({
		id: term.id,
		depth: 0,
		order: index + (current - 1) * pageSize,
		parent: term.parent,
		name: term.name,
	}))
}
