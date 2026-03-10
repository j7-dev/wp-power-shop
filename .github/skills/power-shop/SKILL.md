---
name: power-shop
description: "Power Shop — WooCommerce 電商管理外掛開發指引。涵蓋 PHP 後端（WordPress Plugin、REST API）與 React 前端（Refine.dev、Ant Design）的架構概覽、目錄結構、程式碼模式與開發規範。"
---

# Power Shop — 統一開發指引

> WooCommerce 電商管理外掛，以 React SPA 取代預設的 WooCommerce 後台介面，提供更現代化的商品、訂單、顧客管理體驗。

## When to Activate

當使用者在此專案中：
- 修改 `inc/classes/**/*.php`、`js/src/**/*.{ts,tsx}` 或 `plugin.php`
- 新增 REST API 端點、React 頁面或元件
- 詢問專案架構、資料流、或開發慣例

---

## 架構概覽

### 技術棧

| 層級 | 技術 |
|------|------|
| **PHP 後端** | PHP 8.0+ / WordPress 5.7+ / WooCommerce 7.6+ |
| **React 前端** | React 18 + TypeScript / Refine.dev / Ant Design v5 |
| **建構工具** | Vite（`kucrut/vite-for-wp`）/ pnpm / Turborepo |
| **狀態管理** | React Query（伺服器端狀態）、Jotai（客戶端狀態） |
| **圖表** | echarts（Dashboard）、@ant-design/plots（Analytics） |
| **PHP Linting** | PHPCS（WordPress-Core/Docs/Extra）+ PHPStan level 9 |
| **JS Linting** | ESLint（`@power/eslint-config`）+ Prettier |
| **CSS** | Ant Design CSS-in-JS + TailwindCSS（preflight 停用） |

### 關鍵依賴

**PHP（composer.json）：**
- `kucrut/vite-for-wp: ^0.10.0` — Vite 與 WordPress 的橋接
- `j7-dev/wp-plugin-trait: ^0.2` — 插件基礎 trait（PluginTrait、SingletonTrait）

**JS（package.json v3.0.11）：**
- `antd-toolkit: workspace:*` — 共用 React/Antd 工具庫（含 Refine helpers、WP hooks）
- `echarts: ^5.6.0` — Dashboard 圖表
- `react-countup: ^6.5.3` — KPI 數字動畫

### 必要外掛

- **WooCommerce** ≥ 7.6.0
- **Powerhouse** ≥ 3.3.20（核心框架外掛，提供 `ApiBase`、`SimpleEncrypt`、`Settings` 等）

---

## 目錄結構

```
power-shop/
├── plugin.php                              # 插件入口：Plugin class + instance() 呼叫
├── inc/classes/
│   ├── Bootstrap.php                       # 載入 Legacy、Admin、Domains；註冊 enqueue hooks
│   ├── Admin/
│   │   └── Entry.php                       # 管理頁面輸出 + admin bar 整合
│   ├── Domains/
│   │   ├── Loader.php                      # 實例化所有 Domain API class
│   │   └── Report/
│   │       ├── Dashboard/Core/V2Api.php    # GET /power-shop/reports/dashboard/stats
│   │       └── LeaderBoards/DTO/Row.php    # DTO: { name, count, total }
│   └── Utils/
│       └── Base.php                        # 常數：APP1_SELECTOR、API_TIMEOUT、DEFAULT_IMAGE
├── js/src/
│   ├── main.tsx                            # React 根：掛載 App1 到 #power_shop
│   ├── App1.tsx                            # Refine + HashRouter + 路由定義 + 6 個 DataProvider
│   ├── resources/index.tsx                 # Refine 資源定義（側欄導航）
│   ├── hooks/
│   │   ├── useEnv.tsx                      # 解密環境變數的 typed wrapper
│   │   ├── useGCDItems.tsx                 # 最大公因子項目選擇工具
│   │   └── useProductsOptions.tsx          # 商品篩選選項 API hook
│   ├── utils/
│   │   ├── env.tsx                         # 解密 window.power_shop_data.env
│   │   ├── constants.ts                    # INFO_LABEL_MAPPER（地址欄位標籤）
│   │   └── api.tsx                         # getTypeText、getDataProviderUrlParams
│   ├── api/resources/                      # CRUD helper（create/get/update/delete）
│   ├── types/                              # 全域型別定義（DataProvider、WC API、WP API）
│   ├── components/
│   │   ├── general/                        # CopyButton、Price
│   │   ├── product/                        # ProductTable、ProductEditTable、欄位元件
│   │   ├── productAttribute/              # 商品規格排序列表 + 編輯表單
│   │   ├── term/                           # 分類標籤的 SortableTree/SortableList
│   │   ├── order/                          # InfoTable、OrderNotes
│   │   ├── post/                           # PostAction、ToggleVisibility
│   │   └── user/                           # UserTable、ContactRemarks、OrderCustomerTable
│   └── pages/admin/
│       ├── Dashboard/                      # KPI 卡片、排行榜、區間圖表
│       ├── Orders/                         # 訂單列表 + 編輯
│       ├── Product/                        # 商品列表 + 多 Tab 編輯 + 分類 + 規格
│       ├── Users/                          # 顧客列表 + 編輯（基本/地址/Meta/購物車/近期訂單）
│       ├── Analytics/                      # 營收分析（折線圖/面積圖 + 篩選器）
│       ├── Marketing/                      # OneShop（即將推出佔位頁）
│       └── WPMediaLibraryPage/             # WordPress 媒體庫瀏覽器
└── legacy/                                 # 舊版一頁賣場程式碼（Bootstrap 載入，禁止擴充）
```

