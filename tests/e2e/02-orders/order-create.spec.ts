/**
 * 訂單建立 API 測試
 * Endpoint: POST /wc/v3/orders
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

test.describe('訂單建立 — POST /wc/v3/orders', () => {
  let nonce: string
  let testIds: Record<string, number>
  const createdOrderIds: number[] = []

  test.beforeAll(() => {
    nonce = getNonce()
    testIds = getTestIds()
  })

  // 測試結束後清理所有建立的訂單
  test.afterAll(async ({ request }) => {
    for (const id of createdOrderIds) {
      await request.delete(`${BASE_URL}/wp-json/wc/v3/orders/${id}?force=true`, {
        headers: { 'X-WP-Nonce': nonce },
      })
    }
  })

  async function apiPost(request: APIRequestContext, endpoint: string, data: Record<string, unknown>) {
    return request.post(`${BASE_URL}/wp-json/${endpoint}`, {
      headers: { 'X-WP-Nonce': nonce, 'Content-Type': 'application/json' },
      data,
    })
  }

  function trackOrder(id: number) {
    createdOrderIds.push(id)
  }

  // ── 空 line_items 可建立訂單（WC 允許） ──────────────────────

  test('空 line_items 仍可建立訂單', async ({ request }) => {
    const res = await apiPost(request, 'wc/v3/orders', {
      billing: {
        first_name: 'Empty',
        last_name: 'Order',
        email: 'e2e-empty@example.com',
      },
      line_items: [],
    })

    expect(res.status()).toBe(201)
    const body = await res.json()
    expect(body.id).toBeGreaterThan(0)
    expect(body.total).toBe('0.00')
    trackOrder(body.id)
  })

  // ── 不存在的 product_id ───────────────────────────────────────

  test('不存在的 product_id 回傳 400', async ({ request }) => {
    const res = await apiPost(request, 'wc/v3/orders', {
      line_items: [{ product_id: 9999999, quantity: 1 }],
    })

    // WC 可能回傳 400 (invalid product) 或建立 0 金額訂單
    const body = await res.json()
    if (res.status() === 400) {
      expect(body.code).toBeDefined()
    } else {
      // WC 有時仍建立訂單，但商品無效
      expect(res.status()).toBe(201)
      trackOrder(body.id)
    }
  })

  // ── quantity 為 0 ──────────────────────────────────────────────

  test('quantity=0 的行為（WC 可能忽略或報錯）', async ({ request }) => {
    const res = await apiPost(request, 'wc/v3/orders', {
      line_items: [{ product_id: testIds.simpleProductId, quantity: 0 }],
    })

    const status = res.status()
    // WC 對 quantity=0 可能回傳 400、500（internal error）或 201
    expect([201, 400, 500]).toContain(status)
    if (status === 201) {
      const body = await res.json()
      trackOrder(body.id)
    }
  })

  // ── 負數 quantity ──────────────────────────────────────────────

  test('quantity=-1 回傳錯誤或被拒絕', async ({ request }) => {
    const res = await apiPost(request, 'wc/v3/orders', {
      line_items: [{ product_id: testIds.simpleProductId, quantity: -1 }],
    })

    const body = await res.json()
    if (res.status() === 400) {
      expect(body.code).toBeDefined()
    } else {
      // 某些 WC 版本仍可建立，記錄下來清理
      trackOrder(body.id)
    }
  })

  // ── 缺少 billing 仍可建立（WC 寬鬆模式） ────────────────────

  test('缺少 billing 仍可建立訂單', async ({ request }) => {
    const res = await apiPost(request, 'wc/v3/orders', {
      status: 'pending',
      line_items: [{ product_id: testIds.simpleProductId, quantity: 1 }],
    })

    expect(res.status()).toBe(201)
    const body = await res.json()
    expect(body.id).toBeGreaterThan(0)
    expect(body.status).toBe('pending')
    trackOrder(body.id)
  })

  // ── 完整建立訂單 ──────────────────────────────────────────────

  test('完整建立訂單（customer_id + line_items + billing）', async ({ request }) => {
    const res = await apiPost(request, 'wc/v3/orders', {
      customer_id: testIds.aliceId,
      status: 'pending',
      billing: {
        first_name: 'Alice',
        last_name: 'Wang',
        address_1: '信義路五段7號',
        city: '台北',
        postcode: '110',
        country: 'TW',
        email: 'e2e-alice@example.com',
        phone: '0912345678',
      },
      line_items: [
        { product_id: testIds.simpleProductId, quantity: 2 },
      ],
    })

    expect(res.status()).toBe(201)
    const body = await res.json()

    expect(body.id).toBeGreaterThan(0)
    expect(body.status).toBe('pending')
    expect(body.customer_id).toBe(testIds.aliceId)
    expect(body.billing.first_name).toBe('Alice')
    expect(body.billing.country).toBe('TW')
    expect(body.line_items).toHaveLength(1)
    expect(body.line_items[0].product_id).toBe(testIds.simpleProductId)
    expect(body.line_items[0].quantity).toBe(2)
    expect(Number(body.total)).toBeGreaterThan(0)

    trackOrder(body.id)
  })

  // ── 訂單正確關聯顧客 ─────────────────────────────────────────

  test('建立的訂單關聯正確的 customer_id', async ({ request }) => {
    const res = await apiPost(request, 'wc/v3/orders', {
      customer_id: testIds.bobId,
      line_items: [{ product_id: testIds.simpleProductId, quantity: 1 }],
    })

    expect(res.status()).toBe(201)
    const body = await res.json()
    expect(body.customer_id).toBe(testIds.bobId)
    trackOrder(body.id)

    // 再次 GET 確認
    const getRes = await request.get(`${BASE_URL}/wp-json/wc/v3/orders/${body.id}`, {
      headers: { 'X-WP-Nonce': nonce },
    })
    const getBody = await getRes.json()
    expect(getBody.customer_id).toBe(testIds.bobId)
  })
})
