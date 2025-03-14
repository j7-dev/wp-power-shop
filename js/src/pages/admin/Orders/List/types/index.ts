

export type TOrderCustomer = {
	id: string
	ip_address: string
	user_login: string
	user_email: string
	display_name: string
	user_registered: string
	user_registered_human: string
	user_avatar_url: string
	description: string
	roles: string[]
	date_last_active: string
	date_last_order: string
	orders_count: number
	total_spend: number
	avg_order_value: number
}

export type TOrderNote = {
	id: number,
	date_created: string,
	content: string,
	customer_note: boolean,
	added_by: string,
	order_id: number
}

export type TOrderInfo = {
	first_name: string,
	last_name: string,
	email: string,
	phone: string,
	company: string
	postcode: string,
	country: string,
	state: string,
	city: string,
	address_1: string,
	address_2: string,
}


// List 只會拿基本的欄位
export type TOrderBaseRecord = {
	id: string
	order_number: string
	customer: TOrderCustomer,
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
		formatted_order_total:string
		payment_method_title:string
		payment_complete:boolean
		date_paid:string
		created_via: string
		edit_order_url:string
		shipping_total:number
		shipping_method:string
		subtotal:number
		total_discount:number
		total_fees:number
		total_tax:number
		total: number
		order_notes:TOrderNote[]
		billing:TOrderInfo
		shipping:TOrderInfo
	}





// Edit, Show, Create 會拿全部的欄位
export type TOrderRecord = TOrderBaseRecord & {
}
