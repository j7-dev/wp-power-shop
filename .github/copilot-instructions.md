# Power Shop — Copilot Instructions

> **Last Updated:** 2025-07-10
> **Version:** 3.0.11
> **Project Type:** WordPress Plugin (WooCommerce extension, React SPA admin UI)

---

## Project Summary

**Power Shop** (`plugin.php`) is a WordPress plugin that replaces the default WooCommerce admin screens with a **React/TypeScript single-page application** built on [Refine](https://refine.dev/) + [Ant Design](https://ant.design/). The SPA is served inside a full-screen WordPress admin page at `admin.php?page=power-shop`.

- **PHP Namespace:** `J7\PowerShop`
- **Text Domain:** `power_shop`
- **React App Selector:** `#power_shop`
- **REST API Namespace:** `power-shop` → `/wp-json/power-shop/`

---

## Mandatory Conventions (Always Follow)

### PHP

1. **`declare(strict_types=1);`** at the top of every PHP file, always.
2. **Namespace** every class under `J7\PowerShop\<Domain>` (PSR-4, mapped from `inc/classes/`).
3. **`final class`** for all concrete classes; `abstract class` for base utilities.
4. Use **`SingletonTrait`** (`\J7\WpUtils\Traits\SingletonTrait`) on every instantiated class; call via `ClassName::instance()`.
5. All **method/function comments in Traditional Chinese (繁體中文)**.
6. **`snake_case`** for variables, methods, functions; **`PascalCase`** for class names; **`UPPER_SNAKE_CASE`** for constants.
7. Use **`\add_action()`** / **`\add_filter()`** with fully-qualified function references — prefer `[ __CLASS__, 'method' ]`.
8. Always **sanitize inputs** (`WP::sanitize_text_field_deep`, `\sanitize_text_field`, etc.) and **escape outputs** (`\esc_html`, `\esc_attr`, `\esc_url`).
9. REST API permission callbacks: `null` means the default Powerhouse auth is used (check `manage_woocommerce` internally where needed).
10. Run `composer lint` (PHPCS) and `vendor/bin/phpstan analyse inc` before committing PHP changes.

### TypeScript / React

1. **Functional components only** — no class components.
2. Use **`memo()`** on every page-level and heavy component.
3. **`useEnv()`** hook (from `@/hooks`) to read decrypted environment variables — never read `window.power_shop_data` directly.
4. Import paths: use `@/` alias for `js/src/`.
5. All **UI text in Traditional Chinese (繁體中文)** — this is a Taiwanese product.
6. Use **Refine's data hooks** (`useTable`, `useForm`, `useCustom`, `useCreate`, etc.) for all API calls — do not use raw `fetch` or `axios` directly.
7. Specify the correct **`dataProvider`** key on every Refine hook call:
   - `'default'` — Powerhouse core (posts, media, etc.)
   - `'wc-rest'` — WooCommerce products, orders, users
   - `'wc-store'` — WooCommerce Store API (cart, checkout)
   - `'power-shop'` — this plugin's own REST endpoints
   - `'wp-rest'` — WordPress REST API
   - `'bunny-stream'` — Bunny.net video operations
8. Use **Ant Design v5** components; follow the `ConfigProvider` theme token: `colorPrimary: '#1677ff'`, `borderRadius: 6`.
9. Run `pnpm lint` (ESLint) before committing frontend changes.

---

## Directory Map

```
power-shop/
├── plugin.php                          # ← Plugin entry; do NOT add logic here
├── inc/classes/
│   ├── Bootstrap.php                   # Wires Admin + Domains; both enqueue scripts
│   ├── Admin/
│   │   └── Entry.php                   # Admin page + admin bar integration
│   ├── Domains/
│   │   ├── Loader.php                  # Instantiates all domain API classes
│   │   └── Report/
│   │       ├── Dashboard/Core/V2Api.php    # GET /power-shop/reports/dashboard/stats
│   │       └── LeaderBoards/DTO/Row.php    # DTO: { name, count, total }
│   └── Utils/
│       └── Base.php                    # Constants: APP1_SELECTOR, API_TIMEOUT, DEFAULT_IMAGE
├── js/src/
│   ├── main.tsx                        # React root: mounts App1 on #power_shop
│   ├── App1.tsx                        # Refine + HashRouter + all route definitions
│   ├── resources/index.tsx             # Refine resource definitions (sidebar nav)
│   ├── hooks/
│   │   ├── useEnv.tsx                  # Typed wrapper for antd-toolkit's useEnv
│   │   ├── useGCDItems.tsx             # Greatest-common-denominator items util
│   │   └── useProductsOptions.tsx
│   ├── utils/
│   │   ├── env.tsx                     # Decrypts window.power_shop_data.env
│   │   └── constants.ts               # INFO_LABEL_MAPPER (address field labels)
│   ├── api/resources/                  # CRUD helper wrappers (create/get/update/delete)
│   ├── components/
│   │   └── product/                   # Shared product components + types
│   └── pages/admin/
│       ├── Dashboard/                  # Summary: KPI cards, leaderboards, interval chart
│       ├── Orders/                     # List + Edit
│       ├── Product/                    # List + Edit (tabs) + Taxonomies + Attributes
│       ├── Users/                      # List + Edit
│       ├── Analytics/                  # Revenue analytics with filter & chart
│       ├── Marketing/                  # OneShop (coming soon placeholder)
│       └── WPMediaLibraryPage/         # WP media library browser
└── legacy/                             # Old one-page shop code (loaded in Bootstrap; do NOT extend)
```

---

## PHP Architecture Patterns

### Adding a New REST API Domain

1. Create `inc/classes/Domains/<Domain>/Core/V2Api.php`:

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
        // ... logic
        return new \WP_REST_Response([ 'code' => 'success', 'data' => [] ]);
    }
}
```

2. Register it in `inc/classes/Domains/Loader.php`:

```php
public function __construct() {
    Report\Dashboard\Core\V2Api::instance();
    <Domain>\Core\V2Api::instance(); // ← add here
}
```

### ApiBase Callback Naming Convention

`ApiBase` auto-resolves callbacks using the HTTP method + endpoint path. For endpoint `products/(?P<id>\d+)` with method `get`:
- Callback method name: `get_products_with_id_callback`

Pattern: `{method}_{endpoint_segments_underscored}_callback`
- Slashes (`/`) → `_`
- Regex groups like `(?P<id>\d+)` → `with_id`

### DTO Pattern

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

## Frontend Architecture Patterns

### Adding a New Page

1. **Create the page component** under `js/src/pages/admin/<Section>/index.tsx`:

```tsx
import { memo } from 'react'

