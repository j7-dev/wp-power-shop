/**
 * 訂單地址編輯 API 測試
 * Endpoint: PUT /wc/v3/orders/{id}
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

test.describe('訂單地址編輯 — PUT /wc/v3/orders/{id}', () => {
  let nonce: string
  let testIds: Record<string, number>
  const createdOrderIds: number[] = []

  test.beforeAll(() => {
    nonce = getNonce()
    testIds = getTestIds()
  })

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
  async function apiPut(request: APIRequestContext, endpoint: string, data: Record<string, unknown>) {
    return request.put(`${BASE_URL}/wp-json/${endpoint}`, {
      headers: { 'X-WP-Nonce': nonce, 'Content-Type': 'application/json' },
      data,
    })
  }

  async function createTestOrder(request: APIRequestContext): Promise<number> {
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
      line_items: [{ product_id: testIds.simpleProductId, quantity: 1 }],
    })
    const body = await res.json()
    createdOrderIds.push(body.id)
    return body.id
  }

  // ── 不存在的訂單 → 404 ────────────────────────────────────────

  test('不存在的訂單 ID 回傳錯誤', async ({ request }) => {
    const res = await apiPut(request, 'wc/v3/orders/999999', {
      billing: { first_name: 'Ghost' },
    })
    // WC 對不存在的訂單回傳 400（wc_rest_shop_order_invalid_id），非 404
    expect([400, 404]).toContain(res.status())
  })

  // ── 非標準國家代碼行為 ────────────────────────────────────────

  test('非標準國家代碼 "TAIWAN" — WC 可能接受字串值', async ({ request }) => {
    const orderId = await createTestOrder(request)

    const res = await apiPut(request, `wc/v3/orders/${orderId}`, {
      billing: { country: 'TAIWAN' },
    })

    const body = await res.json()
    // WC REST API 不嚴格驗證國家代碼，通常會直接存入
    if (res.status() === 200) {
      expect(body.billing.country).toBe('TAIWAN')
    } else {
      // 若有嚴格驗證，應回傳 400
      expect(res.status()).toBe(400)
    }
  })

  // ── 有效 billing 地址更新 ─────────────────────────────────────

  test('更新 billing 地址 — 欄位正確寫入', async ({ request }) => {
    const orderId = await createTestOrder(request)

    const newBilling = {
      first_name: 'Bob',
      last_name: 'Chen',
      company: 'E2E Corp',
      address_1: '中正路100號',
      address_2: '3樓',
      city: '高雄',
      state: '',
      postcode: '800',
      country: 'TW',
      email: 'e2e-bob@example.com',
      phone: '0987654321',
    }

    const res = await apiPut(request, `wc/v3/orders/${orderId}`, {
      billing: newBilling,
    })
    expect(res.status()).toBe(200)

    const body = await res.json()
    expect(body.billing.first_name).toBe('Bob')
    expect(body.billing.last_name).toBe('Chen')
    expect(body.billing.company).toBe('E2E Corp')
    expect(body.billing.address_1).toBe('中正路100號')
    expect(body.billing.address_2).toBe('3樓')
    expect(body.billing.city).toBe('高雄')
    expect(body.billing.postcode).toBe('800')
    expect(body.billing.country).toBe('TW')
    expect(body.billing.email).toBe('e2e-bob@example.com')
    expect(body.billing.phone).toBe('0987654321')
  })

  // ── 有效 shipping 地址更新 ────────────────────────────────────

  test('更新 shipping 地址 — 欄位正確寫入', async ({ request }) => {
    const orderId = await createTestOrder(request)

    const newShipping = {
      first_name: 'Charlie',
      last_name: 'Lin',
      company: '',
      address_1: '忠孝東路四段',
      address_2: '12F-1',
      city: '台北',
      state: '',
      postcode: '106',
      country: 'TW',
    }

    const res = await apiPut(request, `wc/v3/orders/${orderId}`, {
      shipping: newShipping,
    })
    expect(res.status()).toBe(200)

    const body = await res.json()
    expect(body.shipping.first_name).toBe('Charlie')
    expect(body.shipping.last_name).toBe('Lin')
    expect(body.shipping.address_1).toBe('忠孝東路四段')
    expect(body.shipping.address_2).toBe('12F-1')
    expect(body.shipping.city).toBe('台北')
    expect(body.shipping.postcode).toBe('106')
    expect(body.shipping.country).toBe('TW')
  })

  // ── billing 和 shipping 同時更新 ──────────────────────────────

  test('同時更新 billing 和 shipping', async ({ request }) => {
    const orderId = await createTestOrder(request)

    const res = await apiPut(request, `wc/v3/orders/${orderId}`, {
      billing: {
        first_name: 'Dave',
        last_name: 'Wu',
        city: '新竹',
        country: 'TW',
        email: 'e2e-dave@example.com',
      },
      shipping: {
        first_name: 'Dave',
        last_name: 'Wu',
        city: '桃園',
        country: 'TW',
      },
    })
    expect(res.status()).toBe(200)

    const body = await res.json()
    expect(body.billing.city).toBe('新竹')
    expect(body.shipping.city).toBe('桃園')
  })
})
