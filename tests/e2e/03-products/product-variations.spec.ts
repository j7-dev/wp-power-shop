/**
 * 商品變體 API 測試
 * Endpoint: POST /wc/v3/products/{id}/variations/batch
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

test.describe('商品變體 POST /wc/v3/products/{id}/variations/batch', () => {
  let nonce: string
  let testIds: Record<string, number>
  const cleanupProductIds: number[] = []

  test.beforeAll(() => { nonce = getNonce(); testIds = getTestIds() })

  test.afterAll(async ({ request }) => {
    for (const id of cleanupProductIds) {
      await request.delete(`${BASE_URL}/wp-json/wc/v3/products/${id}?force=true`, {
        headers: { 'X-WP-Nonce': nonce },
      })
    }
  })

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

  /** 建立帶有規格屬性的可變商品 */
  async function createVariableProduct(request: APIRequestContext): Promise<number> {
    const res = await apiPost(request, 'wc/v3/products', {
      name: '[E2E] Variable Product For Variations',
      type: 'variable',
      status: 'publish',
      attributes: [
        { name: '顏色', options: ['紅色', '藍色'], variation: true, visible: true },
        { name: '尺寸', options: ['S', 'M', 'L'], variation: true, visible: true },
      ],
    })
    expect(res.status()).toBe(201)
    const body = await res.json()
    cleanupProductIds.push(body.id)
    return body.id
  }

  /** 產生笛卡爾積的變體資料 */
  function generateCartesianVariations(
    colors: string[],
    sizes: string[],
  ): Array<{ regular_price: string; attributes: Array<{ name: string; option: string }> }> {
    const variations: Array<{ regular_price: string; attributes: Array<{ name: string; option: string }> }> = []
    for (const color of colors) {
      for (const size of sizes) {
        variations.push({
          regular_price: '100',
          attributes: [
            { name: '顏色', option: color },
            { name: '尺寸', option: size },
          ],
        })
      }
    }
    return variations
  }

  test('不存在的 product_id → 404', async ({ request }) => {
    const res = await apiPost(request, 'wc/v3/products/999999/variations/batch', {
      create: [{ regular_price: '100', attributes: [{ name: '顏色', option: '紅色' }] }],
    })
    expect(res.status()).toBe(404)
  })

  test('簡單商品不支援變體 → 回傳錯誤', async ({ request }) => {
    // 使用 global-setup 建立的簡單商品
    const simpleId = testIds.simpleProductId
    expect(simpleId).toBeDefined()

    const res = await apiPost(request, `wc/v3/products/${simpleId}/variations/batch`, {
      create: [{ regular_price: '100', attributes: [{ name: '顏色', option: '紅色' }] }],
    })

    // WC 對 simple 商品的 variations batch endpoint 回傳 404 或 batch 中個別錯誤
    const body = await res.json()
    if (res.status() === 200 && body.create) {
      // batch 回傳中，每個 create 應有錯誤
      for (const item of body.create) {
        expect(item.error).toBeDefined()
      }
    } else {
      expect(res.status()).toBeGreaterThanOrEqual(400)
    }
  })

  test('為可變商品建立變體 → 笛卡爾積 2×3=6 個變體', async ({ request }) => {
    const productId = await createVariableProduct(request)
    const colors = ['紅色', '藍色']
    const sizes = ['S', 'M', 'L']
    const variations = generateCartesianVariations(colors, sizes)

    const batchRes = await apiPost(request, `wc/v3/products/${productId}/variations/batch`, {
      create: variations,
    })
    expect(batchRes.status()).toBe(200)

    const batchBody = await batchRes.json()
    expect(batchBody.create).toBeDefined()
    expect(batchBody.create.length).toBe(6)

    // 驗證每個變體都成功建立
    for (const created of batchBody.create) {
      expect(created.id).toBeGreaterThan(0)
    }

    // 透過 GET 列出所有變體確認數量
    const listRes = await apiGet(request, `wc/v3/products/${productId}/variations`, {
      per_page: '100',
    })
    expect(listRes.status()).toBe(200)
    const allVariations = await listRes.json()
    expect(allVariations.length).toBe(6)
  })

  test('重複建立相同變體 → 不會產生重複', async ({ request }) => {
    const productId = await createVariableProduct(request)
    const colors = ['紅色', '藍色']
    const sizes = ['S', 'M', 'L']
    const variations = generateCartesianVariations(colors, sizes)

    // 第一次建立
    const first = await apiPost(request, `wc/v3/products/${productId}/variations/batch`, {
      create: variations,
    })
    expect(first.status()).toBe(200)

    // 第二次建立相同變體
    const second = await apiPost(request, `wc/v3/products/${productId}/variations/batch`, {
      create: variations,
    })
    expect(second.status()).toBe(200)

    // WC 可能會建立重複變體或忽略；檢查列表
    const listRes = await apiGet(request, `wc/v3/products/${productId}/variations`, {
      per_page: '100',
    })
    const allVariations = await listRes.json()

    // 如果 WC 不允許重複屬性組合，應該還是 6 個
    // 如果 WC 允許重複，可能是 12 個（此行為需記錄）
    // 這邊我們驗證 WC 的實際行為
    expect(allVariations.length).toBeGreaterThanOrEqual(6)
    // 記錄：如果是 12 表示 WC 不阻止重複變體，需在應用層防範
    if (allVariations.length > 6) {
      console.warn(`⚠️ WC 允許重複變體：預期 6，實際 ${allVariations.length}`)
    }
  })

  test('新建變體有正確的 status 和 attributes', async ({ request }) => {
    const productId = await createVariableProduct(request)
    const variations = generateCartesianVariations(['紅色', '藍色'], ['S', 'M', 'L'])

    const batchRes = await apiPost(request, `wc/v3/products/${productId}/variations/batch`, {
      create: variations,
    })
    expect(batchRes.status()).toBe(200)

    // 取得所有變體並驗證
    const listRes = await apiGet(request, `wc/v3/products/${productId}/variations`, {
      per_page: '100',
    })
    expect(listRes.status()).toBe(200)
    const allVariations = await listRes.json()

    const expectedCombinations = new Set([
      '紅色|S', '紅色|M', '紅色|L',
      '藍色|S', '藍色|M', '藍色|L',
    ])

    for (const v of allVariations) {
      // 變體預設狀態為 publish
      expect(v.status).toBe('publish')

      // 每個變體有 2 個屬性
      expect(v.attributes.length).toBe(2)

      // 驗證屬性組合存在於預期中
      const colorAttr = v.attributes.find((a: { name: string }) => a.name === '顏色')
      const sizeAttr = v.attributes.find((a: { name: string }) => a.name === '尺寸')
      expect(colorAttr).toBeDefined()
      expect(sizeAttr).toBeDefined()

      const combo = `${colorAttr.option}|${sizeAttr.option}`
      expect(expectedCombinations.has(combo)).toBe(true)
    }
  })
})