const MyPageComponent = () => {
  return <div>My Page</div>
}

export const MyPage = memo(MyPageComponent)
```

2. **Export it** from `js/src/pages/admin/index.tsx`.

3. **Register the resource** in `js/src/resources/index.tsx`:

```tsx
{
  name: 'my-resource',
  list: '/my-path',
  meta: { label: '我的頁面', icon: <SomeIcon /> },
}
```

4. **Add a route** in `js/src/App1.tsx`:

```tsx
<Route path="my-path">
  <Route index element={<MyPage />} />
</Route>
```

### Using the Dashboard API

```tsx
import { useCustom, useApiUrl } from '@refinedev/core'
import { TDashboardStats } from './types'

const apiUrl = useApiUrl('power-shop')
const { data, isLoading } = useCustom<TDashboardStats>({
  url: `${apiUrl}/reports/dashboard/stats`,
  method: 'get',
  config: { query: { after: '...', before: '...', per_page: 5 } },
})
```

### useEnv Hook

```tsx
import { useEnv } from '@/hooks'

const { SITE_URL, API_URL, NONCE, KEBAB, ELEMENTOR_ENABLED } = useEnv()
```

### Product Edit Form Pattern

Product edit (`pages/admin/Product/Edit/index.tsx`) uses `useForm` from `@refinedev/antd` with `queryMeta.variables.partials` to request specific data slices. Always pass `partials` when needed:

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

Available partials: `basic`, `detail`, `price`, `stock`, `sales`, `size`, `subscription`, `taxonomy`, `attribute`, `variation`.

---

## Plugin Initialization Flow

```
WordPress loads plugin.php
    └─► Plugin::instance()
            └─► PluginTrait::init() registers plugin metadata
                    └─► Bootstrap::instance()
                            ├─► require legacy/plugin.php
                            ├─► Admin\Entry::instance()
                            │       ├─► add_action('current_screen', maybe_output_admin_page)
                            │       └─► add_action('admin_bar_menu', admin_bar_item)
                            ├─► Domains\Loader::instance()
                            │       └─► Report\Dashboard\Core\V2Api::instance()
                            │               └─► registers REST routes
                            ├─► add_action('admin_enqueue_scripts', enqueue_script)
                            └─► add_action('wp_enqueue_scripts', enqueue_script)

Request: admin.php?page=power-shop
    └─► Entry::maybe_output_admin_page()
            └─► Bootstrap::enqueue_script()   ← Vite enqueues js/dist/main.tsx
                    └─► wp_localize_script('power-shop', 'power_shop_data', { env: encrypted_env })
            └─► PowerhouseBase::render_admin_layout(['title' => '...', 'id' => 'power_shop'])
                    └─► outputs <div id="power_shop"></div>

Browser renders
    └─► main.tsx mounts App1 onto #power_shop
            └─► HashRouter → routes render pages