---

## PHP 程式碼模式與慣例

### Singleton + SingletonTrait

所有具狀態的 class 都使用 SingletonTrait，透過 `ClassName::instance()` 取得實例：

```php
<?php
declare(strict_types=1);

namespace J7\PowerShop\Domains\<Domain>\Core;

use J7\WpUtils\Classes\ApiBase;
use J7\WpUtils\Classes\WP;

final class V2Api extends ApiBase {
    use \J7\WpUtils\Traits\SingletonTrait;

    protected $namespace = 'power-shop';

    protected $apis = [
        [
            'endpoint'            => '<resource>',
            'method'              => 'get',
            'permission_callback' => null,
        ],
    ];

    /**
     * 取得資源列表
     */
    public function get_<resource>_callback( $request ): \WP_REST_Response {
        $params = WP::sanitize_text_field_deep( $request->get_query_params(), false );
        return new \WP_REST_Response([ 'code' => 'success', 'data' => [] ]);
    }
}
```

### ApiBase Callback 命名規則

`ApiBase` 自動解析 callback 方法名稱：
- 端點 `reports/dashboard/stats` + 方法 `get` → `get_reports_dashboard_stats_callback`
- 端點 `products/(?P<id>\d+)` + 方法 `get` → `get_products_with_id_callback`

規則：`{method}_{endpoint_segments_underscored}_callback`

### DTO 模式

```php
final class Row {
    public string $name;
    public int $count;
    public float $total;

    /** @param array<mixed> $row */
    public function __construct( array $row ) {
        $this->name  = isset($row[0]['value']) ? (string) $row[0]['value'] : '';
        $this->count = isset($row[1]['value']) ? (int) $row[1]['value'] : 0;
        $this->total = isset($row[2]['value']) ? (float) $row[2]['value'] : 0.0;
    }

    /** @return array{name: string, count: int, total: float} */
    public function to_array(): array {
        return [ 'name' => $this->name, 'count' => $this->count, 'total' => $this->total ];
    }
}
```

### 新增 REST API Domain 流程

1. 建立 `inc/classes/Domains/<Domain>/Core/V2Api.php`
2. 在 `inc/classes/Domains/Loader.php` 的 `__construct()` 中註冊：`<Domain>\Core\V2Api::instance()`

---

## React 程式碼模式與慣例

### Data Provider 系統

App1.tsx 定義了 6 個 Data Provider：

| Key | 路徑前綴 | 用途 |
|-----|----------|------|
| `default` | `/v2/powerhouse` | Powerhouse 核心（posts、media） |
| `wp-rest` | `/wp/v2` | WordPress REST API |
| `wc-rest` | `/wc/v3` | WooCommerce REST API（products、orders） |
| `wc-store` | `/wc/store/v1` | WooCommerce Store API（cart、checkout） |
| `bunny-stream` | Bunny CDN | Bunny.net 影片操作 |
| `power-shop` | `/${KEBAB}` | 本外掛自有 REST 端點 |

**每個 Refine hook 呼叫都必須明確指定 `dataProvider` key。**

### 頁面元件模式

```tsx
import { memo } from 'react'
import { useForm } from '@refinedev/antd'
import { useParsed } from '@refinedev/core'

const MyPageComponent = () => {
  const { id } = useParsed()
  const { formProps, saveButtonProps } = useForm({
    action: 'edit',
    resource: 'products',
    id,
    queryMeta: {
      variables: {
        partials: ['basic', 'detail', 'price'],
      },
    },
  })

  return <Form {...formProps}>...</Form>
}

export const MyPage = memo(MyPageComponent)
```

### Context 模式

多個編輯頁面使用 Context 傳遞表單狀態：
- `RecordContext` — 當前編輯的記錄（Orders、Products、Users）
- `IsEditingContext` — 編輯模式切換（Orders、Users）
- `DashboardContext` — Dashboard 統計資料與查詢狀態
- `RevenueContext` — Analytics 營收資料

### Jotai 全域狀態

ProductTable 和 UserTable 使用 Jotai atom 管理跨分頁的多選狀態：

```tsx
import { atom } from 'jotai'
export const selectedProductsAtom = atom<TProductRecord[]>([])
```

### 商品編輯 Tab 系統

