/**
 * 安全性邊緣案例測試
 * 涵蓋：未認證存取、無效 Nonce、SQL 注入、XSS 防護、極端 ID 處理
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

/** 不帶 Nonce 的 GET */
async function getWithoutNonce(request: APIRequestContext, endpoint: string) {
  return request.get(`${BASE_URL}/wp-json/${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
  })
}

/** 不帶 Nonce 的 POST */
async function postWithoutNonce(
  request: APIRequestContext,
  endpoint: string,
  data: Record<string, unknown>,
) {
  return request.post(`${BASE_URL}/wp-json/${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    data,
  })
}

/** 帶假 Nonce 的 GET */
async function getWithFakeNonce(request: APIRequestContext, endpoint: string) {
  return request.get(`${BASE_URL}/wp-json/${endpoint}`, {
    headers: { 'X-WP-Nonce': 'invalid-nonce-12345', 'Content-Type': 'application/json' },
  })
}

/** 帶合法 Nonce 的 GET（含 query params） */
async function authedGet(
  request: APIRequestContext,
  endpoint: string,
  params?: Record<string, string>,
) {
  const url = new URL(`${BASE_URL}/wp-json/${endpoint}`)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return request.get(url.toString(), {
    headers: { 'X-WP-Nonce': getNonce(), 'Content-Type': 'application/json' },
  })
}

/** 帶合法 Nonce 的 POST */
async function authedPost(
  request: APIRequestContext,
  endpoint: string,
  data: Record<string, unknown>,
) {
  return request.post(`${BASE_URL}/wp-json/${endpoint}`, {
    headers: { 'X-WP-Nonce': getNonce(), 'Content-Type': 'application/json' },
    data,
  })
}

// ---------------------------------------------------------------------------
// 1. 未認證存取 — 所有主要端點不帶 Nonce 應回傳 401 / 403
// ---------------------------------------------------------------------------
test.describe('未認證存取', () => {
  const readEndpoints = [
    'wc/v3/orders',
    'wc/v3/products',
    'wc/v3/customers',
    'power-shop/reports/dashboard/stats',
  ]

  for (const ep of readEndpoints) {
    test(`GET /${ep} 無 Nonce → 401/403`, async ({ request }) => {
      const res = await getWithoutNonce(request, ep)
      expect([401, 403]).toContain(res.status())
    })
  }

  test('POST /wc/v3/orders 無 Nonce → 401/403', async ({ request }) => {
    const res = await postWithoutNonce(request, 'wc/v3/orders', {
      status: 'pending',
      billing: { first_name: 'NoAuth' },
    })
    expect([401, 403]).toContain(res.status())
  })

  test('POST /wc/v3/products 無 Nonce → 401/403', async ({ request }) => {
    const res = await postWithoutNonce(request, 'wc/v3/products', {
      name: '[E2E] NoAuth Product',
      type: 'simple',
      regular_price: '100',
    })
    expect([401, 403]).toContain(res.status())
  })
})