```

---

## Enqueue Guard

Scripts are only loaded when the current URL contains `page=power-shop`:

```php
if ( ! General::in_url([ 'page=power-shop' ]) ) {
    return;
}
```

Do not remove this guard — loading the React bundle on every admin page would be wasteful.

---

## Encrypted Environment Pattern

PHP encrypts the env array with a simple base64 + character-shift cipher before passing it to JS. Never store sensitive values (API secrets, nonces) in plain JS variables.

**PHP side** (`Bootstrap::enqueue_script`):
```php
$encrypt_env = PowerhouseUtils::simple_encrypt([
    'SITE_URL'  => \untrailingslashit(\site_url()),
    'NONCE'     => \wp_create_nonce('wp_rest'),
    // ...
]);
\wp_localize_script(Plugin::$kebab, Plugin::$snake . '_data', ['env' => $encrypt_env]);
```

**JS side** (`js/src/utils/env.tsx`):
```ts
import { simpleDecrypt } from 'antd-toolkit'
const encryptedEnv = window?.power_shop_data?.env
export const env = simpleDecrypt(encryptedEnv)
```

---

## REST API Reference

### `GET /wp-json/power-shop/reports/dashboard/stats`

**Query parameters:**

| Param | Type | Default | Notes |
|---|---|---|---|
| `after` | `string` | Today `00:00:00` | ISO 8601 (`Y-m-d\TH:i:s`) |
| `before` | `string` | Today `23:59:59` | ISO 8601 |
| `per_page` | `int` | `5` | Leaderboard rows |
| `compare_type` | `day\|week\|month\|year` | `day` | Comparison window type |
| `compare_value` | `int` | `1` | Comparison window count |

**Response `data` fields:**

| Field | Type | Description |
|---|---|---|
| `total_sales` | `float` | Revenue in selected range |
| `total_sales_compared` | `float` | Revenue in comparison range |
| `new_registration` | `int` | New users in range |
| `new_registration_compared` | `int` | New users in comparison range |
| `orders_count_unshipped` | `int` | Orders with status `processing` |
| `orders_count_unpaid` | `int` | Orders with status `pending` or `on-hold` |
| `products` | `{name,count,total}[]` | Top products leaderboard |
| `customers` | `{name,count,total}[]` | Top customers leaderboard |
| `intervals` | `object[]` | Revenue intervals (hour/day/week/month) with subtotals |

---

## Admin Bar Integration

`Admin\Entry::admin_bar_item()` adds a contextual item:
- On **product pages** → links to `#/products/edit/{id}` (label: "編輯商品")
- Everywhere else → links to `#/dashboard` (label: "電商系統")
- Only shown to users with `manage_woocommerce` capability.

---

## Product Type Conditions

Several UI elements are conditional on the WooCommerce product type:

| Condition | Check |
|---|---|
| Show Variation tab | `isVariable(watchProductType)` — types `variable`, `subscription_variable` |
| Hide Price tab | types `grouped` or `variable` |
| Disable save button | Active tab is `Attributes`, `Variation`, or `Analytics` |

---

## Code Quality Tooling

```bash
# PHP linting (WPCS rules, level set in phpcs.xml)
composer lint

# PHP static analysis (PHPStan level 9)
vendor/bin/phpstan analyse inc --memory-limit=1G

# JS linting
pnpm lint

# JS type-check
npx tsc --noEmit
```

**PHPCS config:** `phpcs.xml` — WordPress-Core, WordPress-Docs, WordPress-Extra with specific exclusions for short arrays, yoda conditions, etc.

**PHPStan config:** `phpstan.neon` — level 9, includes WordPress + WooCommerce stubs and sibling `powerhouse` plugin stubs.

---

## Release Workflow

```bash
pnpm sync:version           # Ensure package.json version == plugin.php version
pnpm release:patch          # Bump patch + build + create GitHub release + upload ZIP
pnpm release:minor          # Bump minor + …
pnpm release:major          # Bump major + …
```

Uses `release-it` configured in `release/.release-it.cjs`. Requires a `.env` file with GitHub credentials.

---

## Common Pitfalls

1. **Don't** add PHP logic directly in `plugin.php` — only the `Plugin` class and `Plugin::instance()` call live there.
2. **Don't** import `window.power_shop_data` directly in TypeScript — always use `useEnv()` or the exported `env` from `@/utils`.
3. **Don't** use raw `fetch`/`axios` for API calls — use Refine hooks with the correct `dataProvider` key.
4. **Don't** forget `memo()` on page components — React re-renders in Refine can be expensive.
5. **Don't** place business logic in route components — extract to hooks.
6. **Always** specify `dataProvider` explicitly when using Refine hooks that touch non-default resources (e.g., WooCommerce).
7. **Always** add new REST API classes to `Domains\Loader` to register them.
8. **Always** use `WP::sanitize_text_field_deep()` on all incoming REST request params.

---

## Instructions Directory

Detailed per-concern instructions are kept in `instructions/` at the project root. To bootstrap this directory run:

```bash
mkdir instructions
```

Then create the following files (stubs provided below):

- **`instructions/php-backend.md`** — PHP class patterns, REST API templates, DTO pattern, admin page integration, security checklist
- **`instructions/react-frontend.md`** — React component conventions, Refine hooks usage, page/route scaffolding, product edit tab system
- **`instructions/architecture.md`** — Full-stack architecture diagram, plugin initialization flow, encrypted env pattern, release workflow

---

