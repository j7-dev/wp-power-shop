/**
 * 併發存取測試
 * 涵蓋：同時更新狀態、同時修改商品、建立+刪除競態、批次刪除與讀取同時進行
 */
import { test, expect, type APIRequestContext } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'
import { VALID_ORDER_STATUSES } from '../fixtures/test-data'

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

async function createOrder(
  request: APIRequestContext,
): Promise<number> {
  const res = await request.post(`${BASE_URL}/wp-json/wc/v3/orders`, {
    headers: authHeaders(),
    data: {
      status: 'pending',
      billing: { first_name: '[E2E] Concurrent', last_name: 'Test' },
    },
  })
  const body = await res.json()
  expect(res.status()).toBe(201)
  return body.id
}

async function createProduct(
  request: APIRequestContext,
  suffix: string,
): Promise<number> {
  const res = await request.post(`${BASE_URL}/wp-json/wc/v3/products`, {
    headers: authHeaders(),
    data: {
      name: `[E2E] Concurrent-${suffix}`,
      type: 'simple',
      regular_price: '100',
    },
  })
  const body = await res.json()
  expect(res.status()).toBe(201)
  return body.id
}

async function deleteOrder(request: APIRequestContext, id: number) {
  if (!id) return
  await request.delete(`${BASE_URL}/wp-json/wc/v3/orders/${id}?force=true`, {
    headers: authHeaders(),
  })
}

async function deleteProduct(request: APIRequestContext, id: number) {
  if (!id) return
  await request.delete(`${BASE_URL}/wp-json/wc/v3/products/${id}?force=true`, {
    headers: authHeaders(),
  })
}

// ---------------------------------------------------------------------------
// 1. 同時更新訂單狀態 — 最終應為某個合法狀態
// ---------------------------------------------------------------------------
test.describe('同時更新訂單狀態', () => {
  let orderId = 0

  test.beforeEach(async ({ request }) => {
    orderId = await createOrder(request)
  })

  test.afterEach(async ({ request }) => {
    await deleteOrder(request, orderId)
    orderId = 0
  })

  test('兩個同時的 PUT 不會導致資料損毀', async ({ request }) => {
    const hdrs = authHeaders()
    const url = `${BASE_URL}/wp-json/wc/v3/orders/${orderId}`

    // 同時發送兩個不同狀態的更新
    const [res1, res2] = await Promise.all([
      request.put(url, { headers: hdrs, data: { status: 'processing' } }),
      request.put(url, { headers: hdrs, data: { status: 'completed' } }),
    ])

    // 兩個請求都不應 500
    expect(res1.status()).toBeLessThan(500)
    expect(res2.status()).toBeLessThan(500)

    // 讀取最終狀態，應為合法的 WooCommerce 訂單狀態
    const getRes = await request.get(url, { headers: hdrs })
    const order = await getRes.json()
    expect(VALID_ORDER_STATUSES).toContain(order.status)
  })
})

// ---------------------------------------------------------------------------
// 2. 同時更新商品名稱
// ---------------------------------------------------------------------------
test.describe('同時更新商品名稱', () => {
  let productId = 0

  test.beforeEach(async ({ request }) => {
    productId = await createProduct(request, 'Name-Race')
  })

  test.afterEach(async ({ request }) => {
    await deleteProduct(request, productId)
    productId = 0
  })

  test('兩個同時的 PUT 不會導致名稱損毀', async ({ request }) => {
    const hdrs = authHeaders()
    const url = `${BASE_URL}/wp-json/wc/v3/products/${productId}`
    const nameA = '[E2E] 名稱-Alpha'
    const nameB = '[E2E] 名稱-Bravo'

    const [res1, res2] = await Promise.all([
      request.put(url, { headers: hdrs, data: { name: nameA } }),
      request.put(url, { headers: hdrs, data: { name: nameB } }),
    ])

    expect(res1.status()).toBeLessThan(500)
    expect(res2.status()).toBeLessThan(500)

    // 最終名稱應為其中一個，不應是混合或損毀的值
    const getRes = await request.get(url, { headers: hdrs })
    const product = await getRes.json()
    expect([nameA, nameB]).toContain(product.name)
  })
})

