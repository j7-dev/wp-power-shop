import { PaginationProps } from 'antd'
import { TProductAttribute } from 'antd-toolkit/wp'

export type TParam = {
	id: string
	depth: number
	order: number
	parent?: string
	name?: string
}

/**
 * 將 TProductAttribute[] 轉換成 Create API 傳送的參數
 * 攤平 array
 *
 * @param {TProductAttribute[]} data
 * @param {PaginationProps} paginationProps 分頁參數，用來計算分頁的 order 值
 * @return {TParam[]}
 */
export function toParams(
	data: TProductAttribute[],
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

/**
 * 將 TProductAttribute[] 轉換成 API 傳送的參數
 * 1. 將 options 轉為 string[]
 *
 * @param {Partial<TProductAttribute>[]} attributes
 * @return {(Omit<Partial<TProductAttribute>, 'options'> & { options: string[] })[]}
 */
export function prepareAttributes(
	attributes: Partial<TProductAttribute>[],
): (Omit<Partial<TProductAttribute>, 'options'> & { options: string[] })[] {
	const new_attributes = attributes.map(prepareAttribute)
	return new_attributes
}

/**
 * 將 TProductAttribute 轉換成 API 傳送的參數
 * 1. 將 options 轉為 string[]
 *
 * @param {TProductAttribute} attribute
 * @return {(Omit<TProductAttribute, 'options'> & { options: string[] })}
 */
export function prepareAttribute(
	attribute: Partial<TProductAttribute>,
): Omit<Partial<TProductAttribute>, 'options'> & { options: string[] } {
	const options = attribute?.options || []
	const newAttr = {
		...attribute,
		options: options.map((o) => {
			if (typeof o === 'string') {
				return o
			}
			return o?.label
		}),
	}

	return newAttr
}
