# Suggested Commands

## Development
```bash
pnpm dev                    # Start Vite dev server (port 5178)
pnpm build                  # Production build (output: js/dist/)
pnpm bootstrap              # Run composer install
```

## Code Quality
```bash
composer lint               # PHP linting (WPCS)
vendor/bin/phpcbf            # PHP auto-fix
vendor/bin/phpstan analyse inc --memory-limit=1G   # PHPStan level 9
pnpm lint                   # JS/TS linting
pnpm lint:fix               # JS/TS lint auto-fix
npx tsc --noEmit            # TypeScript type-check
pnpm format                 # Prettier formatting
```

## Testing
```bash
npx wp-env start            # Start wp-env (requires Docker)
npx playwright test         # Run E2E tests
```

## Release
```bash
pnpm sync:version           # Sync package.json version to plugin.php
pnpm release:patch          # Bump patch + build + GitHub release
pnpm release:minor          # Bump minor
pnpm release:major          # Bump major
pnpm zip                    # Create distribution ZIP
```

## i18n
```bash
pnpm i18n                   # Generate .pot file
```

## System (Windows with Git Bash)
```bash
git status / git log / git diff   # Version control
ls / find / grep                   # File exploration (Unix-style via git bash)
```
