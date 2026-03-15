---
applyTo: "**/*.{php,ts,tsx}"
---

# Power Shop — 架構指引

> 本文件描述 Power Shop 外掛的系統架構、資料流、初始化流程與關鍵設計決策。

---

## 系統架構概覽

```
┌──────────────────────────────────────────────────────────────┐
│                      WordPress Admin                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  admin.php?page=power-shop                              │ │
│  │  ┌───────────────────────────────────────────────────┐  │ │
│  │  │             React SPA (#power_shop)                │  │ │
│  │  │  ┌───────────┐  ┌───────────┐  ┌──────────────┐  │  │ │
│  │  │  │ Dashboard  │  │  Orders   │  │   Products   │  │  │ │
│  │  │  │  (echarts) │  │ (Refine)  │  │   (Refine)   │  │  │ │
│  │  │  └───────────┘  └───────────┘  └──────────────┘  │  │ │
│  │  │  ┌───────────┐  ┌───────────┐  ┌──────────────┐  │  │ │
│  │  │  │   Users   │  │ Analytics │  │  Marketing   │  │  │ │
│  │  │  │ (Refine)  │  │ (Plots)   │  │ (placeholder)│  │  │ │
│  │  │  └───────────┘  └───────────┘  └──────────────┘  │  │ │
│  │  └───────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                           │                                   │
│                  HashRouter + Refine                           │
│                           │                                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   6 Data Providers                       │ │
│  │  ┌─────────┐ ┌────────┐ ┌────────┐ ┌───────────────┐  │ │
│  │  │ default │ │wp-rest │ │wc-rest │ │  power-shop   │  │ │
│  │  │(Powerh.)│ │(WP v2) │ │(WC v3) │ │(自有 REST API)│  │ │
│  │  └─────────┘ └────────┘ └────────┘ └───────────────┘  │ │
│  │  ┌──────────┐ ┌──────────────┐                         │ │
│  │  │wc-store  │ │ bunny-stream │                         │ │
│  │  │(Store v1)│ │ (Bunny CDN)  │                         │ │
│  │  └──────────┘ └──────────────┘                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                           │                                   │
│                     WordPress REST API                        │
│                           │                                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    PHP Backend                           │ │
│  │  ┌──────────┐  ┌───────────┐  ┌─────────────────────┐ │ │
│  │  │Bootstrap │→ │ Admin     │  │ Domains/Loader      │ │ │
│  │  │          │  │ Entry.php │  │  └→ Report V2Api    │ │ │
│  │  └──────────┘  └───────────┘  └─────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 插件初始化流程

```
plugin.php
  └→ Plugin::instance()                     # SingletonTrait 取得實例
      └→ PluginTrait::init()                # 設定常數、載入 autoloader
          └→ Bootstrap::instance()
              ├→ legacy/plugin.php           # 載入舊版一頁賣場程式碼
              ├→ Admin\Entry::instance()     # 註冊管理頁面
              │   ├→ add_action('admin_menu', ...) # 註冊 admin 頁面
              │   └→ add_action('admin_bar_menu', ...) # Admin bar「電商系統」
              └→ Domains\Loader::instance()  # 載入所有 Domain API
                  └→ Report\Dashboard\Core\V2Api::instance() # REST API 註冊
```

### 前端載入流程

```
Admin\Entry::render_page()
  └→ echo '<div id="power_shop"></div>'     # React mount point

Bootstrap::admin_enqueue_hook()
  └→ 判斷 General::in_url(['page=power-shop'])
      └→ Vite\enqueue_asset()              # 載入 JS/CSS（含 HMR dev 支援）
          └→ wp_localize_script()           # 注入 window.power_shop_data
              └→ env: SimpleEncrypt::encrypt() # 加密環境資訊

