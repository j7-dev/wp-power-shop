---
name: es-kick-off-discovery
description: Clarify raw user ideas through Event Storming concepts, producing a structured ES markdown as input for the formulation stage.
args:
  SPECS_ROOT_DIR: spec
  ES_SPEC_PATH: ${SPECS_ROOT_DIR}/es.md
  MAX_QUESTIONS_PER_ROUND: 10
  MAX_ES_ITEMS: 20
  DFS_BANDWIDTH: 1
input: User idea (raw text)
output: ${ES_SPEC_PATH}
---

# 事件風暴探索（簡化版，省略事件階段，著重在業務流程）

---

## Event Storming 元素

本流程使用以下 Event Storming 元素：

### Command（命令）

Actor 對系統執行的操作，改變系統狀態。對應規格化階段的 Feature（Command 類型）。每個 Command 包含一段 Description，從三個面向描述：

- **What**：這個 Command 做什麼？
- **Why**：為什麼系統需要這個 Command？
- **When**：Actor 在什麼情境下觸發這個 Command？

### Actor（角色）

實際觸發 Command 或查詢 Read Model 的人或系統。判定方式：想像這個 Command / Read Model 最終會實作為一支 API，**誰會是呼叫這支 API 的那一方？** 那個角色就是 Actor。

- Actor 可以是人（透過前端與系統互動），也可以是外部系統（例如第三方服務透過 webhook 回呼）。
- Actor 不一定是業務流程的發起者。例如：用戶發起付款，但付款結果通知的 Actor 是第三方金流系統，因為是金流系統呼叫 webhook。

### Read Model（查詢模型）

Actor 查詢系統當前狀態的介面，不改變狀態。對應規格化階段的 Feature（Query 類型）。Actor 根據查詢結果，決定下一步要執行什麼 Command。每個 Read Model 同樣包含 Description（What / Why / When）。

### Aggregate（聚合）

系統維護的內聚狀態體（通常持久化於資料庫）。Actor 執行 Command 以更新 Aggregate 狀態，透過 Read Model 查詢 Aggregate 狀態。

### Rules（規則）

Command 或 Read Model 的約束條件，分為四類：

- **前置（狀態）**：執行前系統必須滿足的狀態
- **前置（參數）**：輸入參數的約束
- **後置（回應）**：回傳內容的預期（主要用於 Read Model）
- **後置（狀態）**：執行後系統狀態的變化（主要用於 Command）

Rules 以自然語言描述，不需寫成 Gherkin 格式。Gherkin 的形式化由規格化階段負責。

### Predecessors（前置步驟）

Command 之間的嚴格執行順序約束。僅當某個 Command 必須在另一個 Command 之後才能執行時才標記。若執行順序為可選，則不列入。

---

## 執行流程

### 初始化

1. 詢問用戶規格檔案的存放路徑（預設 `${SPECS_ROOT_DIR}`）。
2. 讀取現有 `${ES_SPEC_PATH}`（若存在），將已有項目標記為 `clear`。
3. 接收用戶的 idea。

### 探索流程（DFS 原則策略）

**核心原則：以 DFS 方式深入澄清，每次同時處理最多 ${DFS_BANDWIDTH} 個 Command / Read Model，全部完成後再取下一批。不做跨批次的 BFS 掃描。**

1. **解析 idea**，識別潛在的 Actor、Command、Read Model。
2. **展示初始分析**（見展示格式），列出 Actors 與 Commands / Read Models 清單，與用戶確認。此步驟僅建立初始清單，不深入任何項目的細節。
3. **分批深入**：從清單中取出最多 ${DFS_BANDWIDTH} 個項目作為當前批次，對批次內的每個 Command / Read Model 進行完整澄清。批次內所有項目皆為 `clear` 後，才取下一批。每個項目的澄清順序：
   a. **描述性屬性提案**（見「描述性屬性提案原則」）— AI 根據上下文主動提案 Actor、Description（What / Why / When）、Predecessors，用戶確認或糾正。僅在 AI 真的不確定時才轉為提問。
   b. 參數（Command）/ 回傳欄位（Read Model）— 以提問方式澄清。
   c. Rules — 依四類規則逐一澄清（前置狀態 → 前置參數 → 後置回應/狀態）。以提問方式澄清。
   d. Aggregate — 根據以上已澄清的 Description、參數、Rules，推導此操作影響/查詢的 Aggregate 及其屬性（提議 → 用戶確認）。此為最後一步，因為需要先收集足夠資料才能準確推導。
4. 每次澄清後更新 `${ES_SPEC_PATH}`，展示更新內容，與用戶確認。

### Aggregate 推導原則

**Aggregate 是每個 Command / Read Model 澄清流程的最後一步。** 必須先完成 Description、Predecessors、參數、Rules 的澄清，收集足夠資料後，才推導 Aggregate：

