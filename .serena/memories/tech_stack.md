# Tech Stack

## Backend
- **PHP 8.0+** (strict_types enabled)
- **WordPress 5.7+** (tested with WP 6.7)
- **WooCommerce 7.6.0+**
- **Composer** for PHP dependency management
- **PSR-4 autoloading**: `J7\PowerShop\` → `inc/classes/`
- **Vite for WP**: `@kucrut/vite-for-wp` bridges Vite output to WordPress enqueue

## Frontend
- **React 18** with **TypeScript**
- **Refine.dev** — CRUD meta-framework (data providers, routing, resources)
- **Ant Design** — UI component library
- **HashRouter** from `react-router`
- **React Query** (`@tanstack/react-query`) — server state management
- **Vite** — bundler (port 5178, entry `js/src/main.tsx`, output `js/dist/`)
- **TailwindCSS** — utility CSS
- **ECharts** — charting library

## Build & Tooling
- **pnpm** (monorepo workspace), **Turborepo** (task runner)
- **Vite** with `@vitejs/plugin-react`, `vite-tsconfig-paths`
- **release-it** for versioning & GitHub releases

## Testing
- **wp-env** (`.wp-env.json`) — local WP test environment (WP 6.7, PHP 8.1, WooCommerce 9.6.2)
- **Playwright** — E2E tests (`tests/e2e/`)

## Code Quality
- **PHPCS** — WordPress Coding Standards (`phpcs.xml`)
- **PHPStan** — level 9 static analysis (`phpstan.neon`)
- **ESLint** — extends `@power/eslint-config`
- **Prettier** — tabs, single quotes, no semicolons, trailing commas
