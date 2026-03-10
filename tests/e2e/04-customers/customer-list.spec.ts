/**
 * 顧客列表 API 測試 — GET /wc/v3/customers
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

test.describe('顧客列表 GET /wc/v3/customers', () => {
  let nonce: string
  let testIds: Record<string, number>
  test.beforeAll(() => { nonce = getNonce(); testIds = getTestIds() })

  async function apiGet(request: APIRequestContext, endpoint: string, params?: Record<string, string>) {
    const url = new URL(`${BASE_URL}/wp-json/${endpoint}`)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    return request.get(url.toString(), { headers: { 'X-WP-Nonce': nonce } })
  }

  test('per_page=10 回傳的每筆記錄都包含必要欄位', async ({ request }) => {
    const res = await apiGet(request, 'wc/v3/customers', { per_page: '10' })
    expect(res.status()).toBe(200)

    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data.length).toBeLessThanOrEqual(10)

    for (const customer of data) {
      expect(customer).toHaveProperty('id')
      expect(typeof customer.id).toBe('number')
      expect(customer).toHaveProperty('first_name')
      expect(customer).toHaveProperty('last_name')
      expect(customer).toHaveProperty('email')
      expect(customer).toHaveProperty('role')
      expect(customer).toHaveProperty('username')
      expect(customer).toHaveProperty('date_created')
    }
  })

  test('回應包含分頁 headers X-WP-Total 和 X-WP-TotalPages', async ({ request }) => {
    const res = await apiGet(request, 'wc/v3/customers', { per_page: '1' })
    expect(res.status()).toBe(200)

    const total = res.headers()['x-wp-total']
    const totalPages = res.headers()['x-wp-totalpages']
    expect(total).toBeDefined()
    expect(totalPages).toBeDefined()
    expect(Number(total)).toBeGreaterThanOrEqual(2) // 至少有 alice + bob
    expect(Number(totalPages)).toBeGreaterThanOrEqual(2)
  })

  test('以 role=customer 篩選只回傳 customer 角色的使用者', async ({ request }) => {
    const res = await apiGet(request, 'wc/v3/customers', { role: 'customer', per_page: '100' })
    expect(res.status()).toBe(200)

    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)

    for (const customer of data) {
      expect(customer.role).toBe('customer')
    }
  })

  test('以 email 搜尋可找到特定顧客', async ({ request }) => {
    const res = await apiGet(request, 'wc/v3/customers', { search: 'e2e-alice@example.com' })
    expect(res.status()).toBe(200)

    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThanOrEqual(1)

    const alice = data.find((c: { id: number }) => c.id === testIds.aliceId)
    expect(alice).toBeDefined()
    expect(alice.email).toBe('e2e-alice@example.com')
    expect(alice.first_name).toBe('Alice')
    expect(alice.last_name).toBe('Wang')
  })
})
