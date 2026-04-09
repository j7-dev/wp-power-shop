# Power Shop | 讓電商管理更便利 🛒

> 優化 WooCommerce 操作介面，以更人性化的方式管理電商平台

[![Version](https://img.shields.io/badge/version-3.0.11-blue)](https://github.com/zenbuapps/wp-power-shop/releases)
[![PHP](https://img.shields.io/badge/PHP-8.0%2B-777BB4)](https://www.php.net/)
[![WordPress](https://img.shields.io/badge/WordPress-5.7%2B-21759B)](https://wordpress.org/)
[![WooCommerce](https://img.shields.io/badge/WooCommerce-7.6.0%2B-96588A)](https://woocommerce.com/)
[![License](https://img.shields.io/badge/license-GPL--2.0-green)](LICENSE)

---

## 📖 Overview

**Power Shop** is a WordPress plugin that replaces the default WooCommerce admin UI with a modern, React-based single-page application. Instead of navigating through multiple native WooCommerce screens, store managers get a unified, streamlined interface built on [Refine](https://refine.dev/) + [Ant Design](https://ant.design/).

The plugin is part of the **Powerhouse** ecosystem — a suite of premium WordPress plugins developed under the `J7\` namespace.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Dashboard / Summary** | Real-time KPI cards (revenue, orders, users) with period-over-period comparison, top products/customers leaderboards, and an interval revenue chart |
| **Order Management** | Paginated order list with bulk delete; per-order edit view |
| **Product Management** | Full product editor with tabbed UI (Description, Price, Stock, Attributes, Variations, Linked Products, Advanced, Sales Analytics); product taxonomy & attribute managers |
| **Customer Management** | User list and individual user edit view |
| **Analytics** | Revenue analytics page with date-range filter, default & area-chart view types |
| **Media Library** | WordPress media library integration |
| **Marketing / One Shop** | One-page shop builder _(coming soon)_ |
| **Admin Bar Integration** | Contextual shortcut: shows "電商系統" on general pages and "編輯商品" when viewing a WooCommerce product |

---

## 🔧 Requirements

| Dependency | Minimum Version |
|---|---|
| PHP | 8.0 |
| WordPress | 5.7 |
| WooCommerce | 7.6.0 |
| [Powerhouse](https://github.com/zenbuapps/wp-powerhouse) | 3.3.20 |

---

## ⬇️ Installation

### From Release ZIP (Recommended)

1. Download the latest release from [GitHub Releases](https://github.com/zenbuapps/wp-power-shop/releases).
2. In WordPress admin → **Plugins → Add New → Upload Plugin**, upload the ZIP.
3. Activate **Power Shop**.
4. Ensure **WooCommerce** and **Powerhouse** are also active.

### From Source (Development)

```bash
# 1. Clone into your WordPress plugins directory
git clone https://github.com/zenbuapps/wp-power-shop.git power-shop
cd power-shop

# 2. Install PHP dependencies
composer install

# 3. Install JS dependencies
pnpm install

# 4. Build assets
pnpm build          # production build → js/dist/
# or
pnpm dev            # development server on port 5178
```

---

## 🚀 Development

### Project Structure

```
power-shop/
├── plugin.php                  # Plugin entry point (headers + Plugin class)
├── inc/
│   └── classes/
│       ├── Bootstrap.php       # Main bootstrap: wires Admin + Domains
│       ├── Admin/
│       │   └── Entry.php       # Admin page rendering + admin bar item
│       ├── Domains/
│       │   ├── Loader.php      # REST API domain loader
│       │   └── Report/
│       │       ├── Dashboard/Core/V2Api.php   # GET /power-shop/reports/dashboard/stats
│       │       └── LeaderBoards/DTO/Row.php   # Leaderboard data DTO
│       └── Utils/
│           └── Base.php        # Plugin constants (APP1_SELECTOR, API_TIMEOUT…)
├── js/
│   ├── src/
│   │   ├── main.tsx            # React root – mounts App1 onto #power_shop
│   │   ├── App1.tsx            # Refine app + HashRouter + all routes
│   │   ├── pages/admin/
│   │   │   ├── Dashboard/      # Summary page with KPI cards + charts
│   │   │   ├── Orders/         # Order list & edit
│   │   │   ├── Product/        # Product list, edit tabs, taxonomies, attributes
│   │   │   ├── Users/          # Customer list & edit
│   │   │   ├── Analytics/      # Revenue analytics charts
│   │   │   ├── Marketing/      # One-shop page (coming soon)
│   │   │   └── WPMediaLibraryPage/
│   │   ├── components/         # Reusable components (product, order, user…)
│   │   ├── hooks/              # Custom React hooks (useEnv, useGCDItems…)
│   │   ├── api/                # API resource CRUD helpers
│   │   ├── resources/          # Refine resource definitions
│   │   ├── types/              # Shared TypeScript types
│   │   └── utils/              # env decryption, constants, helper functions
│   └── dist/                   # Built assets (generated, do not edit)
├── legacy/                     # Legacy one-page shop code (being phased out)
├── vendor/                     # Composer dependencies
├── composer.json
├── package.json
├── vite.config.ts
├── tsconfig.json
├── phpcs.xml
└── phpstan.neon
```

### Available Scripts

```bash
# --- PHP ---
composer install            # Install PHP dependencies
composer lint               # Run PHPCS (WordPress coding standards)

# --- JS / Frontend ---
pnpm dev                    # Vite dev server (port 5178, hot-reload)
pnpm build                  # Production build → js/dist/
pnpm format                 # Format TSX with prettier-eslint
pnpm lint                   # ESLint + phpcbf
pnpm lint:fix               # Auto-fix ESLint + phpcbf

# --- i18n ---
pnpm i18n                   # Generate .pot file
pnpm i18n:commit            # Generate .pot + amend last commit

# --- Release ---
pnpm release:patch          # Bump patch, build, create GitHub release
pnpm release:minor          # Bump minor, build, create GitHub release
pnpm release:major          # Bump major, build, create GitHub release
pnpm sync:version           # Sync version between package.json ↔ plugin.php
```

### Environment Variables

JavaScript environment data is passed **encrypted** from PHP via `wp_localize_script` under the key `power_shop_data.env`. The encryption uses a simple base64 + character-shift cipher (`PowerhouseUtils::simple_encrypt` / `simpleDecrypt`).

| Variable | Source | Purpose |
|---|---|---|
| `SITE_URL` | `site_url()` | WordPress site URL |
| `API_URL` | `rest_url()` | REST API base URL |
| `CURRENT_USER_ID` | `get_current_user_id()` | Logged-in user ID |
| `CURRENT_POST_ID` | `get_the_ID()` | Current post ID |
| `APP_NAME` | `Plugin::$app_name` | "Power Shop" |
| `KEBAB` | `Plugin::$kebab` | "power-shop" |
| `SNAKE` | `Plugin::$snake` | "power_shop" |
| `NONCE` | `wp_create_nonce('wp_rest')` | REST API nonce |
| `APP1_SELECTOR` | `Base::APP1_SELECTOR` | "#power_shop" |
| `BUNNY_LIBRARY_ID` | Powerhouse Settings | Bunny.net video library ID |
| `BUNNY_CDN_HOSTNAME` | Powerhouse Settings | Bunny.net CDN hostname |
| `BUNNY_STREAM_API_KEY` | Powerhouse Settings | Bunny.net Stream API key |
| `ELEMENTOR_ENABLED` | Active plugins check | Whether Elementor is active |

### REST API Endpoints

All endpoints are registered under the `power-shop` namespace at `/wp-json/power-shop/`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/wp-json/power-shop/reports/dashboard/stats` | Dashboard KPIs, leaderboards, and revenue intervals |

**`GET /reports/dashboard/stats` Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `after` | `string` | Today 00:00:00 | ISO 8601 start date |
| `before` | `string` | Today 23:59:59 | ISO 8601 end date |
| `per_page` | `int` | `5` | Leaderboard rows |
| `compare_type` | `string` | `"day"` | Comparison period: `day`, `week`, `month`, `year` |
| `compare_value` | `int` | `1` | Number of comparison periods |

**Response shape:**

```json
{
  "code": "get_reports_dashboard_stats_callback",
  "message": "success",
  "data": {
    "total_sales": 12345.67,
    "total_sales_compared": 9876.54,
    "new_registration": 5,
    "new_registration_compared": 3,
    "orders_count_unshipped": 12,
    "orders_count_unshipped_compared": 8,
    "orders_count_unpaid": 4,
    "orders_count_unpaid_compared": 2,
    "products": [{ "name": "...", "count": 10, "total": 1000.0 }],
    "customers": [{ "name": "...", "count": 5, "total": 500.0 }],
    "intervals": [{ "interval": "hour", "date_start": "...", "total_sales": 200.0, "..." : "..." }]
  }
}
```

### Frontend Data Providers (Refine)

| Provider Key | Base URL | Used For |
|---|---|---|
| `default` | `/wp-json/v2/powerhouse` | Powerhouse core CRUD |
| `wp-rest` | `/wp-json/wp/v2` | WordPress posts, media |
| `wc-rest` | `/wp-json/wc/v3` | WooCommerce products, orders, users |
| `wc-store` | `/wp-json/wc/store/v1` | WooCommerce Store API |
| `bunny-stream` | Bunny.net API | Video uploads/playback |
| `power-shop` | `/wp-json/power-shop` | Plugin-specific endpoints |

### Frontend Routes (HashRouter)

```
#/dashboard                    → Summary (KPI dashboard)
#/orders                       → OrdersList
#/orders/edit/:id              → OrdersEdit
#/users                        → UsersList
#/users/edit/:id               → UsersEdit
#/products                     → ProductList
#/products/edit/:id            → ProductEdit (tabbed)
#/products/taxonomies          → ProductTaxonomies
#/products/attributes          → ProductAttributes
#/marketing/one-shop           → OneShop (coming soon)
#/analytics                    → Analytics (revenue charts)
#/wp-media-library             → WPMediaLibraryPage
```

### Product Edit Tabs

The product editor (`#/products/edit/:id`) uses a tab-based layout. Tabs are shown/hidden conditionally based on product type:

| Tab Key | Label | Shown For |
|---|---|---|
| `Description` | 描述 | All types |
| `Price` | 價格 | All except `grouped`, `variable` |
| `Stock` | 庫存 | All types |
| `Attributes` | 商品規格 | All types |
| `Variation` | 商品款式 | `variable`, `subscription_variable` only |
| `Linked` | 連接商品 | All types |
| `Advanced` | 進階設定 | All types |
| `Analytics` | 銷售數據 | All types |

---

## 🏗️ Architecture

```
WordPress / WooCommerce
        │
        ▼
   plugin.php ──► Plugin (PluginTrait + SingletonTrait)
        │
        ▼
   Bootstrap
   ├── require legacy/plugin.php   (legacy one-page shop)
   ├── Admin\Entry::instance()     (register admin page + admin bar)
   ├── Domains\Loader::instance()  (register REST APIs)
   ├── admin_enqueue_scripts       (load React app on ?page=power-shop)
   └── wp_enqueue_scripts          (load React app on ?page=power-shop)

   REST API Layer
   └── Domains\Report\Dashboard\Core\V2Api
       └── GET /power-shop/reports/dashboard/stats

   React SPA (js/src/)
   └── main.tsx  →  App1.tsx (Refine + HashRouter)
       ├── Dashboard (Summary)
       ├── Orders (List + Edit)
       ├── Products (List + Edit + Taxonomies + Attributes)
       ├── Users (List + Edit)
       ├── Analytics (Revenue)
       ├── Marketing (One Shop)
       └── WP Media Library
```

---

## 🧩 Key Packages

| Package | Purpose |
|---|---|
| `kucrut/vite-for-wp` | PHP-side Vite asset enqueuing |
| `j7-dev/wp-plugin-trait` | `PluginTrait` + `SingletonTrait` base classes |
| `@refinedev/core` | Headless CRUD framework (data layer) |
| `@refinedev/antd` | Ant Design integration for Refine |
| `@refinedev/react-router` | Router bindings for Refine |
| `antd-toolkit` | Shared utilities, hooks, WP helpers |
| `@tanstack/react-query` | Server state management |
| `echarts` | Charts for analytics views |
| `react-countup` | Animated number counters in dashboard cards |
| `dayjs` | Date manipulation |

---

## 🌐 Internationalization

- **Text Domain:** `power_shop`
- **Domain Path:** `/languages`
- Generate POT file: `pnpm i18n`

---

## 📄 License

GPL v2 or later — see [LICENSE](LICENSE).

---

## 👤 Author

**JerryLiu (j7-dev)**
- GitHub: [https://github.com/j7-dev](https://github.com/j7-dev)
- Plugin URI: [https://powerhouse.cloud/power-shop/](https://powerhouse.cloud/power-shop/)
