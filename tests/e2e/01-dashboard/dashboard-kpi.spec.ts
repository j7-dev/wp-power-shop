import { test, expect, APIRequestContext } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

const BASE_URL = process.env.WP_BASE_URL || 'http://localhost:8890'
const ENDPOINT = 'power-shop/reports/dashboard/stats'

function getNonce(): string {
  return fs.readFileSync(path.resolve(import.meta.dirname, '../.auth/nonce.txt'), 'utf-8').trim()
}

function getTestIds(): Record<string, number> {
  return JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../.auth/test-ids.json'), 'utf-8'))
}

test.describe('Dashboard KPI 統計', () => {
  let nonce: string
  let testIds: Record<string, number>

  test.beforeAll(() => {
    nonce = getNonce()
    testIds = getTestIds()
  })

  async function apiGet(request: APIRequestContext, params?: Record<string, string>) {
    const url = new URL(`${BASE_URL}/wp-json/${ENDPOINT}`)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    return request.get(url.toString(), {
      headers: { 'X-WP-Nonce': nonce },
    })
  }

  // ─── 回應結構驗證：標準信封格式 ───

  test('回應應包含標準信封格式 (code, message, data)', async ({ request }) => {
    const res = await apiGet(request, { period: 'month' })

    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body).toHaveProperty('code', 'get_reports_dashboard_stats_callback')
    expect(body).toHaveProperty('message', 'success')
    expect(body).toHaveProperty('data')
  })

  // ─── KPI 當期欄位驗證 ───

  test('查詢 period=month 時 data 應包含所有 KPI 當期欄位', async ({ request }) => {
    const res = await apiGet(request, { period: 'month' })

    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    const data = body.data

    const currentFields = [
      'total_sales',
      'new_registration',
      'orders_count_unshipped',
      'orders_count_unpaid',
    ]
    for (const field of currentFields) {
      expect(data, `缺少 KPI 當期欄位: ${field}`).toHaveProperty(field)
      expect(typeof data[field]).toBe('number')
    }
  })

  // ─── KPI 比較期欄位驗證 ───

  test('查詢 period=month 時 data 應包含所有 KPI 比較期欄位', async ({ request }) => {
    const res = await apiGet(request, { period: 'month' })

    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    const data = body.data

    const comparedFields = [
      'total_sales_compared',
      'new_registration_compared',
      'orders_count_unshipped_compared',
      'orders_count_unpaid_compared',
    ]
    for (const field of comparedFields) {
      expect(data, `缺少 KPI 比較期欄位: ${field}`).toHaveProperty(field)
      expect(typeof data[field]).toBe('number')
    }
  })

  // ─── 排行榜資料驗證 ───

  test('data 應包含 products 與 customers 排行榜陣列', async ({ request }) => {
    const res = await apiGet(request, { period: 'month' })

    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    const data = body.data

    expect(Array.isArray(data.products)).toBeTruthy()
    expect(Array.isArray(data.customers)).toBeTruthy()
  })

  // ─── intervals 時序資料驗證 ───

  test('data.intervals 應為陣列且每筆包含完整時序欄位', async ({ request }) => {
    const res = await apiGet(request, { period: 'month' })

    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    const intervals: unknown[] = body.data.intervals

    expect(Array.isArray(intervals)).toBeTruthy()

    if (intervals.length > 0) {
      const requiredFields = [
        'net_revenue',
        'avg_order_value',
        'orders_count',
        'avg_items_per_order',
        'num_items_sold',
        'coupons',
        'coupons_count',
        'total_customers',
        'total_sales',
        'refunds',
        'shipping',
        'gross_sales',
        'segments',
        'interval',
        'date_start',
        'date_start_gmt',
        'date_end',
        'date_end_gmt',
      ]
      const first = intervals[0] as Record<string, unknown>
      for (const field of requiredFields) {
        expect(first, `interval 項目缺少欄位: ${field}`).toHaveProperty(field)
      }
    }
  })

  // ─── 各 period 值正常回傳 ───

  const validPeriods = ['today', 'week', 'month', 'year']

  for (const period of validPeriods) {
    test(`查詢 period="${period}" 應成功回傳 200`, async ({ request }) => {
      const res = await apiGet(request, { period })

      expect(res.ok()).toBeTruthy()
      const body = await res.json()
      expect(body.code).toBe('get_reports_dashboard_stats_callback')
      expect(body.data).toBeDefined()
    })
  }

  // ─── API 不驗證 period 值：任意值仍回傳 200 ───

  test('傳入非規格 period 值時 API 仍回傳 200（無伺服端驗證）', async ({ request }) => {
    const res = await apiGet(request, { period: 'daily' })

    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.code).toBe('get_reports_dashboard_stats_callback')
    expect(body.data).toBeDefined()
  })

  // ─── 自訂日期區間查詢 ───

  test('使用 date_from 與 date_to 查詢應成功回傳', async ({ request }) => {
    const res = await apiGet(request, {
      date_from: '2024-01-01',
      date_to: '2024-01-31',
    })

    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.code).toBe('get_reports_dashboard_stats_callback')
    expect(body.data).toHaveProperty('total_sales')
    expect(body.data).toHaveProperty('intervals')
  })

  // ─── 同時提供 period 與日期區間仍正常回傳 ───

  test('同時提供 period 與 date_from/date_to 時 API 仍正常回傳（無互斥驗證）', async ({ request }) => {
    const res = await apiGet(request, {
      period: 'month',
      date_from: '2024-01-01',
      date_to: '2024-01-31',
    })

    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.code).toBe('get_reports_dashboard_stats_callback')
    expect(body.data).toBeDefined()
  })
})