main.tsx (DOMContentLoaded)
  └→ ReactDOM.createRoot(#power_shop)
      └→ <App1 />
          ├→ <Refine dataProvider={...}>    # 6 個 Data Provider
          ├→ <HashRouter>                   # 路由系統
          └→ <ConfigProvider>               # Ant Design 主題
```

---

## 資料流架構

### PHP → React 環境變數

```
PHP (Bootstrap):
  PowerhouseUtils::simple_encrypt($env_array)
    → window.power_shop_data.env = '加密字串'

React (env.tsx):
  simpleDecrypt(window.power_shop_data.env)
    → { api_url, nonce, user_id, site_url, ... }

React (useEnv hook):
  const { api_url, nonce } = useEnv()
```

### React → PHP API 呼叫

```
React Component
  → useCustom / useTable / useForm (Refine hook)
    → dataProvider[key].getList / getOne / create / update
      → axios.get('/wp-json/{prefix}/{resource}', { headers: { 'X-WP-Nonce': nonce } })
        → WordPress REST API Router
          → V2Api callback (with sanitization)
            → WooCommerce / WordPress DB
              → WP_REST_Response
```

---

## 前端路由架構

使用 HashRouter（`#/` 路徑），定義在 App1.tsx：

| 路由 | 元件 | 說明 |
|------|------|------|
| `/` | → `/dashboard` | NavigateToResource 重定向 |
| `/dashboard` | `Dashboard/Summary` | 總覽頁：KPI 卡片、排行榜、區間圖表 |
| `/orders` | `Orders/List` | 訂單列表 |
| `/orders/edit/:id` | `Orders/Edit` | 訂單編輯 |
| `/users` | `Users/List` | 顧客列表 |
| `/users/edit/:id` | `Users/Edit` | 顧客編輯（含基本/地址/Meta/購物車/近期訂單） |
| `/products` | `Product/List` | 商品列表 |
| `/products/edit/:id` | `Product/Edit` | 商品編輯（多 Tab：描述/價格/庫存/規格/變體/進階/關聯/分析） |
| `/products/taxonomies` | `Product/Taxonomies` | 商品分類/標籤管理 |
| `/products/attributes` | `Product/Attributes` | 全域商品規格管理 |
| `/marketing` | `Product/List` | 行銷分類（index 目前渲染商品列表） |
| `/marketing/one-shop` | `Marketing/OneShop` | 一頁賣場（即將推出） |
| `/analytics` | `Analytics` | 營收分析（折線圖/面積圖 + 篩選器） |
| `/wp-media-library` | `WPMediaLibraryPage` | WordPress 媒體庫 |

---

## 元件設計模式

### 頁面 Edit 模式

Orders Edit 和 Users Edit 使用相同的雙 Context 模式：

```tsx
// 提供層
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

### 列表多選狀態

ProductTable 和 UserTable 使用 Jotai atom 管理跨分頁選取：

```
頁面切換 → useEffect 同步 → Jotai atom 更新 → BulkAction 讀取
```

### 商品編輯虛擬表格

ProductEditTable 使用虛擬列表渲染，因 Form.getFieldsValue 不適用虛擬列表：

```
表格編輯 → handleValuesChange → setVirtualFields → 手動狀態管理
同步模式開啟 → 批次更新所有變體的相同欄位
```

---

## 建構與部署

### Vite 配置

```typescript
// vite.config.ts
export default defineConfig({
  server: { port: 5178, cors: { origin: '*' } },
  plugins: [
    alias(), react(), tsconfigPaths(),
    v4wp({ input: 'js/src/main.tsx', outDir: 'js/dist' }),
  ],
  resolve: { alias: { '@': path.resolve(__dirname, 'js/src'), dayjs: 'dayjs' } },
})
```

### 環境切換

- **開發**：`pnpm dev` → Vite dev server（HMR，port 5178）
- **正式**：`pnpm build` → `js/dist/` 靜態資源，PHP `Vite\enqueue_asset()` 讀取 manifest

### 發布流程

```bash
pnpm release:patch    # 1. bump package.json  2. sync plugin.php  3. build  4. GitHub Release
```

---

## 安全性設計

1. **Nonce 驗證**：所有 REST 呼叫透過 `X-WP-Nonce` header 驗證
2. **Capability 檢查**：permission_callback 使用 Powerhouse 預設認證（`manage_woocommerce`）
3. **環境加密**：API key、nonce 等透過 `SimpleEncrypt` 加密傳遞到前端
4. **輸入清理**：`WP::sanitize_text_field_deep()` 遞迴清理所有輸入
5. **輸出跳脫**：`esc_html()`、`esc_attr()`、`esc_url()` 用於所有 PHP 輸出

---

## 相關文件

### Rules（自動載入）

| 檔案 | 說明 |
|------|------|
| `CLAUDE.md` | 跨語言通用規範 |
| `.claude/rules/react.rule.md` | React / TypeScript 開發慣例 |
| `.claude/rules/wordpress.rule.md` | WordPress / PHP 開發慣例 |

### SKILL（按需啟用）

| SKILL | 說明 |
|-------|------|
| `.claude/skills/power-shop-php/SKILL.md` | PHP 後端：REST API、Domain、DTO 開發 |
| `.claude/skills/power-shop-react/SKILL.md` | React 前端：頁面、元件、Data Provider 開發 |

### 規格文件

| 路徑 | 說明 |
|------|------|
| `specs/README.md` | 規格總索引 |
| `specs/api/api.yml` | OpenAPI 3.0 API 規格 |
| `specs/entity/erm.dbml` | DBML 資料模型 |
| `specs/features/**/*.feature` | 20 個 BDD 功能規格 |
| `specs/ui/*.md` | 9 個 UI 頁面規格 |
