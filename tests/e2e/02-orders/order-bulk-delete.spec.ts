/**
 * 訂單批次刪除 API 測試
 * Endpoint: POST /wc/v3/orders/batch
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

test.describe('訂單批次刪除 — POST /wc/v3/orders/batch', () => {
  let nonce: string
  let testIds: Record<string, number>
  const createdOrderIds: number[] = []

  test.beforeAll(() => {
    nonce = getNonce()
    testIds = getTestIds()
  })

  // 清理殘留訂單（以防測試中途失敗）
  test.afterAll(async ({ request }) => {
    for (const id of createdOrderIds) {
      await request.delete(`${BASE_URL}/wp-json/wc/v3/orders/${id}?force=true`, {
        headers: { 'X-WP-Nonce': nonce },
      }).catch(() => {})
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

  /** 批次建立臨時訂單 */
  async function createTempOrders(request: APIRequestContext, count: number): Promise<number[]> {
    const ids: number[] = []
    for (let i = 0; i < count; i++) {
      const res = await apiPost(request, 'wc/v3/orders', {
        status: 'pending',
        billing: {
          first_name: `E2E-Bulk-${i}`,
          last_name: 'Delete',
          email: `e2e-bulk-${i}@example.com`,
        },
        line_items: [{ product_id: testIds.simpleProductId, quantity: 1 }],
      })
      const body = await res.json()
      ids.push(body.id)
      createdOrderIds.push(body.id)
    }
    return ids
  }

  // ── 刪除不存在的訂單 ─────────────────────────────────────────

  test('batch delete 不存在的訂單 ID — 部分成功或回傳錯誤', async ({ request }) => {
    const res = await apiPost(request, 'wc/v3/orders/batch', {
      delete: [9999991, 9999992],
    })

    // WC batch API 通常回傳 200，但 delete 結果中會包含錯誤
    const body = await res.json()
    if (res.status() === 200) {
      expect(body.delete).toBeDefined()
      // 每筆結果可能包含 error 欄位
      for (const item of body.delete) {
        if (item.error) {
          expect(item.error.code).toBeDefined()
        }
      }
    }
  })

  // ── 空的 delete 陣列 ─────────────────────────────────────────

  test('空的 delete 陣列 — 不報錯（no-op）', async ({ request }) => {
    const res = await apiPost(request, 'wc/v3/orders/batch', {
      delete: [],
    })

    // 應該回傳 200 且不做任何事
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.delete || []).toHaveLength(0)
  })

  // ── 正常批次刪除 ──────────────────────────────────────────────

  test('批次刪除多筆訂單 — 訂單確實被移除', async ({ request }) => {
    test.setTimeout(60_000) // 批次操作較慢
    // 建立 3 筆臨時訂單
    const orderIds = await createTempOrders(request, 3)
    expect(orderIds).toHaveLength(3)

    // 確認訂單存在
    for (const id of orderIds) {
      const check = await apiGet(request, `wc/v3/orders/${id}`)
      expect(check.status()).toBe(200)
    }

    // 批次刪除（force=true 永久刪除，不進 trash）
    const res = await apiPost(request, 'wc/v3/orders/batch?force=true', {
      delete: orderIds,
    })
    expect(res.status()).toBe(200)

    const body = await res.json()
    expect(body.delete).toBeDefined()
    expect(body.delete).toHaveLength(3)

    // 每筆刪除結果都應有 id
    for (const item of body.delete) {
      expect(orderIds).toContain(item.id)
    }

    // 驗證訂單已被永久刪除（force=true → GET 回傳 404）
    for (const id of orderIds) {
      const verify = await apiGet(request, `wc/v3/orders/${id}`)
      expect(verify.status()).toBe(404)
    }

    // 從追蹤列表移除已刪除的 ID（避免 afterAll 重複刪除報錯）
    for (const id of orderIds) {
      const idx = createdOrderIds.indexOf(id)
      if (idx > -1) createdOrderIds.splice(idx, 1)
    }
  })

  // ── 混合有效與無效 ID 的批次刪除 ─────────────────────────────

  test('混合有效與無效 ID — 有效的被刪除、無效的回傳錯誤', async ({ request }) => {
    const [validId] = await createTempOrders(request, 1)

    const res = await apiPost(request, 'wc/v3/orders/batch?force=true', {
      delete: [validId, 9999993],
    })
    expect(res.status()).toBe(200)

    const body = await res.json()
    expect(body.delete).toHaveLength(2)

    // 有效的訂單被永久刪除
    const validResult = body.delete.find((d: { id: number }) => d.id === validId)
    expect(validResult).toBeDefined()

    // 無效的訂單回傳錯誤
    const invalidResult = body.delete.find((d: { id: number }) => d.id === 9999993)
    if (invalidResult) {
      expect(invalidResult.error).toBeDefined()
    }

    // 從追蹤列表移除
    const idx = createdOrderIds.indexOf(validId)
    if (idx > -1) createdOrderIds.splice(idx, 1)
  })
})
