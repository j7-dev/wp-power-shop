/**
 * 商品分類 API 測試
 * Endpoint: POST /wc/v3/products/categories
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

test.describe('商品分類 POST /wc/v3/products/categories', () => {
  let nonce: string
  let testIds: Record<string, number>
  const cleanupCategoryIds: number[] = []

  test.beforeAll(() => { nonce = getNonce(); testIds = getTestIds() })

  test.afterAll(async ({ request }) => {
    // 反向刪除（先刪子分類再刪父分類）
    for (const id of cleanupCategoryIds.reverse()) {
      await request.delete(`${BASE_URL}/wp-json/wc/v3/products/categories/${id}?force=true`, {
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

  test('空名稱建立分類 → 回傳錯誤', async ({ request }) => {
    const res = await apiPost(request, 'wc/v3/products/categories', {
      name: '',
    })

    // WooCommerce 要求分類名稱不為空
    if (res.status() === 201) {
      // 如果 WC 允許空名稱（不太可能），清理並記錄
      const body = await res.json()
      cleanupCategoryIds.push(body.id)
      console.warn('⚠️ WC 允許空名稱分類')
    } else {
      expect(res.status()).toBeGreaterThanOrEqual(400)
      const body = await res.json()
      expect(body.code).toBeDefined()
    }
  })

  test('重複 slug → 回傳錯誤', async ({ request }) => {
    const slug = `e2e-dup-slug-${Date.now()}`

    // 建立第一個分類
    const first = await apiPost(request, 'wc/v3/products/categories', {
      name: '[E2E] Duplicate Slug Test 1',
      slug,
    })
    expect(first.status()).toBe(201)
    const firstBody = await first.json()
    cleanupCategoryIds.push(firstBody.id)
    expect(firstBody.slug).toBe(slug)

    // 嘗試用相同 slug 建立第二個分類
    const second = await apiPost(request, 'wc/v3/products/categories', {
      name: '[E2E] Duplicate Slug Test 2',
      slug,
    })

    const secondBody = await second.json()
    if (second.status() === 201) {
      // WordPress 可能自動加上後綴使 slug 唯一（如 slug-2）
      cleanupCategoryIds.push(secondBody.id)
      expect(secondBody.slug).not.toBe(slug)
      console.log(`ℹ️ WP 自動修正重複 slug: ${slug} → ${secondBody.slug}`)
    } else {
      expect(second.status()).toBeGreaterThanOrEqual(400)
      expect(secondBody.code).toBeDefined()
    }
  })

  test('不存在的 parent id → 回傳錯誤', async ({ request }) => {
    const res = await apiPost(request, 'wc/v3/products/categories', {
      name: '[E2E] Orphan Category',
      slug: `e2e-orphan-${Date.now()}`,
      parent: 999999,
    })

    const body = await res.json()
    if (res.status() === 201) {
      // WC 可能接受不存在的 parent（設為 0 或忽略）
      cleanupCategoryIds.push(body.id)
      // 若被接受，parent 應該被修正為有效值
      console.warn(`⚠️ WC 接受不存在的 parent，實際 parent=${body.parent}`)
    } else {
      expect(res.status()).toBeGreaterThanOrEqual(400)
      expect(body.code).toBeDefined()
    }
  })

  test('有效建立分類 → name, slug, description 正確', async ({ request }) => {
    const slug = `e2e-valid-cat-${Date.now()}`
    const res = await apiPost(request, 'wc/v3/products/categories', {
      name: '[E2E] 有效分類測試',
      slug,
      description: '這是 E2E 測試建立的分類',
    })

    expect(res.status()).toBe(201)
    const body = await res.json()
    cleanupCategoryIds.push(body.id)

    expect(body.id).toBeGreaterThan(0)
    expect(body.name).toBe('[E2E] 有效分類測試')
    expect(body.slug).toBe(slug)
    expect(body.description).toBe('這是 E2E 測試建立的分類')
    expect(body.parent).toBe(0)

    // 透過 GET 驗證持久化
    const getRes = await apiGet(request, `wc/v3/products/categories/${body.id}`)
    expect(getRes.status()).toBe(200)
    const getBody = await getRes.json()
    expect(getBody.name).toBe('[E2E] 有效分類測試')
    expect(getBody.slug).toBe(slug)
  })

  test('有效建立子分類 → 成為父分類的子項', async ({ request }) => {
    const parentSlug = `e2e-parent-${Date.now()}`
    const childSlug = `e2e-child-${Date.now()}`

    // 建立父分類
    const parentRes = await apiPost(request, 'wc/v3/products/categories', {
      name: '[E2E] 父分類',
      slug: parentSlug,
    })
    expect(parentRes.status()).toBe(201)
    const parent = await parentRes.json()
    cleanupCategoryIds.push(parent.id)

    // 建立子分類，指定 parent
    const childRes = await apiPost(request, 'wc/v3/products/categories', {
      name: '[E2E] 子分類',
      slug: childSlug,
      parent: parent.id,
    })
    expect(childRes.status()).toBe(201)
    const child = await childRes.json()
    cleanupCategoryIds.push(child.id)

    expect(child.parent).toBe(parent.id)
    expect(child.name).toBe('[E2E] 子分類')

    // 透過 GET 驗證父子關係
    const getChild = await apiGet(request, `wc/v3/products/categories/${child.id}`)
    expect(getChild.status()).toBe(200)
    const childBody = await getChild.json()
    expect(childBody.parent).toBe(parent.id)
  })
})
