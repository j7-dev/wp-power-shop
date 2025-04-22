import { TTerm } from '@/components/term/types'

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
 * @return {TParam[]}
 */
export function toParams(data: TTerm[]): TParam[] {
	return data.map((term, index) => ({
		id: term.id,
		depth: 0,
		order: index,
		parent: term.parent,
		name: term.name,
	}))
}
