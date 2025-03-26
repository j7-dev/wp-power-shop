import { TUserBaseRecord } from 'antd-toolkit/wp'
import { TOrderInfo } from '@/pages/admin/Orders/List/types'

/** List 用 */
export type TUserRecord = TUserBaseRecord & {}

/** Edit 用 */
export type TUserDetails = TUserRecord & {
	first_name: string
	last_name: string
	description: string
	shipping: TOrderInfo
	billing: TOrderInfo
	cart: TUserCartItem[]
	recent_orders: {
		order_id: string
		order_date: string
		order_total: number
		order_status: string
		order_items: TUserCartItem[]
	}[]
}

/** 用戶購物車內的 items */
export type TUserCartItem = {
	product_id: string
	product_name: string
	quantity: number
	price: number
	line_total: number
	product_image: string
}
