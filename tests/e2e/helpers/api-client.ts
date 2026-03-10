/**
 * REST API Client — 封裝 WordPress / WooCommerce / Power Shop API 操作
 */
import type { APIRequestContext } from '@playwright/test'

export type ApiOptions = {
  request: APIRequestContext
  baseURL: string
  nonce: string
}

const headers = (nonce: string) => ({
  'X-WP-Nonce': nonce,
  'Content-Type': 'application/json',
})

export async function wpGet<T = unknown>(
  opts: ApiOptions,
  endpoint: string,
  params?: Record<string, string>,
): Promise<{ data: T; status: number; headers: Record<string, string> }> {
  const url = new URL(`${opts.baseURL}/wp-json/${endpoint}`)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await opts.request.get(url.toString(), { headers: headers(opts.nonce) })
  const data = res.status() < 300 ? await res.json() : await res.json().catch(() => ({}))
  return {
    data: data as T,
    status: res.status(),
    headers: Object.fromEntries(res.headersArray().map(h => [h.name.toLowerCase(), h.value])),
  }
}

export async function wpPost<T = unknown>(
  opts: ApiOptions,
  endpoint: string,
  data: Record<string, unknown>,
): Promise<{ data: T; status: number }> {
  const res = await opts.request.post(`${opts.baseURL}/wp-json/${endpoint}`, {
    headers: headers(opts.nonce),
    data,
  })
  const body = await res.json().catch(() => ({}))
  return { data: body as T, status: res.status() }
}

export async function wpPut<T = unknown>(
  opts: ApiOptions,
  endpoint: string,
  data: Record<string, unknown>,
): Promise<{ data: T; status: number }> {
  const res = await opts.request.put(`${opts.baseURL}/wp-json/${endpoint}`, {
    headers: headers(opts.nonce),
    data,
  })
  const body = await res.json().catch(() => ({}))
  return { data: body as T, status: res.status() }
}

export async function wpDelete<T = unknown>(
  opts: ApiOptions,
  endpoint: string,
): Promise<{ data: T; status: number }> {
  const res = await opts.request.delete(`${opts.baseURL}/wp-json/${endpoint}`, {
    headers: headers(opts.nonce),
  })
  const body = await res.json().catch(() => ({}))
  return { data: body as T, status: res.status() }
}

/**
 * 從 WP admin 頁面提取 REST nonce
 */
export async function extractNonce(page: import('@playwright/test').Page, baseURL: string): Promise<string> {
  await page.goto(`${baseURL}/wp-admin/`)
  await page.waitForLoadState('domcontentloaded')
  const nonce = await page.evaluate(() => (window as any).wpApiSettings?.nonce ?? '')
  if (!nonce) {
    throw new Error('無法提取 WP REST nonce，請確認管理員已登入')
  }
  return nonce
}
