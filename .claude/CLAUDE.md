# Power Shop

> **Last Updated:** 2026-03-15
> **Version:** 3.0.12
> **Project Type:** WordPress Plugin (WooCommerce extension, React SPA admin UI)

---

## Project Summary

**Power Shop** (`plugin.php`) is a WordPress plugin that replaces the default WooCommerce admin screens with a **React/TypeScript single-page application** built on [Refine](https://refine.dev/) + [Ant Design](https://ant.design/). The SPA is served inside a full-screen WordPress admin page at `admin.php?page=power-shop`.

- **PHP Namespace:** `J7\PowerShop`
- **Text Domain:** `power_shop`
- **React App Selector:** `#power_shop`
- **REST API Namespace:** `power-shop` → `/wp-json/power-shop/`

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
│   │   ├── general/                   # CopyButton, Price
│   │   ├── order/                     # InfoTable, OrderNotes
│   │   ├── post/                      # PostAction, ToggleVisibility
│   │   ├── product/                   # Fields, ProductEditTable, ProductTable, ProductSelector
│   │   ├── productAttribute/          # EditForm, SortableList (global attributes)
│   │   ├── term/                      # EditForm, SortableList, SortableTree, TaxonomyModal
│   │   └── user/                      # ContactRemarks, OrderCustomerTable, UserTable
│   └── pages/admin/
│       ├── Dashboard/                  # Summary: KPI cards, leaderboards, interval chart
│       ├── Orders/                     # List + Edit
│       ├── Product/                    # List + Edit (tabs) + Taxonomies + Attributes
│       ├── Users/                      # List + Edit
│       ├── Analytics/                  # Revenue analytics with filter & chart
│       ├── Marketing/                  # OneShop (coming soon placeholder)
│       └── WPMediaLibraryPage/         # WP media library browser
├── specs/                              # 規格文件（見下方索引）
└── legacy/                             # Old one-page shop code (loaded in Bootstrap; do NOT extend)
```

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
            └─► Entry::render_page()
                    ├─► Bootstrap::enqueue_script()   ← Vite enqueues js/dist/main.tsx
                    │       └─► wp_localize_script('power-shop', 'power_shop_data', { env: encrypted_env })
                    └─► PowerhouseBase::render_admin_layout(['title' => '...', 'id' => 'power_shop'])
                            └─► outputs <div id="power_shop"></div>

Browser renders
    └─► main.tsx mounts App1 onto #power_shop
            └─► HashRouter → routes render pages
```

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

## Enqueue Guard

Scripts are only loaded when the current URL contains `page=power-shop`:

```php
if ( ! General::in_url([ 'page=power-shop' ]) ) {
    return;
}
```

Do not remove this guard — loading the React bundle on every admin page would be wasteful.

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

## 規格文件索引

完整規格位於 `specs/` 目錄，採用 AIBDD Discovery 多視圖架構：

| 視圖 | 路徑 | 說明 |
|------|------|------|
| Activity | `specs/activities/*.activity` | 4 個業務流程 |
| Feature | `specs/features/**/*.feature` | 20 個 BDD 規格（12 command + 8 query） |
| UI | `specs/ui/*.md` | 9 個頁面規格 |
| API | `specs/api/api.yml` | OpenAPI 3.0 完整端點定義 |
| Entity | `specs/entity/erm.dbml` | DBML 資料模型（9 資料表） |
| Actor | `specs/actors/shop-manager.md` | Actor 定義 |

### 領域分布

| 領域 | Feature 數量 | 說明 |
|------|-------------|------|
| 訂單 (Order) | 6 | create / update-status / edit-address / add-note / bulk-delete / query-list |
| 商品 (Product) | 5 | create-draft / save-data / generate-variations / create-category / query-list |
| 顧客 (Customer) | 5 | edit-profile / edit-user-meta / add-note / query-list / query-detail |
| 儀表板 (Dashboard) | 4 | query-kpi / query-leaderboard / query-revenue-trend / query-revenue-analytics |

> 詳細索引：`specs/README.md`

---

## 相關 Rules 與 SKILL 檔案

### Rules（自動載入）

| 檔案 | 說明 |
|------|------|
| `.claude/rules/react.rule.md` | React / TypeScript 開發慣例 |
| `.claude/rules/wordpress.rule.md` | WordPress / PHP 開發慣例 |
| `.claude/rules/architecture.rule.md` | 系統架構與資料流 |

### SKILL（按需啟用）

| SKILL | 說明 |
|-------|------|
| `.claude/skills/power-shop-php/SKILL.md` | PHP 後端：REST API、Domain、DTO 開發 |
| `.claude/skills/power-shop-react/SKILL.md` | React 前端：頁面、元件、Data Provider 開發 |

### Agents（專案專屬）

| Agent | 說明 |
|-------|------|
| `.claude/agents/e2e.agent.md` | WordPress Plugin E2E 測試專家 |
