# `pipe.yml` 結構速查（Power Shop）

> 對應檔案：`.github/workflows/pipe.yml`
> **兩個 Job**：`claude`（釐清 → 規劃 → 實作）→ `integration-tests`（Playwright E2E → 修復 → AI 驗收 → PR）
>
> ⚠️ Power Shop 與 Power Course 的差異：
> - **無 PHPUnit**（composer.json 沒裝、無 phpunit.xml） → Job 2 走 Playwright E2E（位於 `tests/e2e/`）
> - **無 LC Bypass**（`plugin.php` 沒有 `'capability' => 'manage_woocommerce'` 行）
> - **wp-env port 8890**（非 8895）；Vite dev port 5178
> - **僅 `pnpm run build`**（無 `pnpm run build:wp`）

---

## 一、觸發方式與模式對照

**觸發事件**：`issue_comment` / `pull_request_review_comment` / `pull_request_review`，body 須含 `@claude`。
**Concurrency**：同一 issue/PR 的新 `@claude` 會取消舊的。

### 關鍵字 → 模式對照

| 留言 | 開工（clarifier → tdd） | 自動化測試 + AI 驗收 |
|------|------------------------|-------------------|
| `@claude`（需求還需釐清） | ❌ 僅提澄清問題 | ❌ |
| `@claude`（需求已清楚） | ✅ 由 clarifier 自動升級 pipeline 並一路跑到 tdd | ❌ 需再打 `@claude PR` |
| `@claude 開工`（含 確認/OK/沒問題/開始/go/start） | ✅ | ❌ 需再打 `@claude PR` |
| `@claude 全自動` | ✅ | ✅ 自動 |
| `@claude PR` | ❌ 跳過 | ✅ 於現有分支直接跑 |

**解析優先序**：`全自動` > `PR` > `開工等` > 互動。

---

## 二、Job 1：`claude`

**Runner** `ubuntu-latest` / **Timeout** 180 min / **Permissions**：`contents`/`pull-requests`/`issues: write`、`id-token: write`、`actions: read`

### Job Outputs

| output | 意義 |
|--------|------|
| `branch_name` / `issue_num` | 本輪 `issue/{N}-{timestamp}` 分支與 issue 編號 |
| `initial_sha` | 進入 workflow 時的 HEAD（用於偵測變更） |
| `claude_ok` | clarifier + (planner/tdd) 整體成敗；skipped 視為 OK |
| `has_changes` | 是否有 commit 或 working tree 變動 |
| `agent_name` | `clarifier` / `clarifier+planner` / `...+tdd-coordinator` / `pr-only` |
| `pipeline_mode` / `full_auto_mode` / `pr_mode` | 模式旗標 |
| `run_integration_tests` | `full_auto_mode OR pr_mode` → 控制 Job 2 觸發 |

### Steps 流程

| 段 | 核心動作 |
|----|---------|
| **A** 前置 | eyes reaction → checkout(fetch-depth 0) → `resolve_branch`（找或建 `issue/{N}-*`）→ HTTPS → `save_sha` |
| **B** 模式解析 | `parse_agent` 設 `PIPELINE_MODE`/`FULL_AUTO_MODE`/`PR_MODE` → `fetch_context`（issue 上下文）→ 組 clarifier prompt（`PR_MODE=true` 則跳過） |
| **C** Clarifier | `claude-retry` composite action，agent=`wp-workflows:clarifier`，`max_turns=200`(pipeline)/`120`(interactive)；`PR_MODE=true` 跳過 |
| **D** 橋接 | `detect_specs`（比對 `specs/` diff）→ `dynamic_upgrade`（interactive + 生成 specs → 升級 pipeline_mode）→ 通知留言 |
| **E** Planner | `specs_available && pipeline_mode` 才跑；agent=`wp-workflows:planner`，`max_turns=120` |
| **F** TDD | `planner_ok=true` 才跑；agent=`wp-workflows:tdd-coordinator`，`max_turns=200` |
| **G** 收尾 | `check_result` 匯整 outputs → 若有變更 `git push --force-with-lease` 兜底推送 |

---

## 三、Job 2：`integration-tests`（Playwright E2E）

**依賴** `needs: claude` / **Timeout** 150 min

### 啟動條件

```yaml
run_integration_tests == 'true' &&
(
  pr_mode == 'true'                           # PR 模式旁路 claude_ok/has_changes
  OR
  (claude_ok == 'true' && has_changes == 'true')
)
```

### Steps 流程

