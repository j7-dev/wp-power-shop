/**
 * 訂單狀態更新 API 測試
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

test.describe('訂單狀態更新 — PUT /wc/v3/orders/{id}', () => {
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
  async function apiGet(request: APIRequestContext, endpoint: string) {
    return request.get(`${BASE_URL}/wp-json/${endpoint}`, {
      headers: { 'X-WP-Nonce': nonce },
    })
  }

  /** 建立一筆 pending 訂單作為測試用 */
  async function createPendingOrder(request: APIRequestContext): Promise<number> {
    const res = await apiPost(request, 'wc/v3/orders', {
      customer_id: testIds.aliceId,
      status: 'pending',
      line_items: [{ product_id: testIds.simpleProductId, quantity: 1 }],
    })
    const body = await res.json()
    createdOrderIds.push(body.id)
    return body.id
  }

  // ── 不存在的訂單 ID → 404 ─────────────────────────────────────

  test('不存在的訂單 ID 回傳錯誤', async ({ request }) => {
    const res = await apiPut(request, 'wc/v3/orders/999999', { status: 'processing' })
    // WC 對不存在的訂單回傳 400（wc_rest_shop_order_invalid_id），非 404
    expect([400, 404]).toContain(res.status())
  })

  // ── 無效狀態 → 400 ───────────────────────────────────────────

  for (const badStatus of ['nonexistent', 'foobar', 'xyz-invalid']) {
    test(`無效狀態 "${badStatus}" 回傳 400`, async ({ request }) => {
      const res = await apiPut(request, `wc/v3/orders/${testIds.orderId}`, {
        status: badStatus,
      })
      expect(res.status()).toBe(400)
      const body = await res.json()
      expect(body.code).toContain('invalid')
    })
  }

  // ── pending → processing 正常轉換 ────────────────────────────

  test('pending → processing 正確更新', async ({ request }) => {
    const orderId = await createPendingOrder(request)

    const res = await apiPut(request, `wc/v3/orders/${orderId}`, {
      status: 'processing',
    })
    expect(res.status()).toBe(200)

    const body = await res.json()
    expect(body.status).toBe('processing')
  })

  // ── 狀態變更後 order notes 有記錄 ────────────────────────────

  test('狀態變更在 order notes 中有記錄', async ({ request }) => {
    const orderId = await createPendingOrder(request)

    // 更新狀態
    await apiPut(request, `wc/v3/orders/${orderId}`, { status: 'on-hold' })

    // 取得 order notes
    const notesRes = await apiGet(request, `wc/v3/orders/${orderId}/notes`)
    expect(notesRes.status()).toBe(200)

    const notes = await notesRes.json()
    expect(Array.isArray(notes)).toBe(true)
    expect(notes.length).toBeGreaterThanOrEqual(1)

    // 至少一筆 note 提到狀態變更
    const statusNote = notes.find(
      (n: { note: string }) => n.note.toLowerCase().includes('pending') || n.note.toLowerCase().includes('on-hold'),
    )
    expect(statusNote).toBeDefined()
  })

  // ── 完整流程：建立 → 更新 → 驗證 ────────────────────────────

  test('完整流程：建立 → processing → completed', async ({ request }) => {
    const orderId = await createPendingOrder(request)

    // pending → processing
    const r1 = await apiPut(request, `wc/v3/orders/${orderId}`, { status: 'processing' })
    expect(r1.status()).toBe(200)
    expect((await r1.json()).status).toBe('processing')

    // processing → completed
    const r2 = await apiPut(request, `wc/v3/orders/${orderId}`, { status: 'completed' })
    expect(r2.status()).toBe(200)
    expect((await r2.json()).status).toBe('completed')

    // GET 再次驗證最終狀態
    const getRes = await apiGet(request, `wc/v3/orders/${orderId}`)
    expect(getRes.status()).toBe(200)
    expect((await getRes.json()).status).toBe('completed')
  })
})
