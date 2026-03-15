# Code Style & Conventions

## PHP
- **Standard**: WordPress Coding Standards (WPCS) with exclusions in `phpcs.xml`
- **Indentation**: Tabs (4-space width)
- **Arrays**: Short syntax `[]` (not `array()`)
- **Yoda conditions**: Not required (excluded)
- **Strict types**: `declare(strict_types=1)` in every file
- **Classes**: Must be `final` (PHPCS enforced)
- **Trait methods**: Must be `final`
- **Namespace**: PSR-4 under `J7\PowerShop\`
- **Singleton pattern**: Via `\J7\WpUtils\Traits\SingletonTrait`
- **PHPStan**: Level 9 — strict type safety

## TypeScript / React
- **Indentation**: Tabs
- **Quotes**: Single quotes (double for JSON/YAML)
- **Semicolons**: None
- **Trailing commas**: Always
- **Print width**: 80
- **Arrow parens**: Always `(x) =>`
- **Components**: Functional components with hooks
- **Lazy loading**: `React.lazy()` for route-level code splitting
- **State management**: React Query for server state, Refine hooks for CRUD
- **Imports**: `@/` alias for `js/src/`, `antd-toolkit` subpath imports

## Architecture Patterns
- Multiple Refine data providers: `default`, `wp-rest`, `wc-rest`, `wc-store`, `bunny-stream`, `power-shop`
- Encrypted env: PHP encrypts → JS decrypts via `simpleDecrypt`; always use `useEnv()` hook
- REST API classes go in `Domains/`, registered in `Domains\Loader`
- No raw fetch/axios: Use Refine hooks with correct dataProvider key
