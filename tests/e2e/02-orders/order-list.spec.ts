/**
 * 訂單列表 API 測試
 * Endpoint: GET /wc/v3/orders
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

test.describe('訂單列表 — GET /wc/v3/orders', () => {
  let nonce: string
  let testIds: Record<string, number>

  test.beforeAll(() => {
    nonce = getNonce()
    testIds = getTestIds()
  })

  async function apiGet(request: APIRequestContext, endpoint: string, params?: Record<string, string>) {
    const url = new URL(`${BASE_URL}/wp-json/${endpoint}`)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    return request.get(url.toString(), { headers: { 'X-WP-Nonce': nonce } })
  }

  // ── 無效狀態過濾 ──────────────────────────────────────────────

  for (const badStatus of ['nonexistent', 'foobar', 'xyz-invalid']) {
    test(`無效狀態 "${badStatus}" 回傳 400`, async ({ request }) => {
      const res = await apiGet(request, 'wc/v3/orders', { status: badStatus })
      expect(res.status()).toBe(400)
      const body = await res.json()
      expect(body.code).toContain('invalid')
    })
  }

  // ── per_page 正常查詢 ─────────────────────────────────────────

  test('per_page=10 回傳結果且欄位正確', async ({ request }) => {
    const res = await apiGet(request, 'wc/v3/orders', { per_page: '10' })
    expect(res.status()).toBe(200)

    const orders = await res.json()
    expect(Array.isArray(orders)).toBe(true)
    expect(orders.length).toBeGreaterThanOrEqual(1)

    const order = orders[0]
    expect(order).toHaveProperty('id')
    expect(order).toHaveProperty('number')
    expect(order).toHaveProperty('status')
    expect(order).toHaveProperty('customer_id')
    expect(order).toHaveProperty('total')
    expect(order).toHaveProperty('date_created')
  })

  // ── 分頁 headers ──────────────────────────────────────────────

  test('回應包含分頁 headers（X-WP-Total, X-WP-TotalPages）', async ({ request }) => {
    const res = await apiGet(request, 'wc/v3/orders', { per_page: '1' })
    expect(res.status()).toBe(200)

    const total = res.headers()['x-wp-total']
    const totalPages = res.headers()['x-wp-totalpages']

    expect(total).toBeDefined()
    expect(Number(total)).toBeGreaterThanOrEqual(1)
    expect(totalPages).toBeDefined()
    expect(Number(totalPages)).toBeGreaterThanOrEqual(1)
  })

  // ── 預設排序為日期遞減 ────────────────────────────────────────

  test('預設排序為 date desc', async ({ request }) => {
    const res = await apiGet(request, 'wc/v3/orders', { per_page: '10' })
    expect(res.status()).toBe(200)

    const orders = await res.json()
    if (orders.length >= 2) {
      const dates = orders.map((o: { date_created: string }) => new Date(o.date_created).getTime())
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1])
      }
    }
  })

  // ── 已知訂單可被列出 ──────────────────────────────────────────

  test('Global Setup 建立的訂單出現在列表中', async ({ request }) => {
    const res = await apiGet(request, 'wc/v3/orders', { per_page: '100' })
    expect(res.status()).toBe(200)

    const orders = await res.json()
    const ids = orders.map((o: { id: number }) => o.id)
    expect(ids).toContain(testIds.orderId)
  })
})
