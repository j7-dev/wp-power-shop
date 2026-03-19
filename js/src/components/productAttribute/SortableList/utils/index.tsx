import { TProductAttribute } from 'antd-toolkit/wp'

/**
 * 將 TProductAttribute[] 轉換成 API 傳送的參數
 * 1. 將 options 轉為 string[]
 *
 * @param {Partial<TProductAttribute>[]} attributes
 * @return {(Omit<Partial<TProductAttribute>, 'options'> & { options: string[] })[]} 轉換後的屬性陣列
 */
export function prepareAttributes(
	attributes: Partial<TProductAttribute>[]
): (Omit<Partial<TProductAttribute>, 'options'> & { options: string[] })[] {
	const new_attributes = attributes.map(prepareAttribute)
	return new_attributes
}

/**
 * 將 TProductAttribute 轉換成 API 傳送的參數
 * 1. 將 options 轉為 string[]
 *
 * @param {TProductAttribute} attribute
 * @return {(Omit<TProductAttribute, 'options'> & { options: string[] })} 轉換後的屬性
 */
export function prepareAttribute(
	attribute: Partial<TProductAttribute>,
	position: number = 0
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
		position,
	}

	return newAttr
}
