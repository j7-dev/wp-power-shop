# Power Shop — Project Overview

**Power Shop** (`plugin.php`, v3.0.12) is a WordPress plugin that replaces default WooCommerce admin screens with a **React/TypeScript single-page application** built on Refine.dev + Ant Design.

## Key Identifiers
- PHP Namespace: `J7\PowerShop`
- Text Domain: `power_shop`
- React App Selector: `#power_shop`
- REST API Namespace: `power-shop` → `/wp-json/power-shop/`
- Admin page URL: `admin.php?page=power-shop`

## Dependencies
- Required plugins: WooCommerce (7.6.0+), Powerhouse (3.3.20+)
- Shared library: `antd-toolkit` (workspace package)
- PHP trait library: `j7-dev/wp-plugin-trait`

## Monorepo Context
Lives inside a pnpm/Turborepo workspace. Shared packages:
- `antd-toolkit` — React/Antd/WP/Refine utilities (subpath imports: `antd-toolkit`, `antd-toolkit/refine`, `antd-toolkit/wp`)
- `@power/eslint-config`, `@power/tailwind-config`, `@power/typescript-config`

## Domains
4 business domains: Orders, Products, Customers, Dashboard (analytics/KPI).
Specs in `specs/` using AIBDD Discovery multi-view architecture (20 features, 9 UI specs, OpenAPI, DBML).
