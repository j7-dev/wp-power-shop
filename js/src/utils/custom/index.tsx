import { TProduct } from '@/types/wcRestApi'
import { FormInstance } from 'antd'
import { TPSMeta } from '@/types'
import { TAjaxProduct, TStockInfo } from '@/types/custom'

export const formateMeta = (addedProducts: TProduct[]) => {
	const meta = addedProducts.map((product) => ({
		id: product?.id,
		sale_price: product?.sale_price ?? '',
		regular_price: product?.regular_price ?? '',
		type: product?.type ?? '',
	}))
	return meta
}

export const getProductTypeLabel = (type: string) => {
	switch (type) {
		case 'simple':
			return '簡單商品'
		case 'variable':
			return '可變商品'

		default:
			return '未知類型'
	}
}

export const formatShopMeta = async ({ form }: { form: FormInstance<any> }) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			const allFields_obj = form.getFieldsValue()
			const allFields = Object.values(allFields_obj) as TPSMeta[]
			resolve(allFields)
		}, 1000)

		// 時間太短會抓不到可變商品產生的欄位
	})
}

export const getUrlParam = (name: string) => {
	const queryString = window.location.search
	const params = new URLSearchParams(queryString)
	const parameterValue = params.get(name)

	return parameterValue
}

export const getStockQty = (
	product: TAjaxProduct,
	selectedVariationId: number | null,
) => {
	const backorders = product?.backorders ?? 'no'
	if (backorders !== 'no') return Infinity
	const defaultStock: TStockInfo = {
		manageStock: false,
		stockQuantity: null,
		stockStatus: 'instock',
	}

	let stock = defaultStock
	if (!selectedVariationId) {
		stock = product?.stock ?? defaultStock
	} else {
		const variation = product?.variations?.find(
			(v) => v.variation_id === selectedVariationId,
		)
		stock = variation?.stock ?? defaultStock
	}

	const { stockQuantity } = stock

	return stockQuantity ?? Infinity
}

/**
 * 過濾物件的鍵值
 * 例如: 把一個深層物件 value 為 undefined 的 key 過濾掉
 *
 * @param obj
 * @param filterValues
 */
export const filterObjKeys = (
	obj: object,
	filterValues: (string | number | boolean | undefined | null)[] = [undefined],
) => {
	for (const key in obj) {
		if (filterValues.includes(obj[key as keyof typeof obj])) {
			delete obj[key as keyof typeof obj]
		} else if (typeof obj[key as keyof typeof obj] === 'object') {
			filterObjKeys(obj[key as keyof typeof obj]) // 递归处理嵌套对象
			if (Object.keys(obj[key as keyof typeof obj]).length === 0) {
				delete obj[key as keyof typeof obj]
			}
		}
	}

	return obj
}
