import { TProductRecord } from '@/components/product/types'
import { Dayjs } from 'dayjs'
import { isVariable } from 'antd-toolkit/wp'
import { ZFormValues } from '@/components/product/ProductEditTable/types'

/**
 * 修改產品資料的函數
 *
 * 根據提供的變更鍵和值來更新產品物件。
 * 特別處理促銷日期範圍，將其轉換為 Unix 時間戳記。
 *
 * @param {Object} params - 函數參數
 * @param {string} params.changedKey - 要修改的產品屬性鍵名
 * @param {any} params.changedValue - 新的屬性值
 * @param {TProductRecord | undefined} params.product - 要修改的產品物件
 * @throws {Error} 當產品物件未定義時拋出錯誤
 */
export function mutateProduct({
	changedKey,
	changedValue,
	product,
}: {
	changedKey: string
	changedValue: any
	product: TProductRecord | undefined
}) {
	if (!product) {
		throw new Error('product 未定義')
	}
	//  sale_date_range 要單獨處理轉換為 date_on_sale_from & date_on_sale_to
	if (changedKey === 'sale_date_range') {

		product.date_on_sale_from = changedValue
			? (changedValue[0] as Dayjs).unix()
			: undefined
		product.date_on_sale_to = changedValue
			? (changedValue[1] as Dayjs).unix()
			: undefined
	} else {
		// @ts-ignore
		product[changedKey] = changedValue
	}
}

export function productsToFields(products: TProductRecord[]) {
	// 組成表單資料
	const fieldsData = products.reduce((acc, product) => {
		// date_on_sale_from, date_on_sale_to 要轉換為 sale_date_range 欄位
		// @ts-ignore
		acc[product.id] = productToFields(product)
		if (isVariable(product.type as string)) {
			const variations = product.children || []
			variations.forEach((variation) => {
				// @ts-ignore
				acc[variation.id] = productToFields(variation)
			})
		}
		return acc
	}, {})

	return fieldsData
}

/**
 * 將單一產品資料轉換為表單欄位資料
 *
 * @param {TProductRecord[]} products - 產品資料陣列
 * @returns {Record<string, any>} 轉換後的表單欄位資料，以產品ID為鍵
 * @description 將產品資料轉換為表單欄位資料，包含變體產品的子產品
 */
export function productToFields(product: TProductRecord) {
	const allowFields = ZFormValues.keyof().options
	// 只保留 product 中的 allowFields 欄位，重組一個物件出來
	const formattedProduct = Object.keys(product).reduce(
		(acc, key) => {
			// @ts-ignore
			if (allowFields.includes(key)) {
				acc[key] = product[key as keyof typeof product]
			}
			return acc
		},
		{} as Record<string, any>,
	)

	formattedProduct.sale_date_range = [
		product.date_on_sale_from || undefined,
		product.date_on_sale_to || undefined,
	]
	return formattedProduct
}