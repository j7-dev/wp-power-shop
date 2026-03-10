/**
 * 商品列表 API 測試
 * Endpoint: GET /wc/v3/products
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

test.describe('商品列表 GET /wc/v3/products', () => {
  let nonce: string
  let testIds: Record<string, number>
  test.beforeAll(() => { nonce = getNonce(); testIds = getTestIds() })

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

  test('per_page=10 查詢，每筆記錄包含必要欄位', async ({ request }) => {
    const res = await apiGet(request, 'wc/v3/products', { per_page: '10' })
    expect(res.status()).toBe(200)

    const products = await res.json()
    expect(Array.isArray(products)).toBe(true)
    expect(products.length).toBeGreaterThan(0)
    expect(products.length).toBeLessThanOrEqual(10)

    for (const product of products) {
      expect(product).toHaveProperty('id')
      expect(product).toHaveProperty('name')
      expect(product).toHaveProperty('type')
      expect(product).toHaveProperty('status')
      expect(product).toHaveProperty('sku')
      expect(product).toHaveProperty('regular_price')
      expect(product).toHaveProperty('stock_status')
      expect(typeof product.id).toBe('number')
      expect(typeof product.name).toBe('string')
    }
  })

  test('預設排序為日期降序（新建商品 id 降序）', async ({ request }) => {
    const res = await apiGet(request, 'wc/v3/products', { per_page: '10', orderby: 'date', order: 'desc' })
    expect(res.status()).toBe(200)

    const products = await res.json()
    expect(products.length).toBeGreaterThanOrEqual(2)

    // 新建立的商品應該排在前面，id 遞減
    for (let i = 0; i < products.length - 1; i++) {
      expect(products[i].id).toBeGreaterThan(products[i + 1].id)
    }
  })

  test('status=draft 篩選只回傳草稿商品', async ({ request }) => {
    // 建立一個草稿商品
    const createRes = await apiPost(request, 'wc/v3/products', {
      name: '[E2E] Draft Product List Test',
      status: 'draft',
      type: 'simple',
    })
    expect(createRes.status()).toBe(201)
    const created = await createRes.json()

    try {
      const res = await apiGet(request, 'wc/v3/products', { status: 'draft', per_page: '100' })
      expect(res.status()).toBe(200)

      const products = await res.json()
      expect(products.length).toBeGreaterThan(0)

      for (const product of products) {
        expect(product.status).toBe('draft')
      }

      // 確認我們建立的草稿商品在列表中
      const found = products.find((p: { id: number }) => p.id === created.id)
      expect(found).toBeDefined()
    } finally {
      await apiDelete(request, `wc/v3/products/${created.id}?force=true`)
    }
  })

  test('type=simple 篩選只回傳簡單商品', async ({ request }) => {
    const res = await apiGet(request, 'wc/v3/products', { type: 'simple', per_page: '100' })
    expect(res.status()).toBe(200)

    const products = await res.json()
    expect(products.length).toBeGreaterThan(0)

    for (const product of products) {
      expect(product.type).toBe('simple')
    }
  })

  test('回應包含分頁 header: X-WP-Total 與 X-WP-TotalPages', async ({ request }) => {
    const res = await apiGet(request, 'wc/v3/products', { per_page: '1' })
    expect(res.status()).toBe(200)

    const total = res.headers()['x-wp-total']
    const totalPages = res.headers()['x-wp-totalpages']

    expect(total).toBeDefined()
    expect(totalPages).toBeDefined()
    expect(Number(total)).toBeGreaterThan(0)
    expect(Number(totalPages)).toBeGreaterThan(0)
    // 每頁 1 筆時，總頁數應等於總數
    expect(Number(totalPages)).toBe(Number(total))
  })
})
