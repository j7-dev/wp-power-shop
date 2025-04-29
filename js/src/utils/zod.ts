import { ZodType } from 'zod'

/**
 * 安全解析 Zod 的 Schema
 * 如果解析錯誤就印出錯誤
 * @param scheme - Zod 的 Schema
 * @param data - 要解析的資料
 * @returns 解析後的資料
 */
export const safeParse = (scheme: ZodType, data: any) => {
	const { success, error } = scheme.safeParse(data)
	if (!success) {
		console.warn(error?.issues)
	}
}
