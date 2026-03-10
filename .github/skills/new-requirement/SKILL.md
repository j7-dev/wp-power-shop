---
name: new-requirement
description: Coordinate requirement changes (add/modify/delete) across all spec artifacts by analyzing impact and delegating to existing prompts.
args:
  SPECS_ROOT_DIR: spec
  ES_SPEC_PATH: ${SPECS_ROOT_DIR}/es.md
  FEATURE_SPECS_DIR: ${SPECS_ROOT_DIR}/features
  API_SPECS_DIR: ${SPECS_ROOT_DIR}
  ENTITY_SPECS_DIR: ${SPECS_ROOT_DIR}
  MAX_QUESTIONS_PER_ROUND: 10
input: User change request (natural language) + existing specs
output: Updated ${ES_SPEC_PATH}, ${FEATURE_SPECS_DIR}/*.feature, ${API_SPECS_DIR}/api.yml, ${ENTITY_SPECS_DIR}/erm.dbml
---

# 需求變更協調器

---

## 角色

接收用戶的需求變更描述，分析影響範圍，協調跨產出物的連鎖更新。**本 prompt 不重寫任何 spec 生成邏輯**，所有實際的 spec 生成委託給現有的 sub-prompt：

| 層級 | 委託對象 | 產出 |
|------|---------|------|
| ES 層 | 直接修改 `${ES_SPEC_PATH}` | 更新的 ES spec |
| 行為層 | `./01A-behavior-discovery.md` | `${FEATURE_SPECS_DIR}/*.feature` |
| API 層 | `./01B-api-derivation.md` | `${API_SPECS_DIR}/api.yml` |
| 實體層 | `./01C-entity-derivation.md` | `${ENTITY_SPECS_DIR}/erm.dbml` |

---

## 澄清循環

每次澄清遵循以下循環：

1. 問 **一題**選擇題，但允許其他說明 (Others)。
   - 優先使用多選題格式。
   - 問題必須具體、可回答，避免開放式問題。
   - 一個問題只澄清一件事。
2. 用戶回答，可以補充文字說明 (Others)。
3. 更新對應的規格檔案（僅更新與該回答相關的部分）。
4. 展示更新內容。
5. 詢問：「這樣的更新是否符合預期？(y/n)」
6. `y` → 進入下一題。`n` → 詢問如何調整，修正後重新確認。

### 提問上限

每回合最多 **${MAX_QUESTIONS_PER_ROUND} 題**（跨所有層級合計）。達到上限時暫停，展示當前進度摘要，用戶可選擇繼續下一回合。

### Question 與 Sub-question 的區分

**Question（計入上限）**：切換至新的受影響項目時遞增。

**Sub-question（不計入上限）**：仍在解決同一項目的所有互動，包含確認提示、追問釐清、用戶回答 `n` 後的修正循環。

### 提問格式

**多選題：**
```
Q: <問題描述>
- A) <選項>
- B) <選項>
- C) <選項>
- D) 其他（請說明）
```

**簡答：**
```
Q: <問題描述>（請提供簡短答案，10 字內）
```

---

## 執行流程

### 1. 讀取現有 Specs

讀取所有現有規格檔案：

- `${ES_SPEC_PATH}`
- `${FEATURE_SPECS_DIR}/*.feature`
- `${API_SPECS_DIR}/api.yml`
- `${ENTITY_SPECS_DIR}/erm.dbml`

建立對現有系統的完整理解。

### 2. 分類變更類型

根據用戶的變更描述，判定屬於以下哪種類型：

| 類型 | 說明 | 範例 |
|------|------|------|
| **新增** | 新的 Command / Read Model / Aggregate | 「我想增加一個退款功能」 |
| **修改** | 既有項目的 Rules / 參數 / 描述 / Aggregate 屬性變動 | 「訂單建立後應該要寄送通知信」 |
| **刪除** | 移除既有項目 | 「取消付款資訊功能，改為直接在訂單中處理」 |

若變更描述同時涉及多種類型，分別列出。

### 3. 影響分析（Propose First）

**AI 先主動列出所有受影響的項目與預計變更，用戶確認後才執行。**

展示格式：

```
【變更影響分析】

變更類型：<新增 | 修改 | 刪除>
變更描述：<用戶原始描述的摘要>

受影響的項目：

  ES 層（${ES_SPEC_PATH}）：
  - <CommandName>: <預計變更說明>
  - <AggregateName>: <預計變更說明>

  行為層（Feature Files）：
  - <FeatureName>.feature: <預計變更說明>

  API 層（api.yml）：
  - <endpoint>: <預計變更說明>

  實體層（erm.dbml）：
  - <TableName>: <預計變更說明>

不受影響的項目：（略）

以上影響分析是否正確？如有遺漏或不正確的地方請指出。(y/n)
```

### 4. 委託執行

用戶確認影響範圍後，依序更新各層級的 spec。更新順序：

```
ES 層 → 行為層 → API 層 → 實體層
```

#### 新增需求

1. **ES 層**：在 `${ES_SPEC_PATH}` 中新增 Command / Read Model / Aggregate。遵循 `./00-es-kick-off-discovery.md` 的格式與提案原則。
2. **行為層**：委託 `./01A-behavior-discovery.md`，對新增項目生成 Feature File。若 ES 項目為 clear，使用草稿模式；含 `(待澄清)` 則進入澄清模式。
3. **API 層**：委託 `./01B-api-derivation.md`，將新增的 Feature File 映射為 API endpoint，合併至現有 `api.yml`。
4. **實體層**：委託 `./01C-entity-derivation.md`，更新 `erm.dbml`。新增的 Aggregate 映射為新 Table，或補充既有 Table 的屬性。

#### 修改需求

1. **ES 層**：修改 `${ES_SPEC_PATH}` 中受影響項目的 Rules / 參數 / Description / Aggregate 屬性。
2. **行為層**：委託 `./01A-behavior-discovery.md`，重新生成受影響的 Feature File。未受影響的 Feature File 不變。
3. **API 層**：委託 `./01B-api-derivation.md`，重新生成受影響的 API endpoint。未受影響的 endpoint 不變。
4. **實體層**：委託 `./01C-entity-derivation.md`，更新受影響的 Table / Enum 定義。

#### 刪除需求

1. **ES 層**：從 `${ES_SPEC_PATH}` 中移除被刪除的 Command / Read Model。若 Aggregate 不再被任何 Command / Read Model 引用，一併移除。
2. **行為層**：刪除對應的 Feature File。
3. **API 層**：從 `api.yml` 中移除對應的 endpoint。
4. **實體層**：從 `erm.dbml` 中移除不再被引用的 Table / Enum，或移除不再需要的欄位。

**刪除操作需特別注意級聯影響：** 刪除一個 Command 可能連帶影響其他 Command 的 Predecessors、共用的 Aggregate 屬性等。AI 必須在影響分析階段完整列出所有級聯影響。

### 5. 一致性驗證

所有更新完成後，驗證各 spec 之間的一致性：

- `${ES_SPEC_PATH}` 中的每個 Command / Read Model 都有對應的 Feature File
- 每個 Feature File 都有對應的 API endpoint
- `erm.dbml` 中的每個 Table 都可追溯至 ES Aggregate
- Feature File 中的 datatable 欄位與 `erm.dbml` 的 Table 屬性一致
- API endpoint 的 schema 與 Feature File 的參數一致

若發現不一致，列出並提請用戶確認修正方向。

---

## 最小變更原則

**只更新受影響的項目，不觸碰未受影響的 spec。** 不因為變更了某個 Command 而重寫整個 `api.yml` 或所有 Feature Files。保持變更的精確性與可追溯性。

---

## 核心約束

- **不重寫現有 sub-prompt 的邏輯。** Feature File 格式、API 映射規則、DBML 格式等皆由各自的 prompt 定義，本 prompt 僅負責調度。
- **影響分析必須在執行前獲得用戶確認。** 不可跳過確認直接修改 spec。
- **嚴格遵守用戶的變更描述，不擅自擴大變更範圍。**

---

## 完成條件

當所有受影響的 spec 皆已更新且通過一致性驗證：

```
需求變更已完成：

【變更摘要】
- <變更類型>：<變更描述>

【已更新的檔案】
- ${ES_SPEC_PATH}
- ${FEATURE_SPECS_DIR}/<affected>.feature
- ${API_SPECS_DIR}/api.yml
- ${ENTITY_SPECS_DIR}/erm.dbml

所有 spec 一致性驗證通過。
```
