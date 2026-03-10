/**
 * 商品更新 API 測試
 * Endpoint: PUT /wc/v3/products/{id}
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

test.describe('商品更新 PUT /wc/v3/products/{id}', () => {
  let nonce: string
  let testIds: Record<string, number>
  let tempProductId: number

  test.beforeAll(() => { nonce = getNonce(); testIds = getTestIds() })

  async function apiGet(request: APIRequestContext, endpoint: string, params?: Record<string, string>) {
    const url = new URL(`${BASE_URL}/wp-json/${endpoint}`)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    return request.get(url.toString(), { headers: { 'X-WP-Nonce': nonce } })
  }
  async function apiPost(request: APIRequestContext, endpoint: string, data: Record<string, unknown>) {
    return request.post(`${BASE_URL}/wp-json/${endpoint}`, {
      headers: { 'X-WP-Nonce': nonce, 'Content-Type': 'application/json' }, data,
    })
  }
  async function apiPut(request: APIRequestContext, endpoint: string, data: Record<string, unknown>) {
    return request.put(`${BASE_URL}/wp-json/${endpoint}`, {
      headers: { 'X-WP-Nonce': nonce, 'Content-Type': 'application/json' }, data,
    })
  }
  async function apiDelete(request: APIRequestContext, endpoint: string) {
    return request.delete(`${BASE_URL}/wp-json/${endpoint}`, { headers: { 'X-WP-Nonce': nonce } })
  }

  /** 建立一個臨時商品供更新測試使用 */
  async function createTempProduct(request: APIRequestContext): Promise<number> {
    const res = await apiPost(request, 'wc/v3/products', {
      name: '[E2E] Save Test Product',
      type: 'simple',
      regular_price: '500',
      sku: `E2E-SAVE-${Date.now()}`,
      status: 'publish',
      manage_stock: false,
    })
    expect(res.status()).toBe(201)
    const body = await res.json()
    return body.id
  }

  test('不存在的 product_id (999999) → 404', async ({ request }) => {
    const res = await apiPut(request, 'wc/v3/products/999999', {
      name: 'Ghost Product',
    })
    expect(res.status()).toBe(404)
    const body = await res.json()
    expect(body.code).toBe('woocommerce_rest_product_invalid_id')
  })

  test('空名稱更新 → 觀察 WC 行為', async ({ request }) => {
    const productId = await createTempProduct(request)
    try {
      const res = await apiPut(request, `wc/v3/products/${productId}`, {
        name: '',
      })

      // WooCommerce 可能允許空名稱更新
      if (res.status() === 200) {
        const body = await res.json()
        // 空名稱會被 WC 接受，但商品名稱變為空字串
        expect(body.name).toBe('')
      } else {
        expect(res.status()).toBeGreaterThanOrEqual(400)
      }
    } finally {
      await apiDelete(request, `wc/v3/products/${productId}?force=true`)
    }
  })

  test('負數 regular_price → 觀察 WC 行為（字串儲存）', async ({ request }) => {
    const productId = await createTempProduct(request)
    try {
      const res = await apiPut(request, `wc/v3/products/${productId}`, {
        regular_price: '-100',
      })

      // WooCommerce 將價格視為字串，可能接受負數
      const body = await res.json()
      if (res.status() === 200) {
        // WC 可能儲存為字串 "-100" 或清空
        expect(typeof body.regular_price).toBe('string')
      } else {
        expect(res.status()).toBeGreaterThanOrEqual(400)
      }
    } finally {
      await apiDelete(request, `wc/v3/products/${productId}?force=true`)
    }
  })

  test('sale_price > regular_price → 觀察 WC 行為', async ({ request }) => {
    const productId = await createTempProduct(request)
    try {
      const res = await apiPut(request, `wc/v3/products/${productId}`, {
        regular_price: '100',
        sale_price: '200',
      })

      const body = await res.json()
      if (res.status() === 200) {
        // WC 可能靜默接受，或者忽略不合理的促銷價
        expect(body.regular_price).toBe('100')
        // 記錄實際行為供開發者參考
        expect(typeof body.sale_price).toBe('string')
      } else {
        expect(res.status()).toBeGreaterThanOrEqual(400)
      }
    } finally {
      await apiDelete(request, `wc/v3/products/${productId}?force=true`)
    }
  })

  test('date_on_sale_to 早於 date_on_sale_from → 觀察 WC 行為', async ({ request }) => {
    const productId = await createTempProduct(request)
    try {
      const res = await apiPut(request, `wc/v3/products/${productId}`, {
        sale_price: '50',
        regular_price: '100',
        date_on_sale_from: '2025-12-31T00:00:00',
        date_on_sale_to: '2025-01-01T00:00:00',
      })

      const body = await res.json()
      if (res.status() === 200) {
        // WC 通常不驗證日期範圍，直接儲存
        expect(body).toHaveProperty('date_on_sale_from')
        expect(body).toHaveProperty('date_on_sale_to')
      } else {
        expect(res.status()).toBeGreaterThanOrEqual(400)
      }
    } finally {
      await apiDelete(request, `wc/v3/products/${productId}?force=true`)
    }
  })

  test('manage_stock=true + 負數 stock_quantity → 觀察 WC 行為', async ({ request }) => {
    const productId = await createTempProduct(request)
    try {
      const res = await apiPut(request, `wc/v3/products/${productId}`, {
        manage_stock: true,
        stock_quantity: -5,
      })

      const body = await res.json()
      if (res.status() === 200) {
        expect(body.manage_stock).toBe(true)
        // WC 允許負庫存
        expect(body.stock_quantity).toBe(-5)
      } else {
        expect(res.status()).toBeGreaterThanOrEqual(400)
      }
    } finally {
      await apiDelete(request, `wc/v3/products/${productId}?force=true`)
    }
  })

  test('有效更新 name, sku, regular_price, status → 欄位正確更新', async ({ request }) => {
    const productId = await createTempProduct(request)
    const newSku = `E2E-UPDATED-${Date.now()}`
    try {
      const res = await apiPut(request, `wc/v3/products/${productId}`, {
        name: '[E2E] Updated Product Name',
        sku: newSku,
        regular_price: '999',
        status: 'draft',
      })

      expect(res.status()).toBe(200)
      const body = await res.json()
      expect(body.name).toBe('[E2E] Updated Product Name')
      expect(body.sku).toBe(newSku)
      expect(body.regular_price).toBe('999')
      expect(body.status).toBe('draft')

      // 透過 GET 再次驗證資料已持久化
      const getRes = await apiGet(request, `wc/v3/products/${productId}`, { status: 'draft' })
      expect(getRes.status()).toBe(200)
      const getBody = await getRes.json()
      expect(getBody.name).toBe('[E2E] Updated Product Name')
      expect(getBody.sku).toBe(newSku)
      expect(getBody.regular_price).toBe('999')
    } finally {
      await apiDelete(request, `wc/v3/products/${productId}?force=true`)
    }
  })

  test('stock_quantity=0 + backorders=no → stock_status 自動設為 outofstock', async ({ request }) => {
    const productId = await createTempProduct(request)
    try {
      const res = await apiPut(request, `wc/v3/products/${productId}`, {
        manage_stock: true,
        stock_quantity: 0,
        backorders: 'no',
      })

      expect(res.status()).toBe(200)
      const body = await res.json()
      expect(body.manage_stock).toBe(true)
      expect(body.stock_quantity).toBe(0)
      expect(body.backorders).toBe('no')
      expect(body.stock_status).toBe('outofstock')
    } finally {
      await apiDelete(request, `wc/v3/products/${productId}?force=true`)
    }
  })
})
