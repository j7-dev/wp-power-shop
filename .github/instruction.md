# Power Shop `.github/` 目錄指引（簡化版）

> **用途**：本目錄是 Power Shop（WooCommerce 管理介面延伸外掛）的 GitHub Actions Pipeline 體系。
> 提供「Issue 留言觸發 → AI Clarifier → Planner → TDD → Playwright E2E → AI 驗收 → 自動 PR」一條龍流程。
>
> **完整設計哲學**：見 `power-course/.github/instruction.md`（同公司範本來源），本檔僅記錄 power-shop 的 adapt 細節。

---

## 目錄總覽

```
.github/
├── workflows/
│   ├── pipe.yml             # 核心 pipeline（兩 Job：claude → integration-tests）
│   ├── pipe.md              # pipeline 規格書（中文，必讀）
│   ├── issue.yml            # Issue 開新單時自動展開需求
│   └── act-test.yml         # 本機 act 測試骨架（不發布觸發）
├── actions/
│   └── claude-retry/        # Composite action：3 次重試 + 30s/60s 退避
│       └── action.yml
├── prompts/
│   ├── clarifier-interactive.md   # 互動澄清（第一輪 ≥ 5 題）
│   ├── clarifier-pipeline.md      # Pipeline 模式直接生 specs
│   ├── planner.md
│   └── tdd-coordinator.md
├── templates/
│   ├── acceptance-comment.md      # AI 驗收結果留言
│   ├── pipeline-upgrade-comment.md
│   └── test-result-comment.md     # Playwright E2E 結果留言
├── scripts/
│   └── upload-to-bunny.sh         # Smoke 媒體上 Bunny CDN
└── instruction.md          # 本檔
```

---

## 與 Power Course 範本的差異

| 項目 | Power Course | Power Shop |
|------|-------------|------------|
| 自動化測試 | PHPUnit + Playwright | **僅 Playwright E2E** |
| LC Bypass | 修改 `plugin.php` 注入 `'lc' => false` | **無**（plugin.php 無 `'capability'` 行） |
| wp-env port | 8895 | **8890** |
| testsPort | 8896 | **8900** |
| 前端 build | `pnpm run build && pnpm run build:wp` | **僅 `pnpm run build`** |
| 業務領域 | LMS（線上課程） | WooCommerce 管理（電商） |
| Admin 路由 | `?page=power-course#/courses` | `?page=power-shop#/dashboard` |
| REST API namespace | `power-course` | `power-shop` |
| Plugin slug | `wp-power-course` | `power-shop` |
| `inc/templates/`、`inc/assets/` | 有（前台模板、vanilla TS） | **無**，只有 `inc/classes/` |

---

## 必備 Secrets（repo settings）

| Secret | 用途 |
|--------|------|
| `CLAUDE_CODE_OAUTH_TOKEN` | Claude Code Action 必備 |
| `BUNNY_STORAGE_HOST` / `_ZONE` / `_PASSWORD` | Smoke 媒體 CDN 上傳 |
| `BUNNY_CDN_URL` | 公開預覽 URL |
| `GITHUB_TOKEN` | Actions 預設提供，已擴權 contents/pull-requests/issues:write |

---

## 觸發指令速查

| 指令 | 行為 |
|------|------|
| `@claude` | 互動澄清（第一輪 ≥ 5 題） |
| `@claude 開工` / `@claude OK` / `@claude 確認` | 跳過互動，直接 Clarifier → Planner → TDD（不跑測試） |
| `@claude PR` | 跳過 AI，直接跑 Playwright E2E + AI 驗收 + 自動建 PR |
| `@claude 全自動` | 一條龍：Clarifier → Planner → TDD → E2E → AI 驗收 → PR |

新 Issue 開單時 body 含 `@claude 展開` / `@claude dev`：觸發 `issue.yml` 自動展開需求。

---

## 已知 TODO

- [ ] 若未來上 LC（外掛授權），需要在 plugin.php 加上 `'capability' => 'manage_woocommerce'` 行，並在 pipe.yml 的 L 段補上 LC bypass step
- [ ] 若未來補 PHPUnit，需參考 power-course pipe.yml 的 I/J 段（PHPUnit 三循環 + tests-cli env-cwd）
- [ ] `parse_agent` 的英文關鍵字（`OK|go|start`）建議加字邊界，避免一般對話誤觸
- [ ] J 段 fix step 的 prompt 寫死在 yml，可搬到 `.github/prompts/claude-fix.md`