Product Edit 使用 `partials` 請求特定資料切片：
- 可用 partials：`basic`、`detail`、`price`、`stock`、`sales`、`size`、`subscription`、`taxonomy`、`attribute`、`variation`

Tab 顯示條件：
- **Variation tab**：僅在 `isVariable(productType)` 時顯示
- **Price tab**：`grouped`、`variable` 類型隱藏
- **儲存按鈕**：在 Attributes、Variation、Analytics tab 時停用

### 加密環境變數

PHP 端加密，JS 端解密：

```tsx
// js/src/utils/env.tsx
import { simpleDecrypt } from 'antd-toolkit'
const encryptedEnv = window?.power_shop_data?.env
export const env = simpleDecrypt(encryptedEnv)

// js/src/hooks/useEnv.tsx — 永遠使用此 hook，禁止直接存取 window
import { useEnv as useATEnv } from 'antd-toolkit'
export const useEnv = <T,>() => useATEnv<Env & T>()
```

---

## 命名慣例

| 類型 | 慣例 | 範例 |
|------|------|------|
| PHP class | `PascalCase`、`final class` | `V2Api`、`Bootstrap` |
| PHP 方法/變數 | `snake_case` | `get_reports_dashboard_stats_callback` |
| PHP 常數 | `UPPER_SNAKE_CASE` | `APP1_SELECTOR`、`API_TIMEOUT` |
| PHP 命名空間 | `J7\PowerShop\<Domain>` | `J7\PowerShop\Domains\Report\Dashboard\Core` |
| React 元件 | `PascalCase` + `memo()` | `ProductEdit`、`DashboardCards` |
| React hook | `camelCase`、`use` 前綴 | `useEnv`、`useDashboard` |
| 檔案路徑別名 | `@/` → `js/src/` | `import { useEnv } from '@/hooks'` |
| REST API | `/wp-json/power-shop/` | `/reports/dashboard/stats` |
| UI 文字 | 繁體中文 | `總覽`、`訂單`、`商品` |
| PHPDoc 註解 | 繁體中文 | `/** 取得時間範圍內的訂單 */` |

---

## 開發規範

### PHP

1. **`declare(strict_types=1);`** — 每個 PHP 檔案頂部必加
2. **`final class`** — 所有具體 class；`abstract class` 用於基礎工具
3. **SingletonTrait** — 所有需實例化的 class 都必須使用
4. **sanitize / escape** — 輸入用 `WP::sanitize_text_field_deep()`，輸出用 `\esc_html()`
5. **REST API** — 在 `Domains/Loader.php` 註冊，不在 Bootstrap 直接加
6. **permission_callback: null** — 使用 Powerhouse 預設認證

### TypeScript / React

1. **Functional components only** — 禁止 class components
2. **`memo()`** — 頁面級與重型元件必加
3. **`useEnv()`** — 永遠透過 hook 取得環境變數
4. **Refine data hooks** — 所有 API 呼叫使用 Refine hooks，禁止裸 fetch/axios
5. **明確指定 dataProvider** — 每個 Refine hook 呼叫都要指定
6. **Ant Design v5** — 主題：`colorPrimary: '#1677ff'`、`borderRadius: 6`

---

## 常用指令

```bash
# 開發伺服器
pnpm dev                    # Vite dev server（port 5178）

# 建構
pnpm build                  # Vite production build → js/dist/

# PHP Linting
composer lint               # PHPCS（WordPress-Core/Docs/Extra）
vendor/bin/phpstan analyse inc --memory-limit=1G  # PHPStan level 9

# JS Linting
pnpm lint                   # ESLint
pnpm format                 # Prettier-ESLint 格式化

# 發布
pnpm release:patch          # Bump patch + build + GitHub release
pnpm release:minor          # Bump minor
pnpm release:major          # Bump major
pnpm sync:version           # 同步 package.json 版本到 plugin.php

# i18n
pnpm i18n                   # 生成 .pot 翻譯範本
```

---

## REST API 端點

### `GET /wp-json/power-shop/reports/dashboard/stats`

| 參數 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `after` | `string` | 今日 `00:00:00` | ISO 8601 開始時間 |
| `before` | `string` | 今日 `23:59:59` | ISO 8601 結束時間 |
| `per_page` | `int` | `5` | 排行榜筆數 |
| `compare_type` | `day\|week\|month\|year` | `day` | 比較窗口類型 |
| `compare_value` | `int` | `1` | 比較窗口數量 |

回應包含：`total_sales`、`new_registration`、`orders_count_unshipped`、`orders_count_unpaid`、`products`（排行榜）、`customers`（排行榜）、`intervals`（營收區間）

---

## 相關 SKILL

- `react-coding-standards` — React 18 / TypeScript 編碼標準
- `wordpress-coding-standards` — WordPress / PHP 編碼標準
- `refine` — Refine.dev 框架開發指引
- `wp-rest-api` — WordPress REST API 開發
- `wp-plugin-development` — WordPress Plugin 開發
