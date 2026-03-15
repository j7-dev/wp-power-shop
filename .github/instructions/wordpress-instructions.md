---
applyTo: "**/*.php"
---

# Power Shop — WordPress / PHP 開發指引

> 適用於所有 `.php` 檔案。通用規範請參閱 `copilot-instructions.md`。

---

## 1. 環境需求

| 需求 | 最低版本 |
|------|----------|
| PHP | 8.0+ |
| WordPress | 5.7+ |
| WooCommerce | 7.6.0+ |

---

## 2. 強制命名慣例

1. **`declare(strict_types=1);`** — 每個 PHP 檔案頂部，無例外。
2. **Namespace** — 所有 class 在 `J7\PowerShop\<Domain>` 下（PSR-4，映射自 `inc/classes/`）。
3. **`final class`** — 所有具體 class；`abstract class` 用於基礎工具類。
4. **`SingletonTrait`** — 所有被實例化的 class 使用 `\J7\WpUtils\Traits\SingletonTrait`，透過 `ClassName::instance()` 呼叫。
5. **方法/函式註解使用繁體中文**。
6. **命名規範：**
   - `snake_case` — 變數、方法、函式
   - `PascalCase` — class 名稱
   - `UPPER_SNAKE_CASE` — 常數
7. **Hook 註冊** — 使用 `\add_action()` / `\add_filter()` 搭配完全限定的函式參考，偏好 `[ __CLASS__, 'method' ]`。

---

## 3. REST API 開發

### ApiBase Pattern

所有 REST API class 繼承 `J7\WpUtils\Classes\ApiBase`：

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
            'permission_callback' => null, // null = Powerhouse 預設認證
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

### Callback 命名慣例

`ApiBase` 自動解析 callback 方法名：

- 模式：`{method}_{endpoint_segments_underscored}_callback`
- `/` → `_`
- Regex groups `(?P<id>\d+)` → `with_id`

**範例：** endpoint `products/(?P<id>\d+)` + method `get` → `get_products_with_id_callback`

### Loader 註冊

新的 API class 必須在 `inc/classes/Domains/Loader.php` 中註冊：

```php
public function __construct() {
    Report\Dashboard\Core\V2Api::instance();
    <Domain>\Core\V2Api::instance(); // ← 在此加入
}
```

---

## 4. DTO 模式

```php
final class MyDto {
    public string $name;
    public int $count;

    /** @param array<mixed> $data */
    public function __construct( array $data ) {
        $this->name  = (string) ( $data['name'] ?? '' );
        $this->count = (int) ( $data['count'] ?? 0 );
    }

    /** @return array{name: string, count: int} */
    public function to_array(): array {
        return [ 'name' => $this->name, 'count' => $this->count ];
    }
}
```

---

## 5. Domain 組織結構

```
inc/classes/Domains/
├── Loader.php                 # 實例化所有 Domain API class
└── <Domain>/
    ├── Core/
    │   └── V2Api.php          # REST API endpoint 定義
    └── DTO/
        └── <Name>.php         # Data Transfer Object
```

---

## 6. Admin 頁面整合

### Entry 模式

`Admin\Entry::instance()` 負責：
- 註冊 admin 頁面（`add_action('admin_menu', ...)`）
- 輸出 `<div id="power_shop"></div>` 掛載點
- Admin bar 整合

### Admin Bar 整合

`Admin\Entry::admin_bar_item()` 依上下文顯示不同連結：
- **商品頁** → 連結至 `#/products/edit/{id}`（標籤：「編輯商品」）
- **其他頁** → 連結至 `#/dashboard`（標籤：「電商系統」）
- 僅對擁有 `manage_woocommerce` capability 的使用者顯示。

### Enqueue Guard

腳本僅在 URL 包含 `page=power-shop` 時載入：

```php
if ( ! General::in_url([ 'page=power-shop' ]) ) {
    return;
}
```

**禁止**移除此 guard — 在所有 admin 頁面載入 React bundle 會造成浪費。

---

## 7. Vite 整合

使用 `kucrut/vite-for-wp` 整合 Vite 打包：

```php
// Bootstrap::enqueue_script()
Vite\enqueue_asset( $plugin_dir . '/js/dist', 'js/src/main.tsx' );
$encrypt_env = PowerhouseUtils::simple_encrypt([
    'SITE_URL' => \untrailingslashit(\site_url()),
    'NONCE'    => \wp_create_nonce('wp_rest'),
    // ...
]);
\wp_localize_script( Plugin::$kebab, Plugin::$snake . '_data', [ 'env' => $encrypt_env ] );
```

---

## 8. 安全性

1. **Nonce 驗證** — 所有 REST 呼叫透過 `X-WP-Nonce` header 驗證。
2. **Capability 檢查** — `permission_callback` 使用 Powerhouse 預設認證（`manage_woocommerce`）。
3. **輸入清理** — 所有 REST request params 使用 `WP::sanitize_text_field_deep()`。
4. **輸出跳脫** — `\esc_html()`、`\esc_attr()`、`\esc_url()` 用於所有 PHP 輸出。

---

## 9. WooCommerce 相容性

- 使用 WooCommerce REST API v3（`wc/v3/`）存取商品、訂單、顧客資料。
- 支援 WooCommerce Subscriptions（`subscription`、`variable-subscription` 產品類型）。
- REST API namespace `power-shop` 用於自有端點（Dashboard、Analytics、顧客備註）。

---

## 10. 程式碼品質工具

```bash
# PHP linting（WPCS 規則，設定檔：phpcs.xml）
composer lint

# PHP 靜態分析（PHPStan level 9，設定檔：phpstan.neon）
vendor/bin/phpstan analyse inc --memory-limit=1G
```

- **PHPCS** — WordPress-Core、WordPress-Docs、WordPress-Extra（排除短陣列、Yoda 條件等）。
- **PHPStan** — level 9，包含 WordPress + WooCommerce stubs 及 `powerhouse` plugin stubs。

---

## 11. 參考規格文件

- **API 規格：** `specs/api/api.yml`（OpenAPI 3.0，完整端點定義）
- **資料模型：** `specs/entity/erm.dbml`（9 資料表）
- **功能規格：** `specs/features/**/*.feature`（20 個 Feature）
- **業務流程：** `specs/activities/*.activity`（4 個流程）
