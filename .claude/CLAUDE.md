# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Version:** 3.0.12
> **Project Type:** WordPress Plugin (WooCommerce extension, React SPA admin UI)

## Project Summary

**Power Shop** replaces WooCommerce admin screens with a React/TypeScript SPA built on Refine + Ant Design, served at `admin.php?page=power-shop`.

- **PHP Namespace:** `J7\PowerShop` | **Text Domain:** `power_shop`
- **React Mount:** `#power_shop` | **REST Namespace:** `power-shop` → `/wp-json/power-shop/`
- **Entry:** `plugin.php` → `Bootstrap` → `Admin\Entry` + `Domains\Loader`
- **Frontend:** `js/src/main.tsx` → `App1.tsx` (Refine + HashRouter)

## Build / Dev / Lint Commands

```bash
# Frontend
pnpm dev              # Vite dev server (HMR, port 5178)
pnpm build            # Production build → js/dist/
pnpm lint             # ESLint
npx tsc --noEmit      # TypeScript type-check

# PHP
composer lint          # PHPCS (WordPress-Core/Docs/Extra, config: phpcs.xml)
vendor/bin/phpstan analyse inc --memory-limit=1G   # PHPStan level 9 (config: phpstan.neon)

# Release
pnpm sync:version     # Ensure package.json == plugin.php version
pnpm release:patch    # Bump + build + GitHub Release + ZIP
pnpm release:minor
pnpm release:major
```

## Common Pitfalls

1. **Don't** add logic in `plugin.php` — only `Plugin` class + `Plugin::instance()` call
2. **Don't** read `window.power_shop_data` directly — use `useEnv()` or `env` from `@/utils`
3. **Don't** use `fetch`/`axios` for API — use Refine hooks with explicit `dataProviderName`
4. **Don't** forget `memo()` on page components — Refine re-renders can be expensive
5. **Don't** place business logic in route components — extract to hooks
6. **Always** specify `dataProviderName` on Refine hooks for non-default resources
7. **Always** register new REST API classes in `Domains\Loader`
8. **Always** use `WP::sanitize_text_field_deep()` on all REST request params
9. **Don't** remove the Enqueue Guard (`General::in_url(['page=power-shop'])`)

## Specs

Complete specs live in `specs/` using AIBDD Discovery multi-view architecture. See `specs/README.md` for the full index.

| View | Path | Count |
|------|------|-------|
| Activity | `specs/activities/*.activity` | 4 |
| Feature | `specs/features/**/*.feature` | 20 (12 command + 8 query) |
| UI | `specs/ui/*.md` | 9 pages |
| API | `specs/api/api.yml` | OpenAPI 3.0 |
| Entity | `specs/entity/erm.dbml` | 9 tables |
