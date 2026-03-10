/**
 * 顧客備註 API 測試 — Power Shop 自訂端點（尚未實作）
 * GET/POST /power-shop/customers/{id}/notes — 端點不存在，預期 404
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

test.describe('顧客備註端點 — 尚未實作（預期 404）', () => {
  let nonce: string
  let testIds: Record<string, number>
  test.beforeAll(() => { nonce = getNonce(); testIds = getTestIds() })

  async function apiGet(request: APIRequestContext, endpoint: string) {
    return request.get(`${BASE_URL}/wp-json/${endpoint}`, {
      headers: { 'X-WP-Nonce': nonce },
    })
  }
  async function apiPost(request: APIRequestContext, endpoint: string, data: Record<string, unknown>) {
    return request.post(`${BASE_URL}/wp-json/${endpoint}`, {
      headers: { 'X-WP-Nonce': nonce, 'Content-Type': 'application/json' }, data,
    })
  }

  test('GET /power-shop/customers/{id}/notes 回傳 404', async ({ request }) => {
    const res = await apiGet(request, `power-shop/customers/${testIds.aliceId}/notes`)
    expect(res.status()).toBe(404)

    const data = await res.json()
    expect(data.code).toBe('rest_no_route')
    expect(data.message).toBeDefined()
    expect(data.data).toBeDefined()
    expect(data.data.status).toBe(404)
  })

  test('POST /power-shop/customers/{id}/notes 帶有內容仍回傳 404', async ({ request }) => {
    const res = await apiPost(request, `power-shop/customers/${testIds.aliceId}/notes`, {
      content: '這是一則測試備註',
    })
    expect(res.status()).toBe(404)

    const data = await res.json()
    expect(data.code).toBe('rest_no_route')
    expect(data.message).toBeDefined()
    expect(data.data).toBeDefined()
    expect(data.data.status).toBe(404)
  })

  test('404 回應結構符合 WordPress REST 錯誤格式', async ({ request }) => {
    const res = await apiGet(request, `power-shop/customers/${testIds.bobId}/notes`)
    expect(res.status()).toBe(404)

    const data = await res.json()
    // WordPress REST API 標準錯誤結構：{ code, message, data: { status } }
    expect(data).toMatchObject({
      code: 'rest_no_route',
      data: { status: 404 },
    })
    expect(typeof data.message).toBe('string')
    expect(data.message.length).toBeGreaterThan(0)
  })
})
