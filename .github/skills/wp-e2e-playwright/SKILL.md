---
name: wp-e2e-playwright
description: WordPress plugin E2E 測試，使用 Playwright + wp-env。涵蓋 LC 繞過、WooCommerce 結帳、REST API 輔助工具、global setup/teardown、CI 工作流程，以及三階段方法（Admin SPA → Frontend → Integration）。適用於任何 WordPress/WooCommerce plugin 的 E2E 測試建置。
---

# WordPress Plugin E2E 測試（Playwright）

使用 Playwright 與 `@wordpress/env` 建立完整 WordPress Plugin E2E 測試套件的實戰模式。

## 適用情境

- 為 WordPress 或 WooCommerce plugin 建立 E2E 測試
- 從零開始設定 `wp-env` + Playwright
- 為測試實作 license check（LC）繞過
- 建立 WooCommerce 結帳流程測試
- 為 WordPress E2E 設定 GitHub Actions CI
- 排查 Docker + Windows PATH 問題

---

## 架構總覽

```
project-root/
├── .wp-env.json                    # WordPress 環境設定
├── plugin.php                      # Plugin 進入點（LC bypass 目標）
├── plugin.php.e2e-backup           # 自動建立的備份（已加入 gitignore）
├── tests/
│   └── e2e/
│       ├── package.json            # 獨立的 npm 相依套件（非 pnpm）
│       ├── playwright.config.ts    # 3 個 project：admin、frontend、integration
│       ├── global-setup.ts         # LC bypass + 登入 + REST API 資料準備
│       ├── global-teardown.ts      # 從備份還原 plugin.php
│       ├── helpers/
│       │   ├── lc-bypass.ts        # plugin.php 注入與還原
│       │   ├── admin-page.ts       # Admin SPA HashRouter 導航
│       │   ├── api-client.ts       # REST API CRUD（WP + WC + plugin）
│       │   ├── frontend-setup.ts   # 登入特定使用者 + 測試資料
│       │   └── wc-checkout.ts      # WooCommerce 結帳自動化
│       ├── fixtures/
│       │   └── test-data.ts        # 常數定義（名稱、選擇器、URL）
│       ├── 01-admin/               # Admin SPA 測試
│       ├── 02-frontend/            # PHP 模板測試
│       └── 03-integration/         # 跨模組流程測試
└── .github/workflows/ci.yml        # 含 E2E Job 的 CI 設定
```

---

## 關鍵設計決策

### 1. 使用獨立 npm（非 pnpm）管理 E2E 相依套件

**問題：** Monorepo 的 `workspace:*` 相依套件在 CI 獨立 checkout 時會失敗。Windows NTFS junction 在 pnpm 中會造成「untrusted mount point」錯誤。

**解法：** `tests/e2e/package.json` 使用 npm，完全獨立於 monorepo：

```json
{
  "private": true,
  "type": "module",
  "dependencies": {
    "@playwright/test": "^1.52.0",
    "@wordpress/e2e-test-utils-playwright": "^1.18.0",
    "@wordpress/env": "^11.1.0"
  }
}
```

### 2. wp-env 必須從專案根目錄執行

`wp-env` 從當前工作目錄讀取 `.wp-env.json`，務必從專案根目錄執行：

```bash
# ✅ 正確 — 從專案根目錄執行
./tests/e2e/node_modules/.bin/wp-env start

# ❌ 錯誤 — 從 tests/e2e/ 執行
npx wp-env start  # 找不到 .wp-env.json
```

### 3. 測試中不使用 WP CLI — 改用純 REST API

**問題：** Windows 上的 Node.js `PATH` 不包含 Docker。`execSync('npx wp-env run cli ...')` 會失敗。

**解法：** 所有資料準備改用 `global-setup.ts` 中的 WordPress REST API：

```typescript
// ✅ 使用 REST API
const response = await request.get(`${BASE}/wp-json/wp/v2/posts`);

// ❌ 不要在測試中使用 execSync
execSync('npx wp-env run cli wp post list');  // Windows 上會失敗
```

### 4. Workers 必須設為 1

WordPress 共用單一資料庫 session。平行 worker 會造成競爭條件：

```typescript
export default defineConfig({
  workers: 1,
  fullyParallel: false,
});
```

---

## LC Bypass 模式

適用於有 license check 而無法直接測試的 plugin：