// ---------------------------------------------------------------------------
// 3. 建立後立即刪除 — 競態條件
// ---------------------------------------------------------------------------
test.describe('建立 + 刪除競態', () => {
  test('建立訂單後立即刪除，不留殘餘資料', async ({ request }) => {
    const hdrs = authHeaders()

    // 建立訂單
    const createRes = await request.post(`${BASE_URL}/wp-json/wc/v3/orders`, {
      headers: hdrs,
      data: {
        status: 'pending',
        billing: { first_name: '[E2E] Race-Delete' },
      },
    })
    expect(createRes.status()).toBe(201)
    const order = await createRes.json()
    const id = order.id

    // 立即刪除（不等待）
    const deleteRes = await request.delete(
      `${BASE_URL}/wp-json/wc/v3/orders/${id}?force=true`,
      { headers: hdrs },
    )
    expect(deleteRes.status()).toBe(200)

    // 確認已刪除
    const getRes = await request.get(`${BASE_URL}/wp-json/wc/v3/orders/${id}`, {
      headers: hdrs,
    })
    expect([404, 410]).toContain(getRes.status())
  })

  test('建立商品後立即刪除，不留殘餘資料', async ({ request }) => {
    const hdrs = authHeaders()

    const createRes = await request.post(`${BASE_URL}/wp-json/wc/v3/products`, {
      headers: hdrs,
      data: {
        name: '[E2E] Race-Delete Product',
        type: 'simple',
        regular_price: '50',
      },
    })
    expect(createRes.status()).toBe(201)
    const product = await createRes.json()
    const id = product.id

    const deleteRes = await request.delete(
      `${BASE_URL}/wp-json/wc/v3/products/${id}?force=true`,
      { headers: hdrs },
    )
    expect(deleteRes.status()).toBe(200)

    const getRes = await request.get(`${BASE_URL}/wp-json/wc/v3/products/${id}`, {
      headers: hdrs,
    })
    expect([404, 410]).toContain(getRes.status())
  })
})

// ---------------------------------------------------------------------------
// 4. 批次刪除同時讀取 — 不應崩潰
// ---------------------------------------------------------------------------
test.describe('批次刪除 + 同時讀取', () => {
  const orderIds: number[] = []

  test.beforeEach(async ({ request }) => {
    // 建立 3 筆訂單
    for (let i = 0; i < 3; i++) {
      const id = await createOrder(request)
      orderIds.push(id)
    }
  })

  test.afterEach(async ({ request }) => {
    // 清理可能殘存的訂單
    for (const id of orderIds) {
      await deleteOrder(request, id).catch(() => {})
    }
    orderIds.length = 0
  })

  test('同時刪除 3 筆訂單 + 讀取列表，不產生 500', async ({ request }) => {
    const hdrs = authHeaders()

    // 同時發起：刪除 3 筆 + 讀取列表
    const promises = [
      ...orderIds.map((id) =>
        request.delete(`${BASE_URL}/wp-json/wc/v3/orders/${id}?force=true`, {
          headers: hdrs,
        }),
      ),
      request.get(`${BASE_URL}/wp-json/wc/v3/orders`, { headers: hdrs }),
    ]

    const results = await Promise.all(promises)

    // 所有請求都不應回傳 500
    for (const res of results) {
      expect(res.status()).toBeLessThan(500)
    }

    // 列表回傳（最後一個請求）應為 200
    const listRes = results[results.length - 1]
    expect(listRes.status()).toBe(200)
    const body = await listRes.json()
    expect(Array.isArray(body)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// 5. 同時建立多筆訂單 — 不互相干擾
// ---------------------------------------------------------------------------
test.describe('同時建立多筆訂單', () => {
  const createdIds: number[] = []

  test.afterEach(async ({ request }) => {
    for (const id of createdIds) {
      await deleteOrder(request, id).catch(() => {})
    }
    createdIds.length = 0
  })

  test('5 筆同時建立全部成功且 ID 唯一', async ({ request }) => {
    const hdrs = authHeaders()

    const promises = Array.from({ length: 5 }, (_, i) =>
      request.post(`${BASE_URL}/wp-json/wc/v3/orders`, {
        headers: hdrs,
        data: {
          status: 'pending',
          billing: { first_name: `[E2E] Parallel-${i}` },
        },
      }),
    )

    const results = await Promise.all(promises)

    for (const res of results) {
      expect(res.status()).toBe(201)
      const body = await res.json()
      createdIds.push(body.id)
    }

    // 所有 ID 應唯一
    const uniqueIds = new Set(createdIds)
    expect(uniqueIds.size).toBe(createdIds.length)
  })
})

// ---------------------------------------------------------------------------
// 6. 同時讀寫同一商品不同欄位
// ---------------------------------------------------------------------------
test.describe('同時讀寫商品不同欄位', () => {
  let productId = 0

  test.beforeEach(async ({ request }) => {
    productId = await createProduct(request, 'Multi-Field')
  })

  test.afterEach(async ({ request }) => {
    await deleteProduct(request, productId)
    productId = 0
  })

  test('同時更新價格 + 更新描述 + 讀取，不產生錯誤', async ({ request }) => {
    const hdrs = authHeaders()
    const url = `${BASE_URL}/wp-json/wc/v3/products/${productId}`

    const [priceRes, descRes, getRes] = await Promise.all([
      request.put(url, { headers: hdrs, data: { regular_price: '200' } }),
      request.put(url, { headers: hdrs, data: { description: '[E2E] 更新描述' } }),
      request.get(url, { headers: hdrs }),
    ])

    expect(priceRes.status()).toBeLessThan(500)
    expect(descRes.status()).toBeLessThan(500)
    expect(getRes.status()).toBe(200)

    // 最終狀態應一致可讀
    const finalRes = await request.get(url, { headers: hdrs })
    const product = await finalRes.json()
    expect(product.id).toBe(productId)
    expect(typeof product.regular_price).toBe('string')
    expect(typeof product.description).toBe('string')
  })
})