| 段 | 核心動作 |
|----|---------|
| **H** 環境 | checkout(branch_name, depth 50) → Node 20 / pnpm / composer → `pnpm run build`（出 `js/dist/` 給 wp-env 載入）→ 建 uploads → wp-env start（3 次重試 15/45/90s + unhealthy 容器 restart） |
| **I** Playwright 安裝 | apt-get noto-cjk → `tests/e2e` 內 `npm install` + `playwright install chromium --with-deps` |
| **J** E2E 3 循環 | `test_cycle_1`（`npx playwright test --reporter=list`）失敗 → `claude_fix_1` → `test_cycle_2`（含重 build）失敗 → `claude_fix_2` → `test_cycle_3`（final，無修復）。所有步驟 `continue-on-error: true`，fix 走 `anthropics/claude-code-action@v1` |
| **K** 彙整 | `final_result` 推導 cycle/status → 用 `templates/test-result-comment.md` 渲染留言 |
| **L** AI 驗收 | `detect_smoke` 檢查 diff 有無動到 `js/src/`、`inc/classes/` → 標記 `.e2e-progress.json`（無 LC bypass）→ 建立輸出目錄 → `run_ai_acceptance`（agent=`wp-workflows:browser-tester`） |
| **M** 媒體 | `collect_smoke_media` 集中到 `/tmp/smoke-media` → 上傳 Bunny CDN（`ci/{branch}/smoke-test`）→ Artifact 備份 7 天 → 發 Smoke Test 報告留言（**已修正 power-course 範本的條件 bug**：`if` 改為引用 `collect_smoke_media.outputs.has_media`） |
| **N** PR 守門 | `run_ai_acceptance.outcome != 'failure'` → `gh pr create`；反之發「驗收失敗不自動開 PR」通知 |

### Job Outputs

`e2e_status` / `e2e_cycle` / `e2e_fix_count`

---

## 四、外部依賴資產

| 類型 | 路徑 |
|------|------|
| Composite action | `./.github/actions/claude-retry` |
| Prompt 模板 | `.github/prompts/{clarifier-pipeline,clarifier-interactive,planner,tdd-coordinator}.md` |
| 留言模板 | `.github/templates/{pipeline-upgrade-comment,test-result-comment,acceptance-comment}.md` |
| Shell script | `.github/scripts/upload-to-bunny.sh` |
| Marketplace | `https://github.com/j7-dev/wp-workflows.git` |
| Secrets | `CLAUDE_CODE_OAUTH_TOKEN`、`BUNNY_STORAGE_{HOST,ZONE,PASSWORD}`、`BUNNY_CDN_URL` |

---

## 五、Gotchas

1. **無 LC Bypass**：`plugin.php` 沒有 `'capability' => 'manage_woocommerce'` 行；外掛授權檢查未經由 `'lc' => false` 跳過。若未來上 LC，需要在 K 段補上 LC bypass step（參考 power-course/.github/workflows/pipe.yml 的「套用 LC Bypass」step）。
2. **無 PHPUnit**：Job 2 走 Playwright E2E（`tests/e2e/`）。若未來新增 PHPUnit，需參考 power-course 的 `npx wp-env run tests-cli --env-cwd=wp-content/plugins/power-shop -- vendor/bin/phpunit ...` 模式插入新 step。
3. **`parse_agent` 英文關鍵字太寬**：`grep -qiE '...|OK|...|go|start'` 大小寫不敏感，一般對話中的 `ok`/`go` 會誤觸。建議加字邊界。
4. **Claude fix prompt 寫死在 workflow**（J 段兩處）：可搬到 `.github/prompts/claude-fix.md`。
5. **AI 驗收 prompt 寫死 `http://localhost:8890`**：與 `.wp-env.json` port 耦合（power-shop 使用 8890）。
6. **修改前端後須重 build**：`test_cycle_2/3` 已內建 `pnpm run build` 重建，但 `test_cycle_1` 未做（依賴 H 段的 build）；fix step 改完 React 後若不重 build，wp-env 會繼續載入舊 dist。
7. **wp-env env-cwd 路徑**：對應 `.wp-env.json` 的 `mappings`（uploads → `./tests/e2e/.uploads`），plugin 路徑為 `wp-content/plugins/power-shop`（與目錄名一致）。

---

## 六、修改自查清單

- [ ] 新增 `env.` / `steps.<id>.outputs.` 引用，名稱是否拼對？
- [ ] 跨 job 走 `needs.<job>.outputs.`，Job 1 `outputs:` 區塊同步新增？
- [ ] Stage gating 改動時，B/D/E/F/G 五段一起看
- [ ] Prompt / 留言模板的 `{{ISSUE_NUM}}` placeholder 有對應？
- [ ] Secrets 是否在 repo settings 備齊？
- [ ] 改了 .wp-env.json 的 port → 同步 AI 驗收 prompt 中的 `http://localhost:8890`？
- [ ] 改了 React 後新增 fix step → 是否需要 `pnpm run build` 重建？
