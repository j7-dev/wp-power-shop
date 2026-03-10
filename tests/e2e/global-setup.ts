/**
 * Global Setup — 在所有測試執行前：
 * 1. 注入 LC bypass（若需要）
 * 2. 管理員登入並儲存認證狀態
 * 3. 清理並建立測試資料
 */
import { chromium, type FullConfig } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'
import { applyLcBypass } from './helpers/lc-bypass.js'
import { loginAsAdmin, AUTH_FILE, NONCE_FILE } from './helpers/admin-setup.js'
import { wpPost, wpGet, wpDelete, type ApiOptions } from './helpers/api-client.js'
import { BASE_URL, TEST_PRODUCTS, TEST_CUSTOMERS } from './fixtures/test-data.js'

async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL || BASE_URL
  console.log(`\n🚀 E2E Global Setup — baseURL: ${baseURL}`)

  // Step 1: LC bypass
  try {
    applyLcBypass()
  } catch (e) {
    console.warn('LC bypass 跳過:', (e as Error).message)
  }

  // Step 2: 管理員登入
  const nonce = await loginAsAdmin(baseURL)
  console.log('✅ 管理員登入成功，nonce 已儲存')

  // Step 3: 建立測試資料
  const browser = await chromium.launch()
  const context = await browser.newContext({ storageState: AUTH_FILE })
  const opts: ApiOptions = { request: context.request, baseURL, nonce }

  try {
    // 清除舊的 E2E 測試資料
    await cleanTestData(opts)

    // 建立測試商品
    const simpleProduct = await wpPost<{ id: number }>(opts, 'wc/v3/products', {
      ...TEST_PRODUCTS.simple,
    })
    console.log(`✅ 建立 simple 商品: id=${simpleProduct.data.id}`)

    const variableProduct = await wpPost<{ id: number }>(opts, 'wc/v3/products', {
      ...TEST_PRODUCTS.variable,
    })
    console.log(`✅ 建立 variable 商品: id=${variableProduct.data.id}`)

    // 建立測試顧客
    const alice = await wpPost<{ id: number }>(opts, 'wc/v3/customers', {
      ...TEST_CUSTOMERS.alice,
    })
    console.log(`✅ 建立顧客 Alice: id=${alice.data.id}`)

    const bob = await wpPost<{ id: number }>(opts, 'wc/v3/customers', {
      ...TEST_CUSTOMERS.bob,
    })
    console.log(`✅ 建立顧客 Bob: id=${bob.data.id}`)

    // 建立測試訂單
    const order = await wpPost<{ id: number }>(opts, 'wc/v3/orders', {
      customer_id: alice.data.id,
      status: 'pending',
      billing: TEST_CUSTOMERS.alice.billing,
      line_items: [
        { product_id: simpleProduct.data.id, quantity: 1 },
      ],
    })
    console.log(`✅ 建立測試訂單: id=${order.data.id}`)

    // 建立測試分類
    const category = await wpPost<{ id: number }>(opts, 'wc/v3/products/categories', {
      name: '[E2E] 電子產品',
      slug: 'e2e-electronics',
    })
    console.log(`✅ 建立測試分類: id=${category.data.id}`)

    // 儲存測試資料 ID 供測試使用
    const testIds = {
      simpleProductId: simpleProduct.data.id,
      variableProductId: variableProduct.data.id,
      aliceId: alice.data.id,
      bobId: bob.data.id,
      orderId: order.data.id,
      categoryId: category.data.id,
    }
    fs.writeFileSync(
      path.resolve(import.meta.dirname, '.auth/test-ids.json'),
      JSON.stringify(testIds, null, 2),
    )
    console.log('✅ 測試資料 ID 已儲存')

  } catch (e) {
    console.error('❌ 測試資料建立失敗:', e)
    throw e
  } finally {
    await browser.close()
  }

  console.log('🎉 Global Setup 完成\n')
}

async function cleanTestData(opts: ApiOptions) {
  console.log('🧹 清理舊測試資料...')

  // 清理 E2E 訂單
  const orders = await wpGet<Array<{ id: number }>>(opts, 'wc/v3/orders', {
    search: 'E2E',
    per_page: '100',
  })
  for (const o of orders.data || []) {
    await wpDelete(opts, `wc/v3/orders/${o.id}?force=true`)
  }

  // 清理 E2E 商品
  for (const status of ['publish', 'draft', 'trash']) {
    const products = await wpGet<Array<{ id: number }>>(opts, 'wc/v3/products', {
      search: 'E2E',
      per_page: '100',
      status,
    })
    for (const p of products.data || []) {
      await wpDelete(opts, `wc/v3/products/${p.id}?force=true`)
    }
  }

  // 清理 E2E 顧客
  const customers = await wpGet<Array<{ id: number }>>(opts, 'wc/v3/customers', {
    search: 'e2e',
    per_page: '100',
  })
  for (const c of customers.data || []) {
    await wpDelete(opts, `wc/v3/customers/${c.id}?force=true`)
  }

  // 清理 E2E 分類
  const cats = await wpGet<Array<{ id: number; slug: string }>>(opts, 'wc/v3/products/categories', {
    per_page: '100',
  })
  for (const cat of cats.data || []) {
    if (cat.slug?.startsWith('e2e-')) {
      await wpDelete(opts, `wc/v3/products/categories/${cat.id}?force=true`)
    }
  }

  console.log('✅ 清理完成')
}

export default globalSetup
