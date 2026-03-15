---
name: power-shop-php
description: Power Shop PHP 後端開發專家。精通 WordPress Plugin REST API 開發、Domain 架構、DTO 模式、ApiBase pattern。當修改 PHP 後端、REST API endpoint、Domain class 或 DTO 時啟用。
metadata:
  domain: power-shop-php-backend
  version: "1.0"
compatibility: "PHP 8.0+, WordPress 5.7+, WooCommerce 7.6.0+"
---

# Power Shop — PHP 後端開發指南

## When to Activate

在以下情境啟用此 SKILL：
- 新增或修改 REST API endpoint
- 建立新的 Domain class
- 開發 DTO（Data Transfer Object）
- 修改 `inc/classes/` 下的 PHP 程式碼
- 處理 WooCommerce 資料整合
- Admin 頁面或 admin bar 功能調整

---

## 核心架構概覽

```
plugin.php
  └→ Plugin::instance()
      └→ Bootstrap::instance()
          ├→ legacy/plugin.php           # 舊版一頁賣場（不擴展）
          ├→ Admin\Entry::instance()     # 管理頁面 + admin bar
          │   ├→ admin_menu             # 註冊 admin 頁面
          │   └→ admin_bar_menu         # 「電商系統」/「編輯商品」
          └→ Domains\Loader::instance()  # 載入所有 Domain API
              └→ Report\Dashboard\Core\V2Api::instance()
```

### 關鍵 Class

| Class | 路徑 | 職責 |
|-------|------|------|
| `Bootstrap` | `inc/classes/Bootstrap.php` | 啟動 Admin + Domains；enqueue scripts |
| `Admin\Entry` | `inc/classes/Admin/Entry.php` | Admin 頁面 + admin bar |
| `Domains\Loader` | `inc/classes/Domains/Loader.php` | 實例化所有 Domain API |
| `Utils\Base` | `inc/classes/Utils/Base.php` | 常數：APP1_SELECTOR、API_TIMEOUT |

---

## 現有 REST API 端點速查

### 自有端點（`/wp-json/power-shop/`）

| Method | 端點 | 說明 |
|--------|------|------|
| GET | `reports/dashboard/stats` | KPI 統計 |
| GET | `reports/dashboard/leaderboard` | 排行榜 |
| GET | `reports/dashboard/trend` | 趨勢圖表 |
| GET | `reports/revenue` | 營收分析 |
| POST | `customers/{id}/notes` | 新增顧客備註 |
| GET | `customers/{id}/notes` | 顧客備註列表 |

### WooCommerce 端點（`/wp-json/wc/v3/`）

| Method | 端點 | 說明 |
|--------|------|------|
| GET/POST | `orders` | 訂單列表/建立 |
| PUT | `orders/{id}` | 更新訂單 |
| POST | `orders/batch` | 批量刪除 |
| POST | `orders/{id}/notes` | 新增備註 |
| GET/POST | `products` | 商品列表/建立 |
| PUT | `products/{id}` | 更新商品 |
| POST | `products/{id}/variations/batch` | 批量變體 |
| GET/POST | `products/categories` | 分類列表/建立 |
| GET | `customers` | 顧客列表 |
| GET/PUT | `customers/{id}` | 顧客詳情/更新 |

> 完整端點定義：`references/api-endpoints.md`

---

## REST API 開發 SOP

### Step 1 — 建立 V2Api class

```
inc/classes/Domains/<Domain>/Core/V2Api.php
```

```php
<?php
declare(strict_types=1);

namespace J7\PowerShop\Domains\<Domain>\Core;

use J7\WpUtils\Classes\ApiBase;
use J7\WpUtils\Classes\WP;

/**
 * <Domain> Api
 */
final class V2Api extends ApiBase {
    use \J7\WpUtils\Traits\SingletonTrait;

    /** @var string */
    protected $namespace = 'power-shop';

    /**
     * @var array{endpoint: string, method: string, permission_callback: ?callable}[]
     */
    protected $apis = [
        [
            'endpoint'            => '<resource>',
            'method'              => 'get',
            'permission_callback' => null,
        ],
    ];

    /**
     * 取得資源列表
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     * @phpstan-ignore-next-line
     */
    public function get_<resource>_callback( $request ): \WP_REST_Response {
        $params = WP::sanitize_text_field_deep( $request->get_query_params(), false );
        // ... 業務邏輯
        return new \WP_REST_Response([ 'code' => 'success', 'data' => [] ]);
    }
}
```

