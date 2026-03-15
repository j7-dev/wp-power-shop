# Codebase Structure

```
power-shop/
├── plugin.php                     # Entry point (Plugin class only, no logic)
├── inc/classes/                   # PHP backend (PSR-4: J7\PowerShop\)
│   ├── Bootstrap.php              # Wires Admin + Domains, enqueues scripts
│   ├── Admin/Entry.php            # Admin page rendering + admin bar items
│   ├── Domains/
│   │   ├── Loader.php             # Instantiates all domain API classes
│   │   └── Report/Dashboard/Core/V2Api.php   # Dashboard REST endpoints
│   │   └── Report/LeaderBoards/DTO/Row.php   # DTO for leaderboard data
│   └── Utils/Base.php             # Constants (APP1_SELECTOR, etc.)
├── js/src/                        # React frontend
│   ├── main.tsx                   # React root, mounts App1 on #power_shop
│   ├── App1.tsx                   # Refine + HashRouter + route definitions
│   ├── resources/index.tsx        # Refine resource definitions (sidebar nav)
│   ├── api/                       # CRUD helper wrappers
│   ├── components/                # Shared components (product, order, user, term, etc.)
│   ├── hooks/                     # Custom hooks (useEnv, useGCDItems, etc.)
│   ├── pages/admin/               # Page components (Dashboard, Orders, Product, Users, Analytics, Marketing, WPMediaLibrary)
│   ├── types/                     # TypeScript type definitions
│   └── utils/                     # Env decryption, constants
├── specs/                         # BDD specs (activities, features, API, entity, UI)
├── tests/e2e/                     # Playwright E2E tests
├── legacy/                        # Old code (loaded but DO NOT extend)
└── release/                       # Release scripts (release-it, zip)
```

## Initialization Flow
`plugin.php` → `Plugin::instance()` → `Bootstrap::instance()` → Admin\Entry + Domains\Loader
Admin page renders `<div id="power_shop">`, React mounts on it via Vite.
