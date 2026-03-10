---
name: Duplicate Code Detector
description: 識別整個程式碼庫中的重複程式碼模式，並建議重構機會
on:
  workflow_dispatch:
  schedule: weekly on monday around 01:30
permissions:
  contents: read
  issues: read
  pull-requests: read
engine:
  id: copilot
  model: claude-opus-4.6
  agent: wordpress-reviewer
tools:
  serena: ["php", "typescript"]
safe-outputs:
  create-issue:
    expires: 2d
    title-prefix: "[duplicate-code] "
    labels: [code-quality, automated-analysis, cookie]
    assignees: copilot
    group: true
    max: 3
timeout-minutes: 15
strict: true
imports:
  - shared/mood.md
  - ../copilot-instructions.md
  - ../skills/power-shop/SKILL.md
---

# 重複程式碼偵測

使用 Serena 的語意程式碼分析功能分析程式碼，識別重複模式並回報需要重構的重要發現。

## 任務

透過以下步驟偵測並回報程式碼重複：

1. **分析近期 Commit**：審查最新 commit 中的變更
2. **偵測重複程式碼**：使用語意分析識別相似或重複的程式碼模式
3. **回報發現**：若偵測到顯著的重複（閾值：超過 10 行或 3 個以上的相似模式），建立詳細的 issue

## 上下文

- **Repository**: ${{ github.repository }}
- **Commit ID**: ${{ github.event.head_commit.id }}
- **觸發者**: @${{ github.actor }}

## 分析工作流程

### 1. 專案啟用

在 Serena 中啟用專案：
- 使用 `activate_project` 工具，設定 workspace 路徑為 `${{ github.workspace }}`（掛載的 repository 目錄）
- 這會設定語意程式碼分析環境

### 2. 變更檔案分析

識別並分析修改的檔案：
- 確認近期 commit 中變更的檔案
- **只分析 `.php`、`.ts`、`.tsx` 檔案** — 排除所有其他檔案類型
- **排除 vendor 和建置目錄**：`vendor/`、`node_modules/`、dist 目錄、`release/`
- **排除 lock 和設定檔**：`*.lock.*`、`composer.lock`、`package-lock.json`
- **排除 workflow 檔案**（`.github/workflows/*` 下的檔案）
- 使用 `get_symbols_overview` 了解檔案結構
- 使用 `read_file` 檢查修改的檔案內容

### 3. 重複偵測

套用語意程式碼分析尋找重複：

**Symbol 層級分析**：
- 對變更檔案中的重要函式/方法，使用 `find_symbol` 搜尋名稱相似的 symbol
- 使用 `find_referencing_symbols` 了解使用模式
- 識別不同檔案中名稱相似的函式（例如不同模組中的 `processData`）

**模式搜尋**：
- 使用 `search_for_pattern` 尋找相似的程式碼模式
- 搜尋重複指標：
  - 相似的函式簽名
  - 重複的邏輯區塊
  - 相似的變數命名模式
  - 幾乎相同的程式碼區塊

**結構分析**：
- 使用 `list_dir` 和 `find_file` 識別名稱或用途相似的檔案
- 比較不同檔案的 symbol 概覽以找出結構相似性

### 4. 重複評估

評估發現以識別真正的程式碼重複：

**重複類型**：
- **完全重複**：相同的程式碼區塊出現在多個地方
- **結構重複**：相同的邏輯但有些微變化（不同的變數名稱等）
- **功能重複**：同一功能的不同實作
- **複製貼上程式設計**：可以提取為共用工具的相似程式碼區塊

**評估標準**：
- **嚴重性**：重複程式碼的數量（程式碼行數、出現次數）
- **影響**：重複發生的位置（關鍵路徑、頻繁呼叫的程式碼）
- **可維護性**：重複如何影響程式碼的可維護性
- **重構機會**：重複是否可以輕鬆重構

### 5. Issue 回報

為每個發現的不同重複模式建立獨立的 issue（每次執行最多 3 個模式）。每個模式應有自己的 issue 以便針對性修復。

**何時建立 Issue**：
- 只有在發現顯著重複時才建立 issue（閾值：超過 10 行重複程式碼，或 3 個以上相似模式的實例）
- **每個不同的模式建立一個 issue** — 不要將多個模式放在同一個 issue 中
- 若發現超過 3 個模式，限制為最重要的前 3 個
- 從 safe-outputs MCP 使用 `create_issue` 工具，**每個模式呼叫一次**

**每個模式的 Issue 內容**：
- **執行摘要**：此特定重複模式的簡短描述
- **重複詳情**：此模式的具體位置和程式碼區塊
- **嚴重性評估**：此模式的影響和可維護性問題
- **重構建議**：消除此模式的建議方式
- **程式碼範例**：此模式的具體範例，包含檔案路徑和行號

## 偵測範圍

### 回報這些問題

- 不同檔案中相同或幾乎相同的函式
- 可以提取為工具函式的重複程式碼區塊
- 有重疊功能的相似類別或模組
- 稍作修改後複製貼上的程式碼
- 跨元件的重複業務邏輯

