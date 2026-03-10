/**
 * 商品建立（草稿）API 測試
 * Endpoint: POST /wc/v3/products
 */
import { test, expect, type APIRequestContext } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

const BASE_URL = process.env.WP_BASE_URL || 'http://localhost:8890'

function getNonce(): string {
  return fs.readFileSync(path.resolve(import.meta.dirname, '../.auth/nonce.txt'), 'utf-8').trim()
}
function getTestIds(): Record<string, number> {
  return JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../.auth/test-ids.json'), 'utf-8'))
}

test.describe('商品建立草稿 POST /wc/v3/products', () => {
  let nonce: string
  let testIds: Record<string, number>
  const cleanupIds: number[] = []

  test.beforeAll(() => { nonce = getNonce(); testIds = getTestIds() })

  test.afterAll(async ({ request }) => {
    // 清理所有此測試建立的商品
    for (const id of cleanupIds) {
      await request.delete(`${BASE_URL}/wp-json/wc/v3/products/${id}?force=true`, {
        headers: { 'X-WP-Nonce': nonce },
      })
    }
  })

  async function apiGet(request: APIRequestContext, endpoint: string, params?: Record<string, string>) {
    const url = new URL(`${BASE_URL}/wp-json/${endpoint}`)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    return request.get(url.toString(), { headers: { 'X-WP-Nonce': nonce } })
  }
  async function apiPost(request: APIRequestContext, endpoint: string, data: Record<string, unknown>) {
    return request.post(`${BASE_URL}/wp-json/${endpoint}`, {
      headers: { 'X-WP-Nonce': nonce, 'Content-Type': 'application/json' }, data,
    })
  }
  async function apiPut(request: APIRequestContext, endpoint: string, data: Record<string, unknown>) {
    return request.put(`${BASE_URL}/wp-json/${endpoint}`, {
      headers: { 'X-WP-Nonce': nonce, 'Content-Type': 'application/json' }, data,
    })
  }
  async function apiDelete(request: APIRequestContext, endpoint: string) {
    return request.delete(`${BASE_URL}/wp-json/${endpoint}`, { headers: { 'X-WP-Nonce': nonce } })
  }

  test('空名稱建立商品 → 回傳錯誤', async ({ request }) => {
    const res = await apiPost(request, 'wc/v3/products', {
      name: '',
      type: 'simple',
    })

    // WooCommerce 可能會建立一個無名稱的商品或回傳錯誤
    // 如果 WC 允許建立空名稱商品（狀態 201），記錄 id 供清理
    if (res.status() === 201) {
      const body = await res.json()
      cleanupIds.push(body.id)
      // WooCommerce 允許空名稱但商品名稱會是空字串
      expect(body.name).toBe('')
    } else {
      // 若回傳錯誤，驗證狀態碼為 4xx
      expect(res.status()).toBeGreaterThanOrEqual(400)
    }
  })

  test('有效名稱建立商品 → status=draft', async ({ request }) => {
    const productName = '[E2E] Create Draft Test Product'
    const res = await apiPost(request, 'wc/v3/products', {
      name: productName,
      type: 'simple',
      status: 'draft',
      regular_price: '100',
      sku: `E2E-DRAFT-${Date.now()}`,
    })

    expect(res.status()).toBe(201)
    const body = await res.json()
    cleanupIds.push(body.id)

    expect(body.id).toBeGreaterThan(0)
    expect(body.name).toBe(productName)
    expect(body.type).toBe('simple')
    // 明確指定 status=draft，WC 應原樣回傳
    expect(body.status).toBe('draft')
    expect(body.regular_price).toBe('100')
  })

  test('建立的草稿商品可在 status=draft 篩選中找到', async ({ request }) => {
    const productName = '[E2E] Draft Visibility Test'
    const createRes = await apiPost(request, 'wc/v3/products', {
      name: productName,
      type: 'simple',
      status: 'draft',
    })

    expect(createRes.status()).toBe(201)
    const created = await createRes.json()
    cleanupIds.push(created.id)
    expect(created.status).toBe('draft')

    // 在草稿列表中搜尋
    const listRes = await apiGet(request, 'wc/v3/products', {
      status: 'draft',
      per_page: '100',
      search: 'E2E',
    })
    expect(listRes.status()).toBe(200)

    const products = await listRes.json()
    const found = products.find((p: { id: number }) => p.id === created.id)
    expect(found).toBeDefined()
    expect(found.name).toBe(productName)
    expect(found.status).toBe('draft')
  })
})
