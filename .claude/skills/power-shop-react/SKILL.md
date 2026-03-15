---
name: power-shop-react
description: Power Shop React 前端開發專家。精通 Refine + Ant Design CRUD 應用、6 Data Provider 系統、HashRouter 路由、商品編輯器多 Tab 系統。當修改前端頁面、元件、hooks 或資料流時啟用。
metadata:
  domain: power-shop-react-frontend
  version: "1.0"
compatibility: "React 18, Refine v4, Ant Design v5, Vite"
---

# Power Shop — React 前端開發指南

## When to Activate

在以下情境啟用此 SKILL：
- 新增或修改前端頁面
- 開發新元件或修改現有元件
- 調整 hooks、資料流或狀態管理
- 使用 Refine Data Provider 存取 API
- 修改路由設定
- 商品編輯器相關開發
- Dashboard / Analytics 頁面開發

---

## 前端架構概覽

```
main.tsx
  └→ ReactDOM.createRoot(#power_shop)
      └→ <App1 />
          ├→ <Refine dataProvider={6 providers}>
          ├→ <HashRouter>  → 路由系統
          └→ <ConfigProvider>  → Ant Design 主題
```

### 技術堆疊

| 層級 | 技術 |
|------|------|
| UI | React 18 + Ant Design v5 |
| Meta-framework | Refine v4 |
| 路由 | HashRouter |
| 狀態 | Jotai + React Context + React Query |
| 樣式 | Tailwind CSS (`tw-` prefix) |
| 打包 | Vite (port 5178) |
| 共用套件 | `antd-toolkit`、`antd-toolkit/refine`、`antd-toolkit/wp` |

---

## Data Provider 設定

Power Shop 配置 **6 個 Data Provider**：

| Key | 來源 | 用途 |
|-----|------|------|
| `'default'` | Powerhouse core | posts、media |
| `'wc-rest'` | WooCommerce REST v3 | products、orders、customers |
| `'wc-store'` | WooCommerce Store API | cart、checkout |
| `'power-shop'` | 自有 REST API | Dashboard、Analytics、顧客備註 |
| `'wp-rest'` | WordPress REST API v2 | users、UserMeta |
| `'bunny-stream'` | Bunny.net | 影片操作 |

**規則：** 每次使用 Refine hook 必須明確指定 `dataProviderName`。禁止直接用 `fetch`/`axios`。

> 完整設定與使用範例：`references/data-providers.md`

---

## 頁面開發 SOP

### Step 1 — 建立頁面元件

```tsx
// js/src/pages/admin/<Section>/index.tsx
import { memo } from 'react'

/** 我的頁面 */
const MyPageComponent = () => {
  return <div>我的頁面</div>
}

export const MyPage = memo(MyPageComponent)
```

### Step 2 — 匯出頁面

從 `js/src/pages/admin/index.tsx` 匯出。

### Step 3 — 註冊 Resource

```tsx
// js/src/resources/index.tsx
{
  name: 'my-resource',
  list: '/my-path',
  meta: { label: '我的頁面', icon: <SomeIcon /> },
}
```

### Step 4 — 新增路由

```tsx
// js/src/App1.tsx
<Route path="my-path">
  <Route index element={<MyPage />} />
</Route>
```

### Step 5 — 驗證

```bash
pnpm lint
npx tsc --noEmit
```

---

## 元件開發慣例

1. **Functional components only** — 禁止 class components。
2. **`memo()`** — 頁面級和重型元件必用。
3. **`@/` alias** — import 路徑對應 `js/src/`。
4. **繁體中文** — JSDoc 註解與 UI 文字。
5. **Ant Design v5** — 遵循 ConfigProvider theme token。

### 雙 Context 模式（Edit 頁面）

Orders Edit 和 Users Edit 使用：

```tsx
<IsEditingContext.Provider value={isEditing}>
  <RecordContext.Provider value={record}>
    <Edit><Form><Detail /></Form></Edit>
  </RecordContext.Provider>
</IsEditingContext.Provider>
```

### Jotai（跨分頁選取）

```
頁面切換 → useEffect 同步 → Jotai atom 更新 → BulkAction 讀取
```

---

## 商品編輯器系統

### 多 Tab 架構（8 個 Tab）

| Tab | Partials | 條件 |
|-----|----------|------|
| 描述 | `basic`, `detail` | — |
| 價格 | `price` | `grouped`/`variable` 隱藏 |
| 庫存 | `stock` | — |
| 規格 | `attribute` | 儲存按鈕停用 |
| 變體 | `variation` | 僅 `variable`/`subscription_variable` |
| 進階 | `sales`, `size`, `subscription` | — |
| 關聯 | `taxonomy` | — |
| 分析 | — | 儲存按鈕停用 |

### Partials 請求

```tsx
const { formProps } = useForm<TProductRecord>({
  action: 'edit',
  resource: 'products',
  id,
  dataProviderName: 'wc-rest',
  queryMeta: {
    variables: {
      partials: ['basic', 'detail', 'price', 'stock', 'taxonomy'],
      meta_keys: [],
    },
  },
})
```

### 虛擬表格

變體表格使用虛擬列表渲染，繞過 `Form.getFieldsValue`，手動管理狀態。

> 完整說明：`references/product-editor.md`

---

## Dashboard 開發

