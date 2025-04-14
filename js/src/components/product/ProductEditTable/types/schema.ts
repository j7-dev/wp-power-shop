import { z } from 'zod'
import { PRODUCT_STATUS, PRODUCT_CATALOG_VISIBILITIES, PRODUCT_STOCK_STATUS, PRODUCT_TYPES } from 'antd-toolkit/wp'

export const ZYesNo = z.enum(['no', 'yes']);
export const ZBackorders = z.union([ZYesNo, z.literal('notify')]);

export const ZFormValues = z.object({
	id: z.string(),
	type: z.enum(PRODUCT_TYPES.map(type => type.value) as [string, ...string[]]),
	parent_id: z.string(),
  backorders: ZBackorders.optional(),
  catalog_visibility: z.enum(PRODUCT_CATALOG_VISIBILITIES.map(visibility => visibility.value) as [string, ...string[]]),
  featured: ZYesNo.optional(),
  height: z.string().optional(),
  length: z.string().optional(),
  manage_stock: ZYesNo.optional(),
  purchase_note: z.string().optional(),
  regular_price: z.string().optional(),
  reviews_allowed: ZYesNo.optional(),
  sale_date_range: z.tuple([
    z.number().refine(val => val.toString().length === 10, { message: "開始時間必須是10位的時間戳" }),
    z.number().refine(val => val.toString().length === 10, { message: "結束時間必須是10位的時間戳" })
  ]).optional(),
  sale_price: z.string().optional(),
  shipping_class_id: z.string().optional(),
  sku: z.string().optional(),
  sold_individually: ZYesNo.optional(),
  status: z.enum(PRODUCT_STATUS.map(status => status.value) as [string, ...string[]]),
  stock_status: z.enum(PRODUCT_STOCK_STATUS.map(status => status.value) as [string, ...string[]]),
  virtual: ZYesNo.optional(),
  weight: z.string().optional(),
  width: z.string().optional(),

})