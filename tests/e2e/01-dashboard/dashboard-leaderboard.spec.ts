import { test, expect, APIRequestContext } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

const BASE_URL = process.env.WP_BASE_URL || 'http://localhost:8890'
const ENDPOINT = 'power-shop/reports/dashboard/leaderboard'

function getNonce(): string {
  return fs.readFileSync(path.resolve(import.meta.dirname, '../.auth/nonce.txt'), 'utf-8').trim()
}

function getTestIds(): Record<string, number> {
  return JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../.auth/test-ids.json'), 'utf-8'))
}

test.describe('Dashboard 排行榜（端點尚未實作）', () => {
  let nonce: string
  let testIds: Record<string, number>

  test.beforeAll(() => {
    nonce = getNonce()
    testIds = getTestIds()
  })

  async function apiGet(request: APIRequestContext, params?: Record<string, string>) {
    const url = new URL(`${BASE_URL}/wp-json/${ENDPOINT}`)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    return request.get(url.toString(), {
      headers: { 'X-WP-Nonce': nonce },
    })
  }

  // ─── 端點不存在：基本請求應回傳 404 ───

  test('基本請求應回傳 404（端點尚未實作）', async ({ request }) => {
    const res = await apiGet(request)

    expect(res.status()).toBe(404)
    const body = await res.json()
    expect(body).toHaveProperty('code', 'rest_no_route')
    expect(body).toHaveProperty('message')
    expect(body).toHaveProperty('data')
    expect(body.data).toHaveProperty('status', 404)
  })

  // ─── 端點不存在：帶參數請求仍應回傳 404 ───

  test('帶查詢參數請求仍應回傳 404', async ({ request }) => {
    const res = await apiGet(request, {
      type: 'product',
      date_from: '2024-01-01',
      date_to: '2024-12-31',
    })

    expect(res.status()).toBe(404)
    const body = await res.json()
    expect(body.code).toBe('rest_no_route')
    expect(body.data.status).toBe(404)
  })

  // ─── 端點不存在：錯誤回應結構完整性驗證 ───

  test('404 錯誤回應應符合 WordPress REST API 標準錯誤格式', async ({ request }) => {
    const res = await apiGet(request, { type: 'customer' })

    expect(res.status()).toBe(404)
    const body = await res.json()

    // WordPress REST API 標準錯誤格式
    expect(typeof body.code).toBe('string')
    expect(typeof body.message).toBe('string')
    expect(typeof body.data).toBe('object')
    expect(typeof body.data.status).toBe('number')
  })
})