- AI 根據已澄清的 Description、參數與 Rules，**主動提議** 此操作影響的 Aggregate 及其屬性，請用戶確認。
- 不問開放式問題如「這個 Aggregate 有哪些屬性？」。而是提議具體屬性：「根據建立訂單的參數與規則，訂單 Aggregate 應包含以下屬性：訂單編號、總價、狀態、建立時間。是否正確？」
- 隨著更多 Commands / Read Models 被澄清，同一 Aggregate 的屬性逐步累積補充。

### 描述性屬性提案原則

**描述性屬性（Actor、Description、Predecessors）由 AI 根據用戶的 idea 上下文主動提案，不佔用提問額度。** 提案後用戶確認或糾正即可，讓提問集中在參數與規則等核心屬性上。

對每個 Command / Read Model，AI 在深入澄清前先展示提案：

```
【<CommandName> — 描述性屬性提案】

- Actor: <根據 idea 推斷的 Actor>
- Description:
  - What: <這個 Command 做什麼>
  - Why: <為什麼需要這個 Command>
  - When: <Actor 在什麼情境下觸發>
- Predecessors: <推斷的前置步驟，無則標示「無」>

以上是否正確？如有需要修改的部分請指出，否則我們進入參數與規則的澄清。
```

**判定規則：**
- AI 對某描述性屬性有合理推斷依據 → 直接提案，用戶確認或糾正。
- AI 對某描述性屬性真的無法從上下文推斷 → 僅針對該屬性提問（計入提問額度）。
- 用戶糾正提案內容 → 視為 Sub-question（不計入提問額度），修正後重新確認。

### 澄清循環

每次澄清遵循以下循環：

1. 問 **一題**選擇題，但允許其他說明 (Others)。
   - 優先使用多選題格式。
   - 問題必須具體、可回答，避免開放式問題。
   - 一個問題只澄清一件事。
2. 用戶回答，可以補充文字說明 (Others)。
3. 更新 `${ES_SPEC_PATH}`（僅更新與該回答相關的部分）。
4. 展示更新內容。
5. 詢問：「這樣的更新是否符合預期？(y/n)」
6. `y` → 進入下一題。`n` → 詢問如何調整，修正後重新確認。

### 提問上限

每回合最多 **${MAX_QUESTIONS_PER_ROUND} 題**。達到上限時暫停，展示當前進度摘要，用戶可選擇繼續下一回合。

#### Question 與 Sub-question 的區分

**Question（計入上限）**：為了推進新的知識地圖項目而提出的主要提問。每題針對一個新的 `missing` 或 `partial` 項目。計數器僅在**切換至新的知識地圖項目**時遞增。

**Sub-question（不計入上限）**：仍在解決同一個知識地圖項目的所有互動，包含：
- 確認提示：「這樣的更新是否符合預期？(y/n)」
- 用戶回答模糊時的追問釐清
- AI 針對同一項目主動追問的延伸細節
- 用戶回答 `n` 後的修正循環

**判定原則：若問題仍在解決同一個知識地圖項目，則為 Sub-question。切換至新項目時才計為下一題 Question。**

### 項目數量上限

探索過程中，**Commands + Read Models 的總數不得超過 ${MAX_ES_ITEMS} 個**。此限制確保後續的規格化階段（Formulation）能有效處理所有項目。

- 每當新增 Command 或 Read Model 時，檢查當前總數。
- 若已達上限，告知用戶：「目前已有 ${MAX_ES_ITEMS} 個 Command / Read Model，已達本次探索上限。如需新增更多項目，請調整 MAX_ES_ITEMS 參數後重新執行。」
- 已達上限後，仍可繼續澄清既有項目的細節（Aggregate 屬性、Rules、Description 等），但不可新增 Command 或 Read Model。

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

## `${ES_SPEC_PATH}` 格式

```markdown
# Event Storming: <系統名稱>

## Actors

- **<ActorName>** [人|系統]: <說明>

## Aggregates

### <AggregateName>
> <說明>

| 屬性 | 說明 |
|------|------|
| <field> | <description> |

## Commands

### <CommandName>
- **Actor**: <ActorName>
- **Aggregate**: <AggregateName>
- **Predecessors**: <Command1>, <Command2>（僅限嚴格順序約束，無則標示「無」）
- **參數**: <param1>, <param2>, ...
- **Description**:
  - What: <這個 Command 做什麼>
  - Why: <為什麼需要這個 Command>
  - When: <Actor 在什麼情境下觸發>

#### Rules
- 前置（狀態）:
  - <原子規則 1>
  - <原子規則 2>
- 前置（參數）:
  - <原子規則 1>
- 後置（狀態）:
  - <原子規則 1>

## Read Models

### <ReadModelName>
- **Actor**: <ActorName>
- **Aggregates**: <Agg1>, <Agg2>
- **回傳欄位**: <field1>, <field2>, ...
- **Description**:
  - What: <這個 Read Model 查詢什麼>
  - Why: <為什麼需要這個查詢>
  - When: <Actor 在什麼情境下查詢>

#### Rules
- 前置（狀態）:
  - <原子規則 1>
- 前置（參數）:
  - <原子規則 1>
- 後置（回應）:
  - <原子規則 1>
```

### 缺漏標記

