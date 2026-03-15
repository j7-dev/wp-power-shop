---
applyTo: "**/*.ts,**/*.tsx"
---

# Power Shop — React / TypeScript 開發指引

> 適用於所有 `.ts` / `.tsx` 檔案。通用規範請參閱 `CLAUDE.md`。

---

## 1. 框架堆疊

| 層級 | 技術 | 備註 |
|------|------|------|
| UI 框架 | React 18 | Functional components only |
| Meta-framework | Refine v4 | CRUD hooks + resource 系統 |
| UI 元件庫 | Ant Design v5 | ConfigProvider theme token |
| 狀態管理 | Jotai + React Context | atom 跨分頁選取；Context 區域共享 |
| 資料層 | React Query (via Refine) | 搭配 6 個 Data Provider |
| 路由 | HashRouter | `#/` 路徑，定義在 App1.tsx |
| 樣式 | Tailwind CSS (`tw-` prefix) | 搭配 Ant Design theme token |
| 打包 | Vite | HMR port 5178 |
| 共用套件 | `antd-toolkit` | 子路徑：`antd-toolkit`、`antd-toolkit/refine`、`antd-toolkit/wp` |

---

## 2. 元件寫法慣例

1. **Functional components only** — 禁止 class components。
2. 所有頁面級和重型元件使用 **`memo()`**。
3. **JSDoc 註解使用繁體中文** — 這是台灣產品。
4. 所有 **UI 文字使用繁體中文**。
5. 使用 **`@/` alias** 做 import 路徑（對應 `js/src/`）。

```tsx
import { memo } from 'react'

/** 我的頁面元件 */
const MyPageComponent = () => {
  return <div>我的頁面</div>
}

export const MyPage = memo(MyPageComponent)
```

---

## 3. Data Provider 與 Refine Hooks

Power Shop 配置了 **6 個 Data Provider**，每次使用 Refine hook 必須明確指定 `dataProvider`：

| Key | 來源 | 用途 |
|-----|------|------|
| `'default'` | Powerhouse core | posts、media 等 |
| `'wc-rest'` | WooCommerce REST v3 | products、orders、customers |
| `'wc-store'` | WooCommerce Store API | cart、checkout |
| `'power-shop'` | 本外掛自有 REST API | Dashboard、Analytics、顧客備註 |
| `'wp-rest'` | WordPress REST API v2 | users、UserMeta |
| `'bunny-stream'` | Bunny.net | 影片操作 |

**使用規則：**
- **永遠**明確指定 `dataProvider` key。
- 使用 Refine hooks（`useTable`、`useForm`、`useCustom`、`useCreate` 等）做所有 API 呼叫。
- **禁止**直接使用 `fetch` 或 `axios`。

```tsx
const { data } = useCustom<TDashboardStats>({
  url: `${apiUrl}/reports/dashboard/stats`,
  method: 'get',
  config: { query: { period: 'month' } },
  dataProviderName: 'power-shop',
})
```

---

## 4. 狀態管理

### Jotai（跨分頁選取狀態）

ProductTable 和 UserTable 使用 Jotai atom 管理跨分頁選取：

```
頁面切換 → useEffect 同步 → Jotai atom 更新 → BulkAction 讀取
```

### React Context（區域共享）

Orders Edit 和 Users Edit 使用雙 Context 模式：

```tsx
<IsEditingContext.Provider value={isEditing}>
  <RecordContext.Provider value={record}>
    <Edit>
      <Form>
        <Detail />
      </Form>
    </Edit>
  </RecordContext.Provider>
</IsEditingContext.Provider>

// 消費層
const record = useRecord()
const isEditing = useIsEditing()
```

---

## 5. 路由架構

使用 **HashRouter**（`#/` 路徑），定義在 `App1.tsx`：

| 路由 | 元件 | 說明 |
|------|------|------|
| `/` | `Dashboard/Summary` | 總覽頁：KPI 卡片、排行榜、區間圖表 |
| `/orders` | `Orders/List` | 訂單列表 |
| `/orders/edit/:id` | `Orders/Edit` | 訂單編輯 |
| `/users` | `Users/List` | 顧客列表 |
| `/users/edit/:id` | `Users/Edit` | 顧客編輯 |
| `/products` | `Product/List` | 商品列表 |
| `/products/edit/:id` | `Product/Edit` | 商品編輯（多 Tab） |
| `/products/taxonomies` | `Product/Taxonomies` | 商品分類/標籤管理 |
| `/products/attributes` | `Product/Attributes` | 全域商品規格管理 |
| `/marketing` | `Marketing/OneShop` | OneShop 佔位頁 |
| `/analytics` | `Analytics` | 營收分析 |
| `/wp-media-library` | `WPMediaLibraryPage` | WordPress 媒體庫 |

