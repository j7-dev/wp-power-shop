import { TProductBaseRecord, TProductType } from 'antd-toolkit/wp'

export type TProductRecord = TProductBaseRecord & {
}
export type TProductVariation = TProductRecord & {
	type: Extract<TProductType, 'variation' | 'subscription_variation'>
}