尚未澄清的欄位使用 `(待澄清)` 標記。已確認無內容的欄位標示 `無`。

```markdown
### 結帳
- **Actor**: 用戶
- **Aggregate**: 訂單
- **Predecessors**: 加入購物車
- **參數**: (待澄清)
- **Description**:
  - What: 用戶將購物車中的商品結算為訂單
  - Why: (待澄清)
  - When: (待澄清)

#### Rules
- 前置（狀態）:
  - 購物車不可為空
- 前置（參數）:
  - (待澄清)
- 後置（狀態）:
  - (待澄清)
```

當所有 `(待澄清)` 皆被填入具體內容或標示為 `無`，該項目視為完成。

---

## 知識地圖（內部推理用）

**知識地圖僅供內部推理使用，不輸出給用戶。**

```markdown
## Knowledge Map

### Actors
- <ActorName>: clear | missing

### Aggregates（從 Commands / Read Models 推導，不獨立澄清）
- <AggregateName>: clear | partial | missing
  - 屬性: clear | partial | missing

### Commands
- <CommandName>: clear | partial | missing
  - Actor: clear | missing
  - Aggregate: clear | missing
  - 參數: clear | partial | missing
  - Predecessors: clear | missing
  - Description: clear | partial | missing
  - 前置（狀態）: clear | partial | missing
  - 前置（參數）: clear | partial | missing
  - 後置（狀態）: clear | partial | missing

### Read Models
- <ReadModelName>: clear | partial | missing
  - Actor: clear | missing
  - Aggregates: clear | partial | missing
  - 回傳欄位: clear | partial | missing
  - Description: clear | partial | missing
  - 前置（狀態）: clear | partial | missing
  - 前置（參數）: clear | partial | missing
  - 後置（回應）: clear | partial | missing
```

### 更新規則

- 每次澄清後更新對應項目狀態。
- `missing` → `partial` → `clear`
- 當某項目的所有子項皆為 `clear`，該項目整體標記為 `clear`。

---

## 推理架構（DFS）

```
Raw Idea
  │
  ├─ 1. 識別 Actors（快速確認）
  │
  ├─ 2. 初始分析 — 列出 Commands / Read Models 清單（不深入）
  │
  └─ 3. 分批深入 — 每批最多 ${DFS_BANDWIDTH} 個項目，完成後再取下一批：
        │
        ├─ Command ──────────────────────────────────────────
        │   ├─> 描述性屬性提案（AI 主動提案，用戶確認/糾正）
        │   │     ├─ Actor
        │   │     ├─ Description（What / Why / When）
        │   │     └─ Predecessors
        │   ├─> 參數（提問澄清）
        │   ├─> Rules（提問澄清）
        │   │     ├─> 前置（狀態）
        │   │     ├─> 前置（參數）
        │   │     └─> 後置（狀態）
        │   └─> Aggregate（最後：從以上資料推導，提議 → 用戶確認）
        │   → 此 Command = clear ✓ → 進入下一個項目
        │
        └─ Read Model ──────────────────────────────────────
            ├─> 描述性屬性提案（AI 主動提案，用戶確認/糾正）
            │     ├─ Actor
            │     ├─ Description（What / Why / When）
            │     └─ Predecessors（若適用）
            ├─> 回傳欄位（提問澄清）
            ├─> Rules（提問澄清）
            │     ├─> 前置（狀態）
            │     ├─> 前置（參數）
            │     └─> 後置（回應）
            └─> Aggregate（最後：從以上資料推導，提議 → 用戶確認）
            → 此 Read Model = clear ✓ → 進入下一個項目
```

---

## 初始分析展示格式

```
從您的 idea 中識別出以下項目：

【Actors】
- <ActorName>（人|系統）

【Commands】（共 N 個）
- <CommandName> — Actor: <name>

【Read Models】（共 M 個）
- <ReadModelName> — Actor: <name>

將以每批 ${DFS_BANDWIDTH} 個的節奏，逐批深入澄清每個項目的完整細節。
確認後開始？(y/n)
```

---

## 增量更新

當用戶帶入新 idea 擴充已完成的系統：

1. 讀取現有 `${ES_SPEC_PATH}`，將已有項目標記為 `clear`。
2. 解析新 idea，識別新增的 Actor、Command、Read Model、Aggregate。
3. 新項目加入知識地圖，標記為 `missing`。
4. 僅對新增與受影響的項目執行探索流程。
5. 更新結果合併回 `${ES_SPEC_PATH}`。

---

## 核心約束

**嚴格遵守用戶提供的資訊，不添加、不假設、不推測任何未明確說明的內容。** 所有內容必須源自用戶的 idea 或澄清回答。

---

## 完成條件

當知識地圖所有項目皆為 `clear`（`${ES_SPEC_PATH}` 中無 `(待澄清)` 標記）：

```
事件風暴探索已完成：
- ${ES_SPEC_PATH}（X 個 Actor, Y 個 Command, Z 個 Read Model, W 個 Aggregate）

可進入規格化階段（Formulation），或提出新的 idea 進行增量更新。
```
