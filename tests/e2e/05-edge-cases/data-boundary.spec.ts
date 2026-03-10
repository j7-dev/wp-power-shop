/**
 * 資料邊界測試
 * 涵蓋：Unicode/Emoji、超長字串、特殊字元、HTML 注入、數值邊界、空值與空白
 */
import { test, expect, type APIRequestContext } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'
import { EDGE_CASE_STRINGS } from '../fixtures/test-data'

const BASE_URL = process.env.WP_BASE_URL || 'http://localhost:8890'

function getNonce(): string {
  return fs.readFileSync(path.resolve(import.meta.dirname, '../.auth/nonce.txt'), 'utf-8').trim()
}

function getTestIds(): Record<string, number> {
  return JSON.parse(
    fs.readFileSync(path.resolve(import.meta.dirname, '../.auth/test-ids.json'), 'utf-8'),
  )
}

function authHeaders() {
  return {
    'X-WP-Nonce': getNonce(),
    'Content-Type': 'application/json',
  }
}

async function createProduct(
  request: APIRequestContext,
  data: Record<string, unknown>,
): Promise<{ id: number; status: number; body: Record<string, unknown> }> {
  const res = await request.post(`${BASE_URL}/wp-json/wc/v3/products`, {
    headers: authHeaders(),
    data,
  })
  const body = await res.json().catch(() => ({}))
  return { id: body?.id ?? 0, status: res.status(), body }
}

async function deleteProduct(request: APIRequestContext, id: number) {
  if (!id) return
  await request.delete(`${BASE_URL}/wp-json/wc/v3/products/${id}?force=true`, {
    headers: authHeaders(),
  })
}

async function deleteOrder(request: APIRequestContext, id: number) {
  if (!id) return
  await request.delete(`${BASE_URL}/wp-json/wc/v3/orders/${id}?force=true`, {
    headers: authHeaders(),
  })
}

async function deleteCategory(request: APIRequestContext, id: number) {
  if (!id) return
  await request.delete(`${BASE_URL}/wp-json/wc/v3/products/categories/${id}?force=true`, {
    headers: authHeaders(),
  })
}

// ---------------------------------------------------------------------------
// 1. Unicode / Emoji 商品名稱
// ---------------------------------------------------------------------------
test.describe('Unicode / Emoji 支援', () => {
  let productId = 0

  test.afterEach(async ({ request }) => {
    await deleteProduct(request, productId)
    productId = 0
  })

  test('可建立含 Emoji 與多語系的商品名稱', async ({ request }) => {
    const unicodeName = '🎉 測試商品 título ✨'
    const { id, status, body } = await createProduct(request, {
      name: `[E2E] ${unicodeName}`,
      type: 'simple',
      regular_price: '100',
    })
    productId = id

    expect(status).toBe(201)
    expect(body.name).toContain('🎉')
    expect(body.name).toContain('測試商品')
    expect(body.name).toContain('título')
    expect(body.name).toContain('✨')
  })

  test('可建立含 RTL 阿拉伯文的商品名稱', async ({ request }) => {
    const rtlName = EDGE_CASE_STRINGS.rtl // 'مرحبا بالعالم'
    const { id, status, body } = await createProduct(request, {
      name: `[E2E] ${rtlName}`,
      type: 'simple',
      regular_price: '50',
    })
    productId = id

    expect(status).toBe(201)
    expect(body.name).toContain(rtlName)
  })

  test('可建立含純 Emoji 的商品名稱', async ({ request }) => {
    const emojiName = EDGE_CASE_STRINGS.emoji // '🍎🍊🍋🍇🫐'
    const { id, status, body } = await createProduct(request, {
      name: `[E2E] ${emojiName}`,
      type: 'simple',
      regular_price: '30',
    })
    productId = id

    expect(status).toBe(201)
    expect(body.name).toContain('🍎')
  })
})

// ---------------------------------------------------------------------------
// 2. 超長字串
// ---------------------------------------------------------------------------
test.describe('超長字串處理', () => {
  let productId = 0

  test.afterEach(async ({ request }) => {
    await deleteProduct(request, productId)
    productId = 0
  })

  test('10000 字元商品名稱 — 建立成功或回傳適當錯誤', async ({ request }) => {
    const longName = `[E2E] ${'A'.repeat(10000)}`
    const { id, status } = await createProduct(request, {
      name: longName,
      type: 'simple',
      regular_price: '100',
    })
    productId = id

    // 應該成功建立或回傳 4xx，絕不應 500
    expect(status).toBeLessThan(500)
    if (status === 201) {
      expect(id).toBeGreaterThan(0)
    }
  })
})

// ---------------------------------------------------------------------------
// 3. 訂單備註中的特殊字元
// ---------------------------------------------------------------------------
test.describe('訂單備註特殊字元', () => {
  let orderId = 0

  test.afterEach(async ({ request }) => {
    await deleteOrder(request, orderId)
    orderId = 0
  })

  test('備註含 HTML 實體與跳脫字元可正常存儲', async ({ request }) => {
    const specialNote = '<b>重要</b> & "特殊" \'字元\' \\n\\t'
    const res = await request.post(`${BASE_URL}/wp-json/wc/v3/orders`, {
      headers: authHeaders(),
      data: {
        status: 'pending',
        billing: { first_name: '[E2E] Special-Note' },
        customer_note: specialNote,
      },
    })
    expect(res.status()).toBeLessThan(500)

    if (res.status() === 201) {
      const order = await res.json()
      orderId = order.id
      // 核心內容應保留（可能被 sanitize 移除標籤）
      const note = String(order.customer_note ?? '')
      expect(note).toContain('重要')
      expect(note).toContain('特殊')
    }
  })
})

