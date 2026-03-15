# Power Shop — PHP Domain 開發模式

> 收錄 V2Api、DTO、Loader 的程式碼範本與開發 SOP。

---

## V2Api 完整範本

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
        [
            'endpoint'            => '<resource>',
            'method'              => 'post',
            'permission_callback' => null,
        ],
        [
            'endpoint'            => '<resource>/(?P<id>\d+)',
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

    /**
     * 建立資源
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     * @phpstan-ignore-next-line
     */
    public function post_<resource>_callback( $request ): \WP_REST_Response {
        $body_params = WP::sanitize_text_field_deep( $request->get_body_params(), false );
        // ... 業務邏輯
        return new \WP_REST_Response([ 'code' => 'success', 'data' => [] ]);
    }

    /**
     * 取得單一資源
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     * @phpstan-ignore-next-line
     */
    public function get_<resource>_with_id_callback( $request ): \WP_REST_Response {
        $id = (int) $request->get_param('id');
        // ... 業務邏輯
        return new \WP_REST_Response([ 'code' => 'success', 'data' => [] ]);
    }
}
```

---

## Callback 命名規則速查

| endpoint | method | callback 方法名 |
|----------|--------|-----------------|
| `reports` | GET | `get_reports_callback` |
| `reports/dashboard/stats` | GET | `get_reports_dashboard_stats_callback` |
| `customers/(?P<id>\d+)/notes` | POST | `post_customers_with_id_notes_callback` |
| `customers/(?P<id>\d+)/notes` | GET | `get_customers_with_id_notes_callback` |
| `products/(?P<id>\d+)` | PUT | `put_products_with_id_callback` |

**規則：**
- `{method}_{endpoint_segments}_callback`
- `/` → `_`
- `(?P<id>\d+)` → `with_id`

---

## DTO 範本

```php
<?php
declare(strict_types=1);

namespace J7\PowerShop\Domains\<Domain>\DTO;

/**
 * <Name> DTO
 */
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

---

## Loader 註冊範本

`inc/classes/Domains/Loader.php` 負責實例化所有 Domain API：

```php
<?php
declare(strict_types=1);

namespace J7\PowerShop\Domains;

/**
 * 載入所有 Domain API
 */
final class Loader {
    use \J7\WpUtils\Traits\SingletonTrait;

    public function __construct() {
        // 現有 Domain
        Report\Dashboard\Core\V2Api::instance();

        // 新增 Domain ← 在此加入
        <Domain>\Core\V2Api::instance();
    }
}
```

---

## REST API 開發 SOP

1. **建立 V2Api class** — `inc/classes/Domains/<Domain>/Core/V2Api.php`
2. **定義 `$apis` 陣列** — endpoint、method、permission_callback
3. **實作 callback 方法** — 命名遵循 `{method}_{endpoint}_callback` 規則
4. **輸入清理** — `WP::sanitize_text_field_deep()` 處理所有參數
5. **回傳格式** — `\WP_REST_Response([ 'code' => 'success', 'data' => ... ])`
6. **Loader 註冊** — 在 `Loader.php` 中呼叫 `<Domain>\Core\V2Api::instance()`
7. **驗證** — `composer lint` + `vendor/bin/phpstan analyse inc`

## DTO 開發 SOP

1. **建立 DTO class** — `inc/classes/Domains/<Domain>/DTO/<Name>.php`
2. **定義公開屬性** — 使用明確型別宣告
3. **Constructor** — 接收 `array<mixed> $data`，做型別轉換與預設值
4. **`to_array()`** — 回傳 PHPStan 可驗證的 typed array shape