### lc-bypass.ts

```typescript
import fs from 'fs'
import path from 'path'

const PLUGIN_FILE = path.resolve(__dirname, '../../../plugin.php')
const BACKUP_FILE = PLUGIN_FILE + '.e2e-backup'
const MARKER = "/* E2E-LC-BYPASS */"
const INJECTION = `$args['lc'] = false; ${MARKER}`

export function applyLcBypass(): void {
  const content = fs.readFileSync(PLUGIN_FILE, 'utf-8')
  if (content.includes(MARKER)) return // 已套用，略過

  fs.copyFileSync(PLUGIN_FILE, BACKUP_FILE)

  // 找到啟動 hook 的位置並在之前注入
  const needle = "Plugin::instance(\$args);"
  const idx = content.indexOf(needle)
  if (idx === -1) throw new Error('找不到注入點')

  const modified = content.slice(0, idx) + INJECTION + '\n' + content.slice(idx)
  fs.writeFileSync(PLUGIN_FILE, modified, 'utf-8')
}

export function revertLcBypass(): void {
  if (fs.existsSync(BACKUP_FILE)) {
    fs.copyFileSync(BACKUP_FILE, PLUGIN_FILE)
    fs.unlinkSync(BACKUP_FILE)
  }
}
```

### .gitignore 設定

```gitignore
plugin.php.e2e-backup
tests/e2e/.auth/
tests/e2e/test-results/
tests/e2e/playwright-report/
```

---

## Global Setup 模式

```typescript
// global-setup.ts
import { chromium, FullConfig } from '@playwright/test'
import { applyLcBypass } from './helpers/lc-bypass'

async function globalSetup(config: FullConfig) {
  const BASE = config.projects[0].use.baseURL!

  // 1. 套用 LC bypass
  applyLcBypass()

  // 2. 登入並儲存 storage state
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(`${BASE}/wp-login.php`)
  await page.fill('#user_login', 'admin')
  await page.fill('#user_pass', 'password')
  await page.click('#wp-submit')
  await page.waitForURL('**/wp-admin/**')
  await page.context().storageState({ path: '.auth/admin.json' })

  // 3. 刷新 rewrite rules（造訪永久連結設定頁）
  await page.goto(`${BASE}/wp-admin/options-permalink.php`)
  await page.click('#submit')
  await page.waitForLoadState('networkidle')

  // 4. 透過 REST API 清除舊測試資料
  const request = await page.context().request
  // 刪除含 E2E 前綴的舊課程、章節、使用者...

  // 5. 建立新的測試資料
  // 使用 REST API 建立課程、章節、使用者...

  await browser.close()
}

export default globalSetup
```

---

## REST API Client 模式

```typescript
// helpers/api-client.ts
import { APIRequestContext } from '@playwright/test'

type ApiOptions = {
  request: APIRequestContext
  baseURL: string
  nonce: string
}

export async function wpGet<T>(
  opts: ApiOptions, endpoint: string, params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${opts.baseURL}/wp-json/${endpoint}`)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await opts.request.get(url.toString(), {
    headers: { 'X-WP-Nonce': opts.nonce },
  })
  if (!res.ok()) throw new Error(`GET ${endpoint} → ${res.status()}`)
  return res.json()
}

export async function wpPost<T>(
  opts: ApiOptions, endpoint: string, data: Record<string, unknown>
): Promise<T> {
  const res = await opts.request.post(`${opts.baseURL}/wp-json/${endpoint}`, {
    headers: { 'X-WP-Nonce': opts.nonce },
    data,
  })
  if (!res.ok()) throw new Error(`POST ${endpoint} → ${res.status()}`)
  return res.json()
}
```

### Nonce 提取方式

```typescript
// 從任何 wp-admin 頁面提取 nonce
async function extractNonce(page: Page): Promise<string> {
  await page.goto(`${BASE}/wp-admin/`)
  const nonce = await page.evaluate(() => {
    return (window as any).wpApiSettings?.nonce
      || document.querySelector('meta[name="wp-nonce"]')?.getAttribute('content')
      || ''
  })
  if (!nonce) throw new Error('無法取得 WP nonce')
  return nonce
}
```

---

## WooCommerce 結帳輔助工具

```typescript
// helpers/wc-checkout.ts

