import { TProductRecord } from '@/components/product/types'
import { Dayjs } from 'dayjs'
import { isVariable } from 'antd-toolkit/wp'
import { ZFormValues, TFormValues } from '@/components/product/ProductEditTable/types'
import { produce } from 'immer'
import { isVariation, TImage } from 'antd-toolkit/wp'

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

export function productsToFields(products: TProductRecord[], context?: 'submit') {
	// 組成表單資料
	const fieldsData = products.reduce((acc, product) => {
		// date_on_sale_from, date_on_sale_to 要轉換為 sale_date_range 欄位
		// @ts-ignore
		acc[product.id] = productToFields(product, context)
		if (isVariable(product.type as string)) {
			const variations = product.children || []
			variations.forEach((variation) => {
				// @ts-ignore
				acc[variation.id] = productToFields(variation, context)
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
export function productToFields(product: TProductRecord, context?: 'submit') {
	const allowFields = ZFormValues.keyof().options
	// 只保留 product 中的 allowFields 欄位，重組一個物件出來
	const formattedProduct = Object.keys(product).reduce(
		(acc, key) => {
			// @ts-ignore
			if (allowFields.includes(key)) {
				if('shipping_class_id' === key){
					acc[key] = product[key as keyof typeof product] || '0'
					return acc
				}

				if('images' === key && 'submit' === context){
					const images = product[key as keyof typeof product] || []
					const [image, ...gallery_images] = images as TImage[]
					acc['image_id'] = image ? image?.id : '0'
					acc['gallery_image_ids'] = gallery_images?.length
					? gallery_images?.map(({ id }) => id)
					: '[]'
					return acc
				}
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


export const handleValuesChange = (
	changedValues: Partial<TFormValues>[],
	allValues: TFormValues[],
	syncModeEnabled: boolean,
	virtualFields: TProductRecord[],
	setVirtualFields: React.Dispatch<React.SetStateAction<TProductRecord[]>>,
	context?: 'detail',
) => {
	try {
		const changedProductId = Object.keys(changedValues)[0]
		//@ts-ignore
		const changedProductType = allValues?.[changedProductId]?.type

		// @ts-ignore
		const changedObj = changedValues?.[changedProductId]
		const changedKey = Object.keys(changedObj)[0]
		const changedValue = changedObj?.[changedKey]

		const changedFields = produce(virtualFields, (draft) => {
			if (syncModeEnabled) {
				draft.forEach((product, index) => {
					// 如果是改狀態
					if ('status' === changedKey) {
						// 且不是改變體，就只改非變體商品的狀態
						if (!isVariation(changedProductType)) {
							// @ts-ignore
							product[changedKey] = changedValue
							return
						}

						// 是變體，則只改變體商品的狀態
						if (isVariation(changedProductType)) {
							if (product?.children?.length) {
								product?.children?.forEach((variation, index) => {
									// @ts-ignore
									product.children[index][changedKey] = changedValue
								})
							}
							return
						}
					}

					// 狀態以外就都可以改
					// 如果修改狀態以外，則需要同步更新所有商品
					mutateProduct({
						changedKey,
						changedValue,
						product,
					})

					// 如果是可變商品，則需要同步更新所有變體
					if (product?.children?.length) {
						product?.children?.forEach((variation) => {
							mutateProduct({
								changedKey,
								changedValue,
								product: variation,
							})
						})
					}
				})
			}

			if (!syncModeEnabled) {
				if (!isVariation(changedProductType) || 'detail' === context) {
					// 非變體，直接找到 row 位置修改就好
					const findRowIndex = virtualFields.findIndex(
						(product) => product.id === changedProductId,
					)

					mutateProduct({
						changedKey,
						changedValue,
						product: draft?.[findRowIndex],
					})

					return
				}

				// 如果是變體
				// 是變體，要找到可變商品裡面 children 的 變體位置
				// 先從 allValues 中找到變體，再拿出 parent_id 找到所屬的可變商品
				// @ts-ignore
				const parentId = allValues?.[changedProductId]?.parent_id
				const findRowIndex = virtualFields.findIndex(
					(product) => product.id === parentId,
				)

				// 如果找到上層可變商品
				if (findRowIndex > 0) {
					const findVariationIndex =
						draft[findRowIndex]?.children?.findIndex(
							(variation) => variation.id === changedProductId,
						) || 0

					mutateProduct({
						changedKey,
						changedValue,
						product: draft?.[findRowIndex]?.children?.[findVariationIndex],
					})
					return
				}
			}
		})
		setVirtualFields(changedFields)
	} catch (error) {
		console.error('更新失敗，immer 賦值 draft 失敗')
		console.error(error)
	}
}