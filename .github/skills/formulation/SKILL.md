---
name: formulation
description: Orchestrate the formulation stage — manage knowledge map, route between concerns, and coordinate incremental updates to produce feature files, API spec, and entity model.
args:
  SPECS_ROOT_DIR: spec
  ES_SPEC_PATH: ${SPECS_ROOT_DIR}/es.md
  FEATURE_SPECS_DIR: ${SPECS_ROOT_DIR}/features
  API_SPECS_DIR: ${SPECS_ROOT_DIR}
  ENTITY_SPECS_DIR: ${SPECS_ROOT_DIR}
  MAX_QUESTIONS_PER_ROUND: 10
input: User idea (raw text) | ${ES_SPEC_PATH} (Event Storming spec)
output: ${FEATURE_SPECS_DIR}/*.feature, ${API_SPECS_DIR}/api.yml, ${ENTITY_SPECS_DIR}/erm.dbml
---

# 探索與規格化：流程協調器

## 角色

管理系統分析的全局狀態。維護知識地圖，判斷各項目的完成狀態，將焦點導向需要處理的關注點，協調增量更新與關注點切換。

系統分析包含三個關注點，各自的執行指引存放於獨立的 prompt 檔案中：

| 關注點 | Prompt 路徑 | 產出 |
|--------|------------|------|
| 行為探索 | `./01A-behavior-discovery.md` | `${FEATURE_SPECS_DIR}/*.feature` |
| API 推導 | `./01B-api-derivation.md` | `${API_SPECS_DIR}/api.yml` |
| 實體推導 | `./01C-entity-derivation.md` | `${ENTITY_SPECS_DIR}/erm.dbml` |

預設聚焦順序為：行為探索 → API 推導 → 實體推導。先定義行為與對應的 API 介面，再從中推導資料模型。但當任何關注點出現缺漏時，可隨時切換焦點至該關注點補充，完成後再返回原處繼續。

**當聚焦至某個關注點時，讀取對應的 prompt 檔案並依其指引執行。**

---

## 澄清循環（所有關注點共用）

每次澄清遵循以下循環：

1. 問 **一題**選擇題，但允許其他說明 (Others)。
   - 優先使用多選題格式。
   - 屬性/型別澄清時使用表格格式。
   - 問題必須具體、可回答，避免開放式問題。
   - 一個問題只澄清一件事。
2. 用戶回答，可以補充文字說明 (Others)。
3. 更新對應的規格檔案（僅更新與該回答相關的部分）。
4. 展示更新內容。
5. 詢問：「這樣的更新是否符合預期？(y/n)」
6. `y` → 進入下一題。`n` → 詢問如何調整，修正後重新確認。

### 提問上限

每回合最多 **${MAX_QUESTIONS_PER_ROUND} 題**（跨所有關注點合計）。達到上限時暫停，展示當前進度摘要，用戶可選擇繼續下一回合。

#### Question 與 Sub-question 的區分

**Question（計入上限）**：為了推進新的知識地圖項目而提出的主要提問。每題針對一個新的 `missing` 或 `partial` 項目。計數器僅在**切換至新的知識地圖項目**時遞增。

**Sub-question（不計入上限）**：仍在解決同一個知識地圖項目的所有互動，包含：
- 確認提示：「這樣的更新是否符合預期？(y/n)」
- 用戶回答模糊時的追問釐清
- AI 針對同一項目主動追問的延伸細節
- 用戶回答 `n` 後的修正循環

**判定原則：若問題仍在解決同一個知識地圖項目，則為 Sub-question。切換至新項目時才計為下一題 Question。**

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

## 推理架構

```
Idea
  │
  ├─> Command / Query（行為層）           ── 行為探索
  │     └─> Feature File
  │           ├─> Rules（按順序）
  │           │     ├─> 前置（狀態）       ── 系統狀態約束
  │           │     ├─> 前置（參數）       ── 輸入參數約束
  │           │     ├─> 後置（回應）       ── Query 回傳資料
  │           │     └─> 後置（狀態）       ── Command 狀態變化
  │           │
  │           └─> API Endpoint            ── API 推導（每個 Feature 對應一個 Endpoint）
  │                 ├─> Command → POST    ── 從 When 子句推導 schema
  │                 └─> Query → GET       ── 從 Then datatable 推導 schema
  │
  └─> Entity（資料層）                    ── 實體推導
        ├─> Field / Type                  ── 從 Feature datatable 萃取
        │     └─> Constraint              ── 從前置條件 Rule 萃取
        └─> Relationship                  ── 從 Entity 共現方式推導
```

**關鍵：資料層從行為層推導而來，而非獨立定義。** Entity 的每個屬性必須可追溯至某個 Feature File 的 datatable 或 step。API 的每個 endpoint 必須可追溯至某個 Feature。

---

## 初始化

1. 詢問用戶規格檔案的存放路徑（預設 `${SPECS_ROOT_DIR}`）。
2. 讀取該路徑下的現有檔案：
   - `${FEATURE_SPECS_DIR}/*.feature`
   - `${ENTITY_SPECS_DIR}/erm.dbml`
   - `${API_SPECS_DIR}/api.yml`
3. 根據現有檔案內容，建立初始知識地圖（見下方格式），將已存在且完整的項目標記為 `clear`，內容不完整的標記為 `partial`，不存在的標記為 `missing`。
4. 判斷輸入來源：
   - **若 `${ES_SPEC_PATH}` 存在**：讀取其中的 Commands 與 Read Models，每個 Command 對應一個 Feature（Command 類型），每個 Read Model 對應一個 Feature（Query 類型）。此為權威來源，不重新識別、不合併、不拆分。
   - **若 `${ES_SPEC_PATH}` 不存在**：接收用戶的 idea，解析識別新的 Command、Query、Entity。
5. 將識別結果與現有知識地圖合併，新項目標記為 `missing`。
6. **判斷是否進入初版草稿生成**（見下方）。
7. 向用戶展示分析概覽：
   - 列出所有待處理項目（`partial` 和 `missing`）
   - 說明將從哪個關注點開始（第一個包含 `partial` 或 `missing` 項目的關注點）
   - 確認後開始執行

---

## 初版草稿生成（Propose First, Ask Later）

**當 `${ES_SPEC_PATH}` 存在時，AI 應先根據 ES 內容一次性產出所有產出物的初版草稿，再針對不確定處進行澄清。**

### 觸發條件

`${ES_SPEC_PATH}` 存在且其中有 clear 的 Commands / Read Models（即有無 `(待澄清)` 標記的項目）。

### 草稿生成流程

依序呼叫三個 sub-prompt 產出草稿：

1. **行為探索（01A）**：對所有 clear 的 Commands / Read Models，直接生成完整的 Feature File 草稿（含具體 datatable 測試資料）。含 `(待澄清)` 的項目暫時跳過。
2. **API 推導（01B）**：從步驟 1 產出的 Feature Files，批量生成完整的 `api.yml` 草稿。
3. **實體推導（01C）**：從 ES Aggregates 直接映射為 Tables 初版。Aggregate 屬性中的不確定部分（型別、約束等）標記為待確認，延後至 Feature Files 與 API Spec 完成後再補充。

### 草稿展示

一次展示所有產出物草稿，讓用戶總覽全貌：

```
根據 ${ES_SPEC_PATH} 產出以下初版草稿：

【Feature Files】（N 個 clear 項目已生成，M 個含待澄清項目暫緩）
- 建立訂單.feature ✓
- 建立付款資訊.feature ✓
- 處理付款結果.feature ✗（ES 中含待澄清）

【API Spec】
- api.yml — N 個 endpoint

【Entity Model】
- erm.dbml — K 個 Table（從 ES Aggregates 映射）

以上草稿有以下不確定處需要確認：
1. ...
2. ...

請審閱草稿，指出需要修改的地方。審閱完成後，我們將處理待澄清的項目。
```

### 草稿審閱後

- 用戶指出的修正 → 視為 Sub-question（不計入提問額度），修正後重新確認。
- 草稿確認後，對含 `(待澄清)` 的 ES 項目及草稿中仍不確定的部分，進入現有的澄清循環。

---

## 知識地圖

**知識地圖僅供內部推理使用，不輸出給用戶。**

追蹤每個項目的狀態，用於決定下一步動作。

```markdown
## Knowledge Map

### 行為

#### Feature: <功能名>
- 狀態: clear | partial | missing
- 前置（狀態）: clear | partial | missing
- 前置（參數）: clear | partial | missing
- 後置（回應）: clear | partial | missing
- 後置（狀態）: clear | partial | missing
- API Endpoint Spec: clear | partial | missing

### 實體

#### Entity: <實體名>
- 狀態: clear | partial | missing
- 屬性: clear | partial | missing
- 約束: clear | partial | missing
- 關聯: clear | partial | missing
```

### 更新規則

- 每次澄清後更新對應項目狀態。
- `missing` → `partial` → `clear`
- 當某項目的所有子項皆為 `clear`，該項目整體標記為 `clear`。

---

## 路由邏輯

### 聚焦選擇

掃描知識地圖，依預設順序找到第一個包含 `partial` 或 `missing` 項目的關注點：

1. 行為中有任何 Feature 的 Rules 為 `partial` 或 `missing` → 聚焦行為探索
2. 行為中有任何 Feature 的 API Endpoint 為 `partial` 或 `missing` → 聚焦 API 推導
3. 實體中有任何 Entity 為 `partial` 或 `missing` → 聚焦實體推導
4. 全部 `clear` → 完成

### 局部執行

聚焦某關注點時，**僅處理其中狀態為 `partial` 或 `missing` 的項目**，跳過已 `clear` 的項目。

### 關注點切換

若處理某關注點時發現另一個關注點存在缺漏（如實體推導時發現某 Feature 缺少規則）：

1. 在知識地圖中將該項目標記回 `partial`。
2. 切換焦點至該關注點，僅處理被標記的項目。
3. 補充完成後，返回原關注點繼續。

---

## 增量更新

當用戶帶入新 idea 擴充已完成的系統：

1. 讀取現有規格檔案，將已有項目標記為 `clear`。
2. 解析新 idea，識別新增的 Command、Query、Entity。
3. 新項目加入知識地圖，標記為 `missing`。
4. 僅對新增與受影響的項目執行探索流程。
5. 更新結果合併回現有規格檔案。

---

## 分析概覽展示格式

進入流程前，向用戶展示：

```
從您的 idea 中識別出以下項目：

【行為 + API】
- <功能名1>（Command）— Rules: missing, API: missing
- <功能名2>（Query）— Rules: missing, API: missing

【實體】
- <實體名1> — missing
- <實體名2> — clear（已有規格）

將從「行為探索」開始，處理 <N> 個待澄清的功能。
確認後開始？(y/n)
```

---

## 完成條件

當知識地圖所有項目皆為 `clear`：

```
所有規格已完成：
- ${FEATURE_SPECS_DIR}/*.feature（X 個 Feature）
- ${ENTITY_SPECS_DIR}/erm.dbml（Y 個 Entity）
- ${API_SPECS_DIR}/api.yml（Z 個 Endpoint）

可隨時提出新的 idea 進行增量更新。
```
