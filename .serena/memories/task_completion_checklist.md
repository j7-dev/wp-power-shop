# Task Completion Checklist

When a development task is completed, run through this checklist:

## PHP Changes
1. `composer lint` — Ensure WPCS compliance
2. `vendor/bin/phpstan analyse inc --memory-limit=1G` — PHPStan level 9
3. If new REST API class added → register in `Domains\Loader::__construct()`
4. If new constants added → add to `Utils\Base`

## TypeScript/React Changes
1. `npx tsc --noEmit` — Type-check passes
2. `pnpm lint` — ESLint passes
3. `pnpm build` — Production build succeeds
4. If new page added → add route in `App1.tsx` and resource in `resources/index.tsx`
5. If using API → specify correct `dataProvider` key in Refine hooks

## General
1. No secrets in plain JS (use encrypted env pattern)
2. Verify enqueue guard (`page=power-shop`) is preserved
3. Don't add logic to `plugin.php`
4. Don't extend `legacy/` code