### 新增頁面 SOP

1. 建立 `js/src/pages/admin/<Section>/index.tsx`（使用 `memo()`）。
2. 從 `js/src/pages/admin/index.tsx` 匯出。
3. 在 `js/src/resources/index.tsx` 註冊 resource。
4. 在 `js/src/App1.tsx` 新增 `<Route>`。

```tsx
// resources/index.tsx
{
  name: 'my-resource',
  list: '/my-path',
  meta: { label: '我的頁面', icon: <SomeIcon /> },
}

// App1.tsx
<Route path="my-path">
  <Route index element={<MyPage />} />
</Route>
```

---

## 6. 商品編輯系統

### 多 Tab 架構

商品編輯頁（`pages/admin/Product/Edit/index.tsx`）使用 **8 個 Tab**：

| Tab | 說明 | 備註 |
|-----|------|------|
| 描述 (basic/detail) | 商品名稱、描述、短描述 | |
| 價格 (price) | 原價、特價、促銷日期 | `grouped` / `variable` 隱藏 |
| 庫存 (stock) | SKU、庫存數量、狀態 | |
| 規格 (attribute) | 商品屬性管理 | 儲存按鈕停用 |
| 變體 (variation) | 變體列表、批次操作 | 僅 `variable` / `subscription_variable` 顯示 |
| 進階 (sales/size/subscription) | 購買備註、排序、尺寸 | |
| 關聯 (taxonomy) | 分類、標籤、交叉銷售 | |
| 分析 (analytics) | 單品銷售分析 | 儲存按鈕停用 |

### Partials 機制

使用 `queryMeta.variables.partials` 請求特定資料切片：

```tsx
const { formProps, saveButtonProps, query, onFinish } = useForm<TProductRecord>({
  action: 'edit',
  resource: 'products',
  id,
  queryMeta: {
    variables: {
      partials: ['basic', 'detail', 'price', 'stock', 'taxonomy'],
      meta_keys: [],
    },
  },
})
```

可用 partials：`basic`、`detail`、`price`、`stock`、`sales`、`size`、`subscription`、`taxonomy`、`attribute`、`variation`。

### 產品類型條件

| 條件 | 檢查方式 |
|------|----------|
| 顯示變體 Tab | `isVariable(watchProductType)` — types `variable`、`subscription_variable` |
| 隱藏價格 Tab | types `grouped` 或 `variable` |
| 停用儲存按鈕 | 目前 Tab 為 Attributes、Variation 或 Analytics |

### 虛擬表格

ProductEditTable 使用虛擬列表渲染，因 `Form.getFieldsValue` 不適用虛擬列表：

```
表格編輯 → handleValuesChange → setVirtualFields → 手動狀態管理
同步模式開啟 → 批次更新所有變體的相同欄位
```

---

## 7. 環境變數存取

使用 **`useEnv()`** hook 讀取解密後的環境變數，**禁止**直接讀取 `window.power_shop_data`：

```tsx
import { useEnv } from '@/hooks'

const { SITE_URL, API_URL, NONCE, KEBAB, ELEMENTOR_ENABLED } = useEnv()
```

---

## 8. CSS 慣例

- **Tailwind CSS** 使用 `tw-` prefix（避免與 Ant Design class 衝突）。
- **Ant Design** 遵循 ConfigProvider theme token：`colorPrimary: '#1677ff'`、`borderRadius: 6`。
- 使用 Ant Design v5 元件。

---

## 9. 元件組織

```
js/src/
├── pages/admin/<Domain>/     # 按領域分頁面
│   ├── index.tsx             # 頁面入口（memo）
│   ├── hooks/                # 頁面專用 hooks
│   ├── types/                # 頁面專用型別
│   └── components/           # 頁面專用元件
├── components/               # 共用元件
│   └── product/              # 共用商品元件 + 型別
├── hooks/                    # 全域 hooks
├── utils/                    # 全域工具函式
└── api/resources/            # CRUD helper wrappers
```

---

## 10. 程式碼品質

```bash
pnpm lint        # ESLint
npx tsc --noEmit # TypeScript 型別檢查
```

---

## 11. 參考規格文件

- **UI 頁面規格：** `specs/ui/*.md`（9 個頁面）
- **功能規格：** `specs/features/**/*.feature`（20 個 Feature）
- **API 規格：** `specs/api/api.yml`（OpenAPI 3.0）
- **資料模型：** `specs/entity/erm.dbml`