### useDashboard Hook Pattern

```tsx
import { useCustom, useApiUrl } from '@refinedev/core'
import { TDashboardStats } from './types'

const apiUrl = useApiUrl('power-shop')
const { data, isLoading } = useCustom<TDashboardStats>({
  url: `${apiUrl}/reports/dashboard/stats`,
  method: 'get',
  config: { query: { period: 'month' } },
})
```

### Dashboard 元件結構

```
pages/admin/Dashboard/
├── index.tsx           # 總覽頁入口（Summary）
├── DashboardCards.tsx  # KPI 統計卡片
├── LeaderBoard.tsx     # 商品/顧客排行榜
├── IntervalChart.tsx   # ECharts 區間圖表
├── Welcome.tsx         # 歡迎訊息
├── hooks/
│   ├── index.tsx
│   └── useDashboard.tsx
├── types/
│   └── index.ts
└── utils/
    └── index.ts
```

### LeaderBoard 資料結構

```typescript
type LeaderboardRow = {
  name: string
  count: number
  total: number
}
```

---

## Analytics 開發

### useRevenue Hook Pattern

```tsx
const apiUrl = useApiUrl('power-shop')
const { data } = useCustom<TRevenueReport>({
  url: `${apiUrl}/reports/revenue`,
  method: 'get',
  config: {
    query: {
      period: 'month',
      interval: 'day',
      date_start: '2026-01-01',
      date_end: '2026-01-31',
    },
  },
})
```

### Filter 與 ViewType

Analytics 頁面支援：
- **期間篩選：** today / yesterday / week / month / year / custom
- **粒度：** day / week / month
- **訂單狀態篩選：** 多選
- **圖表類型：** 折線圖 / 面積圖

---

## 環境變數

使用 `useEnv()` hook，禁止直接讀取 `window.power_shop_data`：

```tsx
import { useEnv } from '@/hooks'
const { SITE_URL, API_URL, NONCE, KEBAB, ELEMENTOR_ENABLED } = useEnv()
```

---

## 目錄結構

```
js/src/
├── main.tsx                   # React 入口
├── App1.tsx                   # Refine + HashRouter + 路由
├── resources/index.tsx        # Resource 定義（側邊欄）
├── hooks/                     # 全域 hooks
│   ├── useEnv.tsx             # 環境變數
│   ├── useGCDItems.tsx        # 最大公因數工具
│   └── useProductsOptions.tsx # 商品選項
├── utils/                     # 全域工具
│   ├── env.tsx                # 解密 window.power_shop_data.env
│   └── constants.ts           # 常數
├── api/resources/             # CRUD helper wrappers
├── components/                # 共用元件
│   └── product/               # 商品相關共用元件
└── pages/admin/               # 頁面
    ├── Dashboard/             # KPI、排行榜、圖表
    ├── Orders/                # 訂單列表 + 編輯
    ├── Product/               # 商品列表 + 編輯 + 分類 + 屬性
    ├── Users/                 # 顧客列表 + 編輯
    ├── Analytics/             # 營收分析
    ├── Marketing/             # OneShop（佔位）
    └── WPMediaLibraryPage/    # 媒體庫
```

---

## 路由表

| 路由 | 元件 | Data Provider |
|------|------|---------------|
| `/` | → `/dashboard` | NavigateToResource 重定向 |
| `/dashboard` | Dashboard/Summary | `power-shop` |
| `/orders` | Orders/List | `wc-rest` |
| `/orders/edit/:id` | Orders/Edit | `wc-rest` |
| `/users` | Users/List | `wc-rest` |
| `/users/edit/:id` | Users/Edit | `wc-rest` + `wp-rest` |
| `/products` | Product/List | `wc-rest` |
| `/products/edit/:id` | Product/Edit | `wc-rest` |
| `/products/taxonomies` | Product/Taxonomies | `wc-rest` |
| `/products/attributes` | Product/Attributes | `wc-rest` |
| `/marketing` | Product/List | `wc-rest` |
| `/marketing/one-shop` | Marketing/OneShop | — |
| `/analytics` | Analytics | `power-shop` |
| `/wp-media-library` | WPMediaLibraryPage | `default` |

---

## 相關規格文件

| 檔案 | 說明 |
|------|------|
| `specs/ui/dashboard.md` | Dashboard 頁面規格 |
| `specs/ui/order-list.md` | 訂單列表規格 |
| `specs/ui/order-edit.md` | 訂單編輯規格 |
| `specs/ui/product-list.md` | 商品列表規格 |
| `specs/ui/product-edit.md` | 商品編輯規格 |
| `specs/ui/product-taxonomies.md` | 商品分類規格 |
| `specs/ui/customer-list.md` | 顧客列表規格 |
| `specs/ui/customer-edit.md` | 顧客編輯規格 |
| `specs/ui/analytics.md` | 營收分析規格 |
| `specs/features/**/*.feature` | 20 個 BDD 功能規格 |
| `specs/api/api.yml` | OpenAPI 3.0 API 規格 |

> 完整 Data Provider 與商品編輯器說明：`references/data-providers.md`、`references/product-editor.md`

---

## 常用指令

```bash
# 開發模式（HMR）
pnpm dev

# 打包
pnpm build

# ESLint
pnpm lint

# TypeScript 型別檢查
npx tsc --noEmit
```
