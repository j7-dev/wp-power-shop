import { TUserBaseRecord } from 'antd-toolkit/wp'
import { TOrderInfo, TOrderNote } from '@/pages/admin/Orders/List/types'

/** List 用 */
export type TUserRecord = TUserBaseRecord & {}

/** Edit 用 */
export type TUserDetails = TUserRecord & {
	first_name: string
	last_name: string
	description: string
	cart: TUserCartItem[]
	recent_orders: {
		order_id: string
		order_date: string
		order_total: number
		order_status: string
		order_items: TUserCartItem[]
	}[]
	shipping: TOrderInfo
	billing: TOrderInfo
	contact_remarks: TUserContactRemark[]
	other_meta_data: {
		[key: string]: any
	}[]
}

export type TUserContactRemark = Omit<TOrderNote, 'order_id'> & {
	user_id: string
	commented_user_id: string // 被留言的用戶 id
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
