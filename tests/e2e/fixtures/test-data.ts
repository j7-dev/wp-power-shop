/**
 * 測試常數與固定資料
 */

export const BASE_URL = process.env.WP_BASE_URL || 'http://localhost:8890'

/** WooCommerce 有效訂單狀態 */
export const VALID_ORDER_STATUSES = [
  'pending', 'processing', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed',
] as const

/** WooCommerce 有效商品類型 */
export const VALID_PRODUCT_TYPES = [
  'simple', 'variable', 'grouped', 'external',
] as const

/** 有效商品狀態 */
export const VALID_PRODUCT_STATUSES = ['publish', 'draft', 'trash'] as const

/** Dashboard KPI 有效 period */
export const VALID_KPI_PERIODS = ['today', 'week', 'month', 'year'] as const

/** 趨勢圖有效 interval */
export const VALID_TREND_INTERVALS = ['day', 'week', 'month', 'year'] as const

/** 營收分析有效 interval */
export const VALID_ANALYTICS_INTERVALS = ['day', 'week', 'month'] as const

/** 測試用商品資料 */
export const TEST_PRODUCTS = {
  simple: {
    name: '[E2E] MacBook Pro',
    type: 'simple' as const,
    regular_price: '59900',
    sku: 'E2E-MBP-001',
    status: 'publish' as const,
  },
  variable: {
    name: '[E2E] iPhone 15',
    type: 'variable' as const,
    status: 'publish' as const,
    attributes: [
      { name: '顏色', options: ['黑色', '白色'], variation: true, visible: true },
      { name: '容量', options: ['128GB', '256GB', '512GB'], variation: true, visible: true },
    ],
  },
}

/** 測試用顧客資料 */
export const TEST_CUSTOMERS = {
  alice: {
    email: 'e2e-alice@example.com',
    first_name: 'Alice',
    last_name: 'Wang',
    username: 'e2e-alice',
    billing: {
      first_name: 'Alice',
      last_name: 'Wang',
      address_1: '信義路五段7號',
      city: '台北',
      state: '',
      postcode: '110',
      country: 'TW',
      email: 'e2e-alice@example.com',
      phone: '0912345678',
    },
    shipping: {
      first_name: 'Alice',
      last_name: 'Wang',
      address_1: '信義路五段7號',
      city: '台北',
      state: '',
      postcode: '110',
      country: 'TW',
    },
  },
  bob: {
    email: 'e2e-bob@example.com',
    first_name: 'Bob',
    last_name: 'Chen',
    username: 'e2e-bob',
  },
}

/** 邊緣案例用特殊字串 */
export const EDGE_CASE_STRINGS = {
  xss: '<script>alert("xss")</script>',
  sqlInjection: "' OR '1'='1",
  unicode: '🎉 商品 título ✨',
  emoji: '🍎🍊🍋🍇🫐',
  rtl: 'مرحبا بالعالم',
  veryLong: 'A'.repeat(10000),
  empty: '',
  whitespace: '   ',
  html: '<b>bold</b><img src=x onerror=alert(1)>',
  nullByte: 'test\x00null',
}

/** 排行榜有效類型 */
export const VALID_LEADERBOARD_TYPES = ['product', 'customer'] as const
