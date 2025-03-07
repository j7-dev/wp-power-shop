

// List 只會拿基本的欄位
export type TOrderBaseRecord = {
	id: number
	order_number: string
	customer: {
		id: string
		user_login: string
		user_email: string
		display_name: string
		user_registered: string
		user_registered_human: string
		user_avatar_url: string
		description: string
		roles: string[]
		ip_address: string
    },
	items :{
			id: number
			order_id: number
			name: string
			product_id: number
			variation_id: number
			quantity: number
			tax_class: string
			subtotal: string
			subtotal_tax: string
			total: string
			total_tax: string
			taxes: {
				total: string[]
				subtotal: string[]
			}
			meta_data: {
				id: number
				key: string
				value: string
			}[]
		}[],
		date_created: string
		date_modified: string
		status: string
		total: string
		total_discount: number
		payment_method_title: string
		payment_complete: boolean
		created_via: string
	}

// Edit, Show, Create 會拿全部的欄位
export type TOrderRecord = TOrderBaseRecord & {

}
