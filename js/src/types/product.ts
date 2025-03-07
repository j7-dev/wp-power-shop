import { TProductBaseRecord, TProductType, TBoundItemData } from 'antd-toolkit/wp'
import { TGrantedItemBase  } from 'antd-toolkit/refine'

export type TProductRecord = TProductBaseRecord & {
	bound_docs_data?: TBoundDocData[]
}
export type TProductVariation = TProductRecord & {
	type: Extract<TProductType, 'variation' | 'subscription_variation'>
}

/**
 * 將知識庫觀看權限資料，要綁定在商品上的
 */
export type TBoundDocData = TBoundItemData

export type TGrantedDoc = TGrantedItemBase