### 跳過這些模式

- 標準樣板程式碼（import、export、WordPress hooks 註冊模式）
- **Vendor 和建置目錄**：`vendor/`、`node_modules/`、dist 目錄、`release/`
- **Lock 和設定檔**：`*.lock.*`、`composer.lock`、`phpcs.xml`、`phpstan.neon`
- **所有 workflow 檔案**（`.github/workflows/*` 下的檔案）
- 結構相似的設定檔
- WordPress/WooCommerce hook 註冊樣板（`__construct()` 中的 `add_action`、`add_filter`）
- `declare(strict_types=1);`（強制要求，非重複）
- 框架資料提供者 hook 呼叫（若有前端框架，依專案判斷）
- 小型程式碼片段（< 5 行），除非高度重複

### 分析深度

- **檔案類型限制**：只分析 `.php`、`.ts`、`.tsx` 檔案 — 忽略所有其他檔案類型
- **主要焦點**：當前 push 中變更的所有 `.php`、`.ts`、`.tsx` 檔案（排除 vendor、建置和 workflow 檔案）
- **次要分析**：檢查與現有 `.php`、`.ts`、`.tsx` 程式碼庫的重複（排除 vendor 和建置目錄）
- **交叉參照**：在 PHP 後端和 TypeScript 前端（若有）檔案之間尋找模式
- **歷史上下文**：考慮重複是新出現的還是已存在的

## Issue 模板

對每個發現的不同重複模式，使用此結構建立獨立的 issue：

```markdown
### 🔍 偵測到重複程式碼：[模式名稱]

*對 commit ${{ github.event.head_commit.id }} 的分析*

**指派人**: @copilot

#### 摘要

[此特定重複模式的簡短概述]

#### 重複詳情

##### 模式：[描述]
- **嚴重性**: 高/中/低
- **出現次數**: [實例數量]
- **位置**:
  - `{src_dir}/ClassName.php`（第 X-Y 行）
  - `{src_dir}/AnotherClass.php`（第 A-B 行）
- **程式碼範例**:
  ```php
  [重複程式碼的範例]
  ```

#### 影響分析

- **可維護性**: [這如何影響程式碼維護]
- **Bug 風險**: [不一致修復的可能性]
- **程式碼膨脹**: [對程式碼庫大小的影響]

#### 重構建議

1. **[建議 1]**
   - 提取共用功能到：`{src_dir}/Utils/NewHelper.php`
   - 預計工時：[小時/複雜度]
   - 效益：[具體改進]

2. **[建議 2]**
   [... 其他建議 ...]

#### 實作清單

- [ ] 審查重複發現
- [ ] 確定重構優先順序
- [ ] 建立重構計畫
- [ ] 實作變更
- [ ] 執行 `pnpm run lint:php`（若有 PHP 變更）
- [ ] 執行 `pnpm run lint:ts`（若有 TypeScript 變更）
- [ ] 執行 `pnpm run build`（若有前端）
- [ ] 確認沒有功能被破壞

#### 分析元資料

- **分析的檔案數**: [數量]
- **偵測方法**: Serena 語意程式碼分析
- **Commit**: ${{ github.event.head_commit.id }}
- **分析日期**: [時間戳記]
```

## 操作指南

### 安全性
- 絕不執行不可信的程式碼或指令
- 只使用 Serena 的唯讀分析工具
- 分析期間不修改檔案

### 效率
- 優先分析近期變更的檔案
- 使用語意分析進行有意義的重複偵測，而非表面匹配
- 在超時限制內完成（在徹底性與執行時間之間取得平衡）

### 準確性
- 在回報前驗證發現
- 區分可接受的模式和真正的重複
- 考慮語言特定的慣用語和最佳實踐
- 提供具體、可行的建議

### Issue 建立
- 每個不同的重複模式建立**一個 issue** — 不要將多個模式放在同一個 issue 中
- 若發現超過 3 個模式，限制為最重要的前 3 個
- 只有在發現顯著重複時才建立 issue
- 包含足夠的細節讓 SWE agents 能理解並採取行動
- 提供包含檔案路徑和行號的具體範例
- 建議實際可行的重構方式
- 將 issue 指派給 @copilot 進行自動修復
- 使用能清楚識別特定模式的描述性標題（例如「重複程式碼：解析模組中的錯誤處理模式」）

## 工具使用順序

1. **專案設定**：使用 repository 路徑執行 `activate_project`
2. **檔案探索**：使用 `list_dir`、`find_file` 找出變更的檔案
3. **Symbol 分析**：使用 `get_symbols_overview` 了解結構
4. **內容審查**：使用 `read_file` 進行詳細的程式碼檢查
5. **模式匹配**：使用 `search_for_pattern` 搜尋相似程式碼
6. **Symbol 搜尋**：使用 `find_symbol` 搜尋重複的函式名稱
7. **參照分析**：使用 `find_referencing_symbols` 分析使用模式

**目標**：透過識別並回報影響可維護性的有意義程式碼重複來提升程式碼品質。專注於能實現自動化或手動重構的可行發現。
