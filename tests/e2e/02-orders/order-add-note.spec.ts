/**
 * 訂單備註 API 測試
 * Endpoint: POST /wc/v3/orders/{id}/notes
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

test.describe('訂單備註 — POST /wc/v3/orders/{id}/notes', () => {
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
  async function apiGet(request: APIRequestContext, endpoint: string) {
    return request.get(`${BASE_URL}/wp-json/${endpoint}`, {
      headers: { 'X-WP-Nonce': nonce },
    })
  }

  async function createTestOrder(request: APIRequestContext): Promise<number> {
    const res = await apiPost(request, 'wc/v3/orders', {
      customer_id: testIds.aliceId,
      status: 'pending',
      line_items: [{ product_id: testIds.simpleProductId, quantity: 1 }],
    })
    const body = await res.json()
    createdOrderIds.push(body.id)
    return body.id
  }

  // ── 不存在的訂單 → 404 ────────────────────────────────────────

  test('不存在的訂單 ID 回傳 404', async ({ request }) => {
    const res = await apiPost(request, 'wc/v3/orders/999999/notes', {
      note: '這張訂單不存在',
    })
    expect(res.status()).toBe(404)
  })

  // ── 空白備註 → 400 ───────────────────────────────────────────

  test('空白備註 — WC 仍接受（回傳 201）', async ({ request }) => {
    const orderId = await createTestOrder(request)

    const res = await apiPost(request, `wc/v3/orders/${orderId}/notes`, {
      note: '',
    })
    // WC REST API 不驗證空白備註，直接建立
    expect(res.status()).toBe(201)
    const body = await res.json()
    expect(body.id).toBeGreaterThan(0)
  })

  // ── 內部備註（customer_note=false） ──────────────────────────

  test('customer_note=false 建立內部備註', async ({ request }) => {
    const orderId = await createTestOrder(request)

    const res = await apiPost(request, `wc/v3/orders/${orderId}/notes`, {
      note: '[E2E] 內部備註：庫存已確認',
      customer_note: false,
    })
    expect(res.status()).toBe(201)

    const body = await res.json()
    expect(body.id).toBeGreaterThan(0)
    expect(body.note).toContain('內部備註')
    expect(body.customer_note).toBe(false)
  })

  // ── 顧客可見備註（customer_note=true） ───────────────────────

  test('customer_note=true 建立顧客可見備註', async ({ request }) => {
    const orderId = await createTestOrder(request)

    const res = await apiPost(request, `wc/v3/orders/${orderId}/notes`, {
      note: '[E2E] 您的訂單已出貨',
      customer_note: true,
    })
    expect(res.status()).toBe(201)

    const body = await res.json()
    expect(body.id).toBeGreaterThan(0)
    expect(body.note).toContain('已出貨')
    expect(body.customer_note).toBe(true)
  })

  // ── 新備註排在最前面（最新） ──────────────────────────────────

  test('新備註排在 timeline 最前面', async ({ request }) => {
    const orderId = await createTestOrder(request)

    // 新增第一筆備註
    await apiPost(request, `wc/v3/orders/${orderId}/notes`, {
      note: '[E2E] 第一筆備註',
    })

    // 短暫等待確保時間戳不同
    await new Promise(r => setTimeout(r, 1000))

    // 新增第二筆備註
    await apiPost(request, `wc/v3/orders/${orderId}/notes`, {
      note: '[E2E] 第二筆備註（最新）',
    })

    // 取得所有備註
    const notesRes = await apiGet(request, `wc/v3/orders/${orderId}/notes`)
    expect(notesRes.status()).toBe(200)

    const notes = await notesRes.json()
    expect(notes.length).toBeGreaterThanOrEqual(2)

    // WC 預設回傳最新在前（desc by date）
    const firstNote = notes[0]
    expect(firstNote.note).toContain('第二筆備註')

    // 確認時間順序：第一筆比第二筆早
    const dates = notes
      .filter((n: { note: string }) => n.note.includes('[E2E]'))
      .map((n: { date_created: string }) => new Date(n.date_created).getTime())

    if (dates.length >= 2) {
      expect(dates[0]).toBeGreaterThanOrEqual(dates[1])
    }
  })
})
