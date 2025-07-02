import * as z from 'zod/v4'
import { PRODUCT_STATUS, PRODUCT_CATALOG_VISIBILITIES, PRODUCT_STOCK_STATUS } from 'antd-toolkit/wp'

export const ZYesNo = z.enum(['no', 'yes']);
export const ZBackorders = z.union([ZYesNo, z.literal('notify')]);

export const ZFormValues = z.object({
	id: z.string(),
	type: z.string().or(z.array(z.string())),
	parent_id: z.string(),

	// Other
  virtual: ZYesNo.optional(),
	downloadable: ZYesNo.optional(),
  featured: ZYesNo.optional(),
  sold_individually: ZYesNo.optional(),
  reviews_allowed: ZYesNo.optional(),

	// Price
	regular_price: z.string().optional(),
  sale_price: z.string().optional(),
  sale_date_range: z.tuple([
    z.number().refine(val => val.toString().length === 10, { message: "開始時間必須是10位的時間戳" }).optional(),
    z.number().refine(val => val.toString().length === 10, { message: "結束時間必須是10位的時間戳" }).optional()
  ]).optional(),
	date_on_sale_from: z.number().optional(),
	date_on_sale_to: z.number().optional(),

	// PurchaseNote
  purchase_note: z.string().optional(),
	_variation_description: z.string().optional(),

	// Size
	sku: z.string().optional(),
	_global_unique_id: z.string().optional(),
  length: z.string().optional(),
	width: z.string().optional(),
	height: z.string().optional(),
  weight: z.string().optional(),
  shipping_class_id: z.string().optional(),

	// Status
	status: z.enum(PRODUCT_STATUS.map(status => status.value) as [string, ...string[]]),
  catalog_visibility: z.enum(PRODUCT_CATALOG_VISIBILITIES.map(visibility => visibility.value) as [string, ...string[]]),

	// Stock
  backorders: ZBackorders.optional(),
  stock_status: z.enum(PRODUCT_STOCK_STATUS.map(status => status.value) as [string, ...string[]]),
  manage_stock: ZYesNo.optional(),
	stock_quantity: z.number().optional().nullable(),
	low_stock_amount: z.string().optional(),

// Taxonomy
	category_ids: z.array(z.string()).optional(),
	tag_ids: z.array(z.string()).optional(),

	//Gallery
	images: z.array(z.object({
		id: z.string(),
		url: z.string(),
	})).optional(),
})