// ---------------------------------------------------------------------------
// 2. 無效 Nonce
// ---------------------------------------------------------------------------
test.describe('無效 Nonce', () => {
  test('GET /wc/v3/orders 使用假 Nonce → 401/403', async ({ request }) => {
    const res = await getWithFakeNonce(request, 'wc/v3/orders')
    expect([401, 403]).toContain(res.status())
    const body = await res.json()
    expect(['rest_cookie_invalid_nonce', 'woocommerce_rest_cannot_view']).toContain(body.code)
  })

  test('GET /wc/v3/products 使用假 Nonce → 401/403', async ({ request }) => {
    const res = await getWithFakeNonce(request, 'wc/v3/products')
    expect([401, 403]).toContain(res.status())
    const body = await res.json()
    expect(['rest_cookie_invalid_nonce', 'woocommerce_rest_cannot_view']).toContain(body.code)
  })

  test('POST /wc/v3/orders 使用假 Nonce → 401/403', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/wp-json/wc/v3/orders`, {
      headers: { 'X-WP-Nonce': 'invalid-nonce-12345', 'Content-Type': 'application/json' },
      data: { status: 'pending' },
    })
    expect([401, 403]).toContain(res.status())
    const body = await res.json()
    expect(['rest_cookie_invalid_nonce', 'woocommerce_rest_cannot_view', 'woocommerce_rest_cannot_create']).toContain(body.code)
  })
})

// ---------------------------------------------------------------------------
// 3. SQL 注入防護 — search 參數不應洩漏資料
// ---------------------------------------------------------------------------
test.describe('SQL 注入防護', () => {
  const sqlPayloads = [
    { label: 'OR 1=1', search: "' OR '1'='1" },
    { label: 'DROP TABLE', search: "'; DROP TABLE wp_posts;--" },
    { label: 'UNION SELECT', search: "' UNION SELECT * FROM wp_options--" },
  ]

  for (const { label, search } of sqlPayloads) {
    test(`orders?search=${label} 不洩漏內部資料`, async ({ request }) => {
      const res = await authedGet(request, 'wc/v3/orders', { search })
      // WC 正確地參數化查詢，應回傳 200 與空陣列
      expect(res.status()).toBe(200)
      const body = await res.json()
      expect(Array.isArray(body)).toBe(true)
      const bodyStr = JSON.stringify(body)
      expect(bodyStr).not.toContain('wp_posts')
      expect(bodyStr).not.toContain('wp_options')
      expect(bodyStr).not.toMatch(/SQL syntax|mysql_|mysqli_|SQLSTATE/)
    })

    test(`products?search=${label} 不洩漏內部資料`, async ({ request }) => {
      const res = await authedGet(request, 'wc/v3/products', { search })
      expect(res.status()).toBe(200)
      const body = await res.json()
      expect(Array.isArray(body)).toBe(true)
      const bodyStr = JSON.stringify(body)
      expect(bodyStr).not.toContain('wp_posts')
      expect(bodyStr).not.toContain('wp_options')
      expect(bodyStr).not.toMatch(/SQL syntax|mysql_|mysqli_|SQLSTATE/)
    })
  }
})

// ---------------------------------------------------------------------------
// 4. XSS 防護 — Stored XSS 應被清理或跳脫
// ---------------------------------------------------------------------------
test.describe('XSS 防護', () => {
  let createdOrderId: number | undefined
  let createdProductId: number | undefined

  test.afterEach(async ({ request }) => {
    const nonce = getNonce()
    const hdrs = { 'X-WP-Nonce': nonce, 'Content-Type': 'application/json' }
    if (createdOrderId) {
      await request.delete(`${BASE_URL}/wp-json/wc/v3/orders/${createdOrderId}?force=true`, {
        headers: hdrs,
      })
      createdOrderId = undefined
    }
    if (createdProductId) {
      await request.delete(`${BASE_URL}/wp-json/wc/v3/products/${createdProductId}?force=true`, {
        headers: hdrs,
      })
      createdProductId = undefined
    }
  })

  test('訂單備註含 <script> 標籤 — 觀察 WC 處理方式', async ({ request }) => {
    const xss = EDGE_CASE_STRINGS.xss
    const res = await authedPost(request, 'wc/v3/orders', {
      status: 'pending',
      billing: { first_name: '[E2E] XSS-Test' },
      customer_note: xss,
    })
    expect(res.status()).toBeLessThan(500)

    if (res.status() === 201) {
      const order = await res.json()
      createdOrderId = order.id
      // WC REST API 可能不會在 JSON 回應中清理 customer_note
      // 重要的是前端渲染時做跳脫（而非 API 層）
      // 驗證 API 不會因 XSS 字串而崩潰
      expect(order.id).toBeGreaterThan(0)
    }
  })

  test('商品名稱含 onerror 事件應被清理', async ({ request }) => {
    const xssName = EDGE_CASE_STRINGS.html // '<b>bold</b><img src=x onerror=alert(1)>'
    const res = await authedPost(request, 'wc/v3/products', {
      name: `[E2E] ${xssName}`,
      type: 'simple',
      regular_price: '100',
    })
    expect(res.status()).toBeLessThan(500)

    if (res.status() === 201) {
      const product = await res.json()
      createdProductId = product.id
      expect(String(product.name)).not.toContain('onerror=')
    }
  })
})

// ---------------------------------------------------------------------------
// 5. 極端 ID — 極大 ID 應回傳 404 而非崩潰
// ---------------------------------------------------------------------------
test.describe('極端 ID — 超大值', () => {
  const resources = ['wc/v3/orders', 'wc/v3/products', 'wc/v3/customers']
  const hugeId = 999999999

  for (const res of resources) {
    test(`GET /${res}/${hugeId} → 404`, async ({ request }) => {
      const response = await authedGet(request, `${res}/${hugeId}`)
      expect(response.status()).toBe(404)
    })
  }
})

// ---------------------------------------------------------------------------
// 6. 負數 ID — 應回傳 404 或 400
// ---------------------------------------------------------------------------
test.describe('極端 ID — 負數', () => {
  const resources = ['wc/v3/orders', 'wc/v3/products', 'wc/v3/customers']

  for (const res of resources) {
    test(`GET /${res}/-1 → 404 或 400`, async ({ request }) => {
      const response = await authedGet(request, `${res}/-1`)
      expect([400, 404]).toContain(response.status())
    })
  }
})