export async function addToCartAndCheckout(page: Page, productUrl: string) {
  // 前往商品頁
  await page.goto(productUrl)
  await page.click('button[name="add-to-cart"], .single_add_to_cart_button')
  await page.waitForURL('**/cart/**')

  // 前往結帳頁
  await page.goto(`${BASE}/checkout/`)

  // 填寫帳單資訊（BACS 最低需求）
  await page.fill('#billing_first_name', 'Test')
  await page.fill('#billing_last_name', 'User')
  await page.fill('#billing_email', 'test@example.com')
  await page.fill('#billing_phone', '0912345678')

  // 選擇 BACS 付款
  await page.click('#payment_method_bacs')
  await page.click('#place_order')

  // 等待訂單完成頁
  await page.waitForURL('**/order-received/**')

  // 從 URL 提取訂單編號（相容 WC 9.x）
  const url = page.url()
  const match = url.match(/order-received\/(\d+)/)
  return match ? parseInt(match[1]) : null
}

// 透過 REST API 完成訂單（管理員標記為已完成）
export async function completeOrder(opts: ApiOptions, orderId: number) {
  return wpPost(opts, `wc/v3/orders/${orderId}`, {
    status: 'completed',
  })
}
```

---

## Playwright 設定（3 個 Project）

```typescript
export default defineConfig({
  testDir: '.',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,

  timeout: 30_000,
  expect: { timeout: 5_000 },

  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',

  use: {
    baseURL: process.env.WP_BASE_URL || 'http://localhost:8889',
    storageState: '.auth/admin.json',
    locale: 'zh-TW',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    {
      name: 'admin',
      testDir: './01-admin',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'frontend',
      testDir: './02-frontend',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'integration',
      testDir: './03-integration',
      timeout: 120_000,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
```

---

## 三階段測試方法

### Phase 1：Admin SPA 測試

測試 React 管理後台（HashRouter `/#/route`）：

```typescript
// 導航至 Admin SPA 頁面
async function gotoAdminPage(page: Page, hash: string) {
  await page.goto(`/wp-admin/admin.php?page=power-course#${hash}`)
  await page.waitForSelector('.ant-pro-table, .ant-card, .ant-form', {
    timeout: 15_000,
  })
}
```

**測試重點：**
- 頁面載入無 console 錯誤
- ProTable 正確渲染資料列
- CRUD 操作（新增、編輯、刪除）
- 分頁導航與表單送出
- 設定頁面儲存與讀取

### Phase 2：Frontend 模板測試

測試已登入使用者的 PHP 渲染頁面：

```typescript
// 以特定角色登入
async function loginAs(page: Page, username: string, password: string) {
  await page.goto('/wp-login.php')
  await page.fill('#user_login', username)
  await page.fill('#user_pass', password)
  await page.click('#wp-submit')
  await page.waitForURL('**/wp-admin/**')
}
```

**測試重點：**
- 課程商品頁渲染（定價、講師資訊、章節列表）
- 教室頁面（影片播放器、章節列表、進度記錄）
- 存取拒絕頁面（未購買、已過期、未開放）
- 我的帳號課程列表

### Phase 3：整合測試

跨模組的端對端流程：

**測試重點：**
- 購買 → 存取授予 → 教室 → 進度追蹤
- 到期日類型（無限期、時間戳記、訂閱制）
- 存取控制（授予 / 撤銷 / 過期）
- 角色權限（管理員 vs 訂閱者 vs 訪客）
- Plugin 相依性（所有 plugin 共存）
- PHP 錯誤掃描（各頁面無 fatal error）

---

## GitHub Actions CI 工作流程

```yaml
e2e:
  runs-on: ubuntu-latest
  timeout-minutes: 60
  steps:
    - uses: actions/checkout@v4

    - uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: 安裝 E2E 相依套件
      run: npm ci
      working-directory: tests/e2e

    - name: 快取 Playwright 瀏覽器
      uses: actions/cache@v4
      with:
        path: ~/.cache/ms-playwright
        key: pw-${{ runner.os }}-${{ hashFiles('tests/e2e/package-lock.json') }}

    - name: 安裝 Playwright chromium
      run: npx playwright install --with-deps chromium
      working-directory: tests/e2e

    - name: 快取 wp-env
      uses: actions/cache@v4
      with:
        path: ~/.wp-env
        key: wp-env-${{ runner.os }}-${{ hashFiles('.wp-env.json') }}

    - name: 啟動 wp-env
      run: ./tests/e2e/node_modules/.bin/wp-env start

    - name: 執行 E2E 測試
      run: npx playwright test
      working-directory: tests/e2e

    - name: 上傳測試產出物
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: playwright-report
        path: |
          tests/e2e/playwright-report/
          tests/e2e/test-results/

    - name: 還原 plugin.php
      if: always()
      run: |
        if [ -f plugin.php.e2e-backup ]; then
          cp plugin.php.e2e-backup plugin.php
        fi

    - name: 停止 wp-env
      if: always()
      run: ./tests/e2e/node_modules/.bin/wp-env stop
```

---

## 舊資料清除模式

WordPress 刪除的文章會保留在垃圾桶中。相同 slug 的舊章節會被加上 `-2` 後綴。**Setup 時務必強制刪除：**

```typescript
// 建立新測試資料前，清除所有自訂文章類型
async function cleanOldChapters(request: APIRequestContext, nonce: string, base: string) {
  for (const status of ['publish', 'draft', 'trash', 'pending', 'private']) {
    const posts = await request.get(
      `${base}/wp-json/wp/v2/pc_chapter?status=${status}&per_page=100`,
      { headers: { 'X-WP-Nonce': nonce } }
    )
    const items = await posts.json()
    for (const p of items) {
      await request.delete(
        `${base}/wp-json/wp/v2/pc_chapter/${p.id}?force=true`,
        { headers: { 'X-WP-Nonce': nonce } }
      )
    }
  }
}
```

---

## Windows 特有問題

### Docker PATH

Windows Docker Desktop 不會自動加入系統 PATH。每次 PowerShell session 需手動設定：

```powershell
$env:PATH = "C:\Program Files\Docker\Docker\resources\bin;" + $env:PATH
```

### PowerShell 語法

串接含 `$env:` 變數的指令時，使用分號而非 `&&`：

```powershell
# ✅ 正確
$env:PATH = "..."; cd project; npx wp-env start

# ❌ 錯誤 — 會造成 ParserError
$env:PATH = "..." && cd project
```

### pnpm NTFS Junction

Windows 上所有 pnpm junction 都會回傳「untrusted mount point」。E2E 相依套件改用 npm。

---

## 疑難排解清單

| 症狀 | 原因 | 解法 |
|------|------|------|
| `Cannot connect to Docker` | Docker 未啟動 | 啟動 Docker Desktop |
| `wp-env: command not found` | wp-env 未安裝 | 在 `tests/e2e/` 執行 `npm install` |
| global-setup 中出現 `spawn UNKNOWN` | 在 global-setup 使用 execSync 與 Docker | 改用 REST API 呼叫 |
| 章節 URL 回傳 404 | Rewrite rules 未刷新 | 在 setup 中造訪永久連結設定頁 |
| `parent_course_id` 遺失 | 上次執行殘留的舊章節 | 強制刪除所有 pc_chapter 文章 |
| 訂單編號提取失敗 | WC 9.x 更改了 DOM 結構 | 從 URL 提取，不從 DOM 提取 |
| DaisyUI modal 按鈕不可見 | `opacity-0` CSS class | 改用 `page.keyboard.press('Escape')` |
| CI 上測試不穩定 | 缺少 `waitForLoadState` | 補充 `networkidle` 或選擇器等待 |

---

## 最佳實踐總結

1. **獨立相依套件** — 在 `tests/e2e/` 使用 npm，絕不與 monorepo 的 pnpm 混用
2. **REST API 建立資料** — 絕不在測試程式碼中使用 WP CLI 或 execSync
3. **強制清除** — 建立新資料前刪除所有狀態（publish、draft、trash）
4. **從 URL 提取** — 從 URL 提取訂單編號，不從 DOM 提取
5. **LC bypass 安全** — 備份、注入、並在 CI 的 `if: always()` 中還原
6. **三階段拆分** — Admin（30s）/ Frontend（30s）/ Integration（120s）
7. **單一 worker** — WordPress 無法處理平行 session
8. **從 wp-admin 取得 Nonce** — 管理員登入後提取 `wpApiSettings.nonce`
9. **刷新 Rewrite** — Global setup 中務必造訪永久連結設定頁
10. **冪等測試** — 每個測試自行建立資料，執行後自行清除