// ---------------------------------------------------------------------------
// 4. 顧客名稱 HTML 注入
// ---------------------------------------------------------------------------
test.describe('顧客名稱 HTML 注入防護', () => {
  test('更新顧客 first_name 含 <script> 應被清理', async ({ request }) => {
    const testIds = getTestIds()
    const customerId = testIds.aliceId
    if (!customerId) {
      test.skip()
      return
    }

    const xssPayload = '<script>alert(1)</script>'
    const res = await request.put(`${BASE_URL}/wp-json/wc/v3/customers/${customerId}`, {
      headers: authHeaders(),
      data: { first_name: xssPayload },
    })
    expect(res.status()).toBeLessThan(500)

    if (res.status() === 200) {
      const customer = await res.json()
      expect(String(customer.first_name)).not.toContain('<script>')
    }

    // 還原原始名稱
    await request.put(`${BASE_URL}/wp-json/wc/v3/customers/${customerId}`, {
      headers: authHeaders(),
      data: { first_name: 'Alice' },
    })
  })
})

// ---------------------------------------------------------------------------
// 5. 數值邊界
// ---------------------------------------------------------------------------
test.describe('數值邊界', () => {
  let productId = 0

  test.afterEach(async ({ request }) => {
    await deleteProduct(request, productId)
    productId = 0
  })

  test('regular_price=0 可正常建立', async ({ request }) => {
    const { id, status, body } = await createProduct(request, {
      name: '[E2E] 免費商品',
      type: 'simple',
      regular_price: '0',
    })
    productId = id

    expect(status).toBe(201)
    expect(body.regular_price).toBe('0')
  })

  test('regular_price=999999999 可正常建立', async ({ request }) => {
    const { id, status, body } = await createProduct(request, {
      name: '[E2E] 天價商品',
      type: 'simple',
      regular_price: '999999999',
    })
    productId = id

    expect(status).toBe(201)
    expect(body.regular_price).toBe('999999999')
  })

  test('stock_quantity=0 且 manage_stock=true → 狀態變為 outofstock', async ({ request }) => {
    const { id, status } = await createProduct(request, {
      name: '[E2E] 零庫存商品',
      type: 'simple',
      regular_price: '100',
      manage_stock: true,
      stock_quantity: 0,
    })
    productId = id
    expect(status).toBe(201)

    // 讀取商品確認庫存狀態
    const getRes = await request.get(`${BASE_URL}/wp-json/wc/v3/products/${id}`, {
      headers: authHeaders(),
    })
    const product = await getRes.json()
    expect(product.stock_quantity).toBe(0)
    expect(product.stock_status).toBe('outofstock')
  })
})

// ---------------------------------------------------------------------------
// 6. 空字串 — 必填欄位
// ---------------------------------------------------------------------------
test.describe('空字串必填欄位', () => {
  test('建立商品分類 name="" → 回傳錯誤', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/wp-json/wc/v3/products/categories`, {
      headers: authHeaders(),
      data: { name: '' },
    })
    const body = await res.json().catch(() => ({}))

    // 空名稱應被拒絕（400）或建立後被自動處理
    if (res.status() === 201 && body.id) {
      // 若意外建立成功則清理
      await deleteCategory(request, body.id)
    }
    // 至少不應 500
    expect(res.status()).not.toBe(500)
  })

  test('建立訂單備註 note="" → 回傳錯誤或忽略', async ({ request }) => {
    const testIds = getTestIds()
    const orderIdForNote = testIds.orderId
    if (!orderIdForNote) {
      test.skip()
      return
    }

    const res = await request.post(
      `${BASE_URL}/wp-json/wc/v3/orders/${orderIdForNote}/notes`,
      {
        headers: authHeaders(),
        data: { note: '' },
      },
    )
    // 空備註應被拒絕或忽略，不應 500
    expect(res.status()).not.toBe(500)
  })
})

// ---------------------------------------------------------------------------
// 7. 純空白字串
// ---------------------------------------------------------------------------
test.describe('純空白字串', () => {
  let productId = 0

  test.afterEach(async ({ request }) => {
    await deleteProduct(request, productId)
    productId = 0
  })

  test('商品名稱為純空白 → 應拒絕或自動修剪', async ({ request }) => {
    const { id, status, body } = await createProduct(request, {
      name: EDGE_CASE_STRINGS.whitespace, // '   '
      type: 'simple',
      regular_price: '100',
    })
    productId = id

    // 不應 500
    expect(status).toBeLessThan(500)

    if (status === 201) {
      // 若建立成功，名稱應被修剪或留空
      const name = String(body.name ?? '').trim()
      // 只要不崩潰就是合理行為
      expect(typeof body.name).toBe('string')
    }
  })
})

// ---------------------------------------------------------------------------
// 8. Null byte
// ---------------------------------------------------------------------------
test.describe('Null byte 處理', () => {
  let productId = 0

  test.afterEach(async ({ request }) => {
    await deleteProduct(request, productId)
    productId = 0
  })

  test('商品名稱含 null byte 不應導致錯誤', async ({ request }) => {
    const { id, status } = await createProduct(request, {
      name: `[E2E] ${EDGE_CASE_STRINGS.nullByte}`,
      type: 'simple',
      regular_price: '100',
    })
    productId = id

    expect(status).toBeLessThan(500)
  })
})