### Step 2 — 註冊到 Loader

在 `inc/classes/Domains/Loader.php` 中加入：

```php
<Domain>\Core\V2Api::instance();
```

### Step 3 — 驗證

```bash
composer lint
vendor/bin/phpstan analyse inc --memory-limit=1G
```

---

## DTO 開發 SOP

### Step 1 — 建立 DTO class

```
inc/classes/Domains/<Domain>/DTO/<Name>.php
```

### Step 2 — 定義結構

```php
<?php
declare(strict_types=1);

namespace J7\PowerShop\Domains\<Domain>\DTO;

final class <Name> {
    public string $name;
    public int $count;
    public float $total;

    /** @param array<mixed> $data */
    public function __construct( array $data ) {
        $this->name  = (string) ( $data['name'] ?? '' );
        $this->count = (int) ( $data['count'] ?? 0 );
        $this->total = (float) ( $data['total'] ?? 0.0 );
    }

    /** @return array{name: string, count: int, total: float} */
    public function to_array(): array {
        return [
            'name'  => $this->name,
            'count' => $this->count,
            'total' => $this->total,
        ];
    }
}
```

### Step 3 — 在 V2Api 中使用

```php
$dto = new MyDto($raw_data);
return new \WP_REST_Response([ 'code' => 'success', 'data' => $dto->to_array() ]);
```

---

## 資料模型索引

完整 Entity Relationship Model 定義在 `specs/entity/erm.dbml`（9 資料表）：

| 資料表 | 說明 |
|--------|------|
| orders | 訂單 |
| order_items | 訂單商品項目 |
| products | 商品 |
| product_variations | 商品變體 |
| product_categories | 商品分類 |
| customers | 顧客 |
| customer_notes | 顧客備註 |
| dashboard_stats | Dashboard 統計 |
| revenue_reports | 營收報表 |

---

## 目錄結構

```
inc/classes/
├── Bootstrap.php              # 啟動核心
├── Admin/
│   └── Entry.php              # Admin 頁面 + admin bar
├── Domains/
│   ├── Loader.php             # 載入所有 Domain API
│   └── Report/
│       ├── Dashboard/
│       │   └── Core/V2Api.php # Dashboard REST API
│       └── LeaderBoards/
│           └── DTO/Row.php    # LeaderBoard DTO
└── Utils/
    └── Base.php               # 常數定義
```

---

## 安全性清單

- [ ] `declare(strict_types=1)` 在檔案頂部
- [ ] `WP::sanitize_text_field_deep()` 處理所有輸入
- [ ] `\esc_html()` / `\esc_attr()` / `\esc_url()` 處理所有輸出
- [ ] `permission_callback` 已設定（`null` = Powerhouse 預設認證）
- [ ] 新 API class 已在 Loader.php 註冊
- [ ] `composer lint` 通過
- [ ] `vendor/bin/phpstan analyse inc` 通過

---

## 相關規格文件

| 檔案 | 說明 |
|------|------|
| `specs/api/api.yml` | OpenAPI 3.0 完整 API 規格 |
| `specs/entity/erm.dbml` | DBML 資料模型（9 表） |
| `specs/features/order/*.feature` | 訂單領域（6 Feature） |
| `specs/features/product/*.feature` | 商品領域（5 Feature） |
| `specs/features/customer/*.feature` | 顧客領域（5 Feature） |
| `specs/features/dashboard/*.feature` | 儀表板領域（4 Feature） |
| `specs/activities/*.activity` | 業務流程（4 流程） |

> 詳細端點與模式範本：`references/api-endpoints.md`、`references/domain-patterns.md`

---

## 常用指令

```bash
# PHP linting
composer lint

# PHPStan 靜態分析
vendor/bin/phpstan analyse inc --memory-limit=1G

# 版本同步
pnpm sync:version

# 發布
pnpm release:patch
```
