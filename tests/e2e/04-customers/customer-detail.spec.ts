/**
 * 顧客詳情 API 測試 — GET /wc/v3/customers/{id}
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

test.describe('顧客詳情 GET /wc/v3/customers/{id}', () => {
  let nonce: string
  let testIds: Record<string, number>
  test.beforeAll(() => { nonce = getNonce(); testIds = getTestIds() })

  async function apiGet(request: APIRequestContext, endpoint: string, params?: Record<string, string>) {
    const url = new URL(`${BASE_URL}/wp-json/${endpoint}`)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    return request.get(url.toString(), { headers: { 'X-WP-Nonce': nonce } })
  }

  test('不存在的 customer_id 回傳 404', async ({ request }) => {
    const res = await apiGet(request, 'wc/v3/customers/999999')
    expect(res.status()).toBe(404)

    const data = await res.json()
    // WC 可能回傳 wc_rest_invalid_id 或 wc_user_invalid_id
    expect(data.code).toMatch(/invalid_id/)
  })

  test('有效 customer_id 回傳完整顧客資料', async ({ request }) => {
    const res = await apiGet(request, `wc/v3/customers/${testIds.aliceId}`)
    expect(res.status()).toBe(200)

    const data = await res.json()
    expect(data.id).toBe(testIds.aliceId)
    expect(data.email).toBe('e2e-alice@example.com')
    expect(data).toHaveProperty('billing')
    expect(data).toHaveProperty('shipping')
    expect(data).toHaveProperty('meta_data')
    expect(data).toHaveProperty('role')
    expect(data).toHaveProperty('is_paying_customer')
  })

  test('回應包含完整的帳單和寄送地址物件', async ({ request }) => {
    const res = await apiGet(request, `wc/v3/customers/${testIds.aliceId}`)
    expect(res.status()).toBe(200)

    const data = await res.json()

    // 帳單地址
    const billing = data.billing
    expect(billing).toBeDefined()
    expect(billing.first_name).toBe('Alice')
    expect(billing.last_name).toBe('Wang')
    expect(billing.address_1).toBe('信義路五段7號')
    expect(billing.city).toBe('台北')
    expect(billing.postcode).toBe('110')
    expect(billing.country).toBe('TW')
    expect(billing.email).toBe('e2e-alice@example.com')
    expect(billing.phone).toBe('0912345678')

    // 寄送地址
    const shipping = data.shipping
    expect(shipping).toBeDefined()
    expect(shipping.first_name).toBe('Alice')
    expect(shipping.last_name).toBe('Wang')
    expect(shipping.address_1).toBe('信義路五段7號')
    expect(shipping.city).toBe('台北')
    expect(shipping.country).toBe('TW')
  })

  test('Bob 顧客資料包含正確基本欄位與角色', async ({ request }) => {
    const res = await apiGet(request, `wc/v3/customers/${testIds.bobId}`)
    expect(res.status()).toBe(200)

    const data = await res.json()
    expect(data.id).toBe(testIds.bobId)
    expect(data.email).toBe('e2e-bob@example.com')
    expect(data.role).toBe('customer')
    expect(data).toHaveProperty('billing')
    expect(data).toHaveProperty('shipping')
    expect(data).toHaveProperty('avatar_url')
  })
})
