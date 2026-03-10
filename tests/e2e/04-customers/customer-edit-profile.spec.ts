/**
 * 顧客個人資料編輯 API 測試 — PUT /wc/v3/customers/{id}
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

test.describe('顧客個人資料編輯 PUT /wc/v3/customers/{id}', () => {
  let nonce: string
  let testIds: Record<string, number>
  test.beforeAll(() => { nonce = getNonce(); testIds = getTestIds() })

  async function apiGet(request: APIRequestContext, endpoint: string, params?: Record<string, string>) {
    const url = new URL(`${BASE_URL}/wp-json/${endpoint}`)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    return request.get(url.toString(), { headers: { 'X-WP-Nonce': nonce } })
  }
  async function apiPut(request: APIRequestContext, endpoint: string, data: Record<string, unknown>) {
    return request.put(`${BASE_URL}/wp-json/${endpoint}`, {
      headers: { 'X-WP-Nonce': nonce, 'Content-Type': 'application/json' }, data,
    })
  }

  test('不存在的 customer_id 回傳 404', async ({ request }) => {
    const res = await apiPut(request, 'wc/v3/customers/999999', {
      first_name: 'Ghost',
    })
    expect(res.status()).toBe(404)

    const data = await res.json()
    expect(data.code).toBe('wc_rest_invalid_id')
  })

  test('無效 email 格式回傳 400 錯誤', async ({ request }) => {
    const invalidEmails = ['not-an-email', '@missing.com', 'missing@']

    for (const email of invalidEmails) {
      const res = await apiPut(request, `wc/v3/customers/${testIds.bobId}`, { email })
      expect(res.status(), `email="${email}" 應被拒絕`).toBe(400)

      const data = await res.json()
      expect(data.code).toBeDefined()
    }
  })

  test('重複 email（使用 bob 的 email 更新 alice）回傳 400 錯誤', async ({ request }) => {
    const res = await apiPut(request, `wc/v3/customers/${testIds.aliceId}`, {
      email: 'e2e-bob@example.com',
    })
    expect(res.status()).toBe(400)

    const data = await res.json()
    expect(data.code).toBeDefined()
  })

  test('有效更新 first_name、last_name、email 成功', async ({ request }) => {
    const updatedEmail = 'e2e-alice-updated@example.com'
    const res = await apiPut(request, `wc/v3/customers/${testIds.aliceId}`, {
      first_name: 'Alice-Updated',
      last_name: 'Wang-Updated',
      email: updatedEmail,
    })
    expect(res.status()).toBe(200)

    const data = await res.json()
    expect(data.id).toBe(testIds.aliceId)
    expect(data.first_name).toBe('Alice-Updated')
    expect(data.last_name).toBe('Wang-Updated')
    expect(data.email).toBe(updatedEmail)
  })

  test('更新後重新查詢確認資料已持久化', async ({ request }) => {
    // 先執行更新
    const updateRes = await apiPut(request, `wc/v3/customers/${testIds.aliceId}`, {
      first_name: 'Alice-Persist',
      last_name: 'Wang-Persist',
      email: 'e2e-alice-persist@example.com',
    })
    expect(updateRes.status()).toBe(200)

    // 再查詢確認
    const getRes = await apiGet(request, `wc/v3/customers/${testIds.aliceId}`)
    expect(getRes.status()).toBe(200)

    const data = await getRes.json()
    expect(data.first_name).toBe('Alice-Persist')
    expect(data.last_name).toBe('Wang-Persist')
    expect(data.email).toBe('e2e-alice-persist@example.com')
  })

  test.afterAll(async ({ request }) => {
    // 還原 Alice 的原始資料，避免影響其他測試
    await apiPut(request, `wc/v3/customers/${testIds.aliceId}`, {
      first_name: 'Alice',
      last_name: 'Wang',
      email: 'e2e-alice@example.com',
    })
  })
})
