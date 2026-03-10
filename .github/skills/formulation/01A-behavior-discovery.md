---
name: behavior-discovery
description: Identify features (Commands / Queries) from user ideas and clarify behavioral rules using Spec by Example with the 4-Rules-Pattern. Produces complete Gherkin feature files.
args:
  FEATURE_SPECS_DIR: ${SPECS_ROOT_DIR}/features
input: User idea (raw text) | ${ES_SPEC_PATH} (Event Storming spec)
output: ${FEATURE_SPECS_DIR}/*.feature
---

# 行為探索

---

## 執行流程

### 功能識別

1. 判斷輸入來源：
   - **若來自 `${ES_SPEC_PATH}`**：直接採用 ES 中的 Commands 與 Read Models。每個 Command 對應一個 Feature file（Command 類型），每個 Read Model 對應一個 Feature file（Query 類型）。不重新識別，不合併，不拆分。ES 中該項目已記載的 Actor、Aggregate、Rules、Description 作為澄清的起點，已有內容視為初始值，僅對 `(待澄清)` 欄位進行澄清。
   - **若來自 User idea**：解析 idea，識別 Command（足以改變系統狀態的操作，有可能被萃取成 API endpoint）與 Query（讀取狀態的查詢操作）。
2. 將識別結果列表呈現給用戶確認，說明會開出幾個 Feature。
3. 確認後，進入草稿模式或澄清模式。

### 草稿模式（ES 項目已 clear）

**當 ES 項目無 `(待澄清)` 標記時，AI 直接根據 ES 的 Rules、參數、Aggregate 生成完整的 Feature File 草稿，不逐條提問。**

- ES 中的每條原子規則 → 對應一條 Gherkin Rule + Example。
- AI 自行推斷具體的 datatable 測試資料（例如用戶名 `Alice`、商品ID `1`、價格 `50`）。
- 草稿產出後由協調器統一展示，用戶審閱確認或糾正。
- 含 `(待澄清)` 的 ES 項目跳過草稿模式，進入下方的澄清模式。

### 澄清模式（逐一功能處理）

針對含 `(待澄清)` 的功能或 raw idea 輸入，按以下固定順序澄清其規則：

1. **前置（狀態）** — 操作前系統必須滿足什麼狀態？
2. **前置（參數）** — 輸入參數有什麼約束？
3. **後置（回應）** — 操作回傳什麼內容？（主要用於 Query）
4. **後置（狀態）** — 操作成功後系統狀態如何變化？（主要用於 Command）

每條規則依照協調器定義的澄清循環進行：提問 → 更新 → 確認 → 下一題。

一個功能的所有規則皆為 clear 後，進入下一個功能。

---

## Feature File 格式

**關鍵字一律使用英文：Feature / Rule / Example / Given / When / Then / And / But。檔案開頭不標註語言。**

**本關注點產出的所有 Feature File 必須在最上方標註 `@ignore` 標籤。**

```gherkin
@ignore
Feature: <功能名>

  Background:
    Given <共用前置條件，使用具體 datatable>

  # ========== 前置條件 ==========

  Rule: 前置（狀態）- <主詞>必須<單一條件>

    Example: <情境描述>
      Given <前置條件>
      When <操作>
      Then 操作失敗

  Rule: 前置（參數）- <主詞>必須<單一條件>

    Example: <情境描述>
      Given <前置條件>
      When <帶有不合法參數的操作>
      Then 操作失敗

  # ========== 後置條件 ==========

  Rule: 後置（回應）- <主詞>應<單一條件>（用於 Query）

    Example: <情境描述>
      Given <前置條件>
      When <操作>
      Then 操作成功
      And 查詢結果應包含：
        | 欄位1 | 欄位2 |
        | 值1   | 值2   |

  Rule: 後置（狀態）- <主詞>應<單一條件>（用於 Command）

    Example: <情境描述>
      Given <前置條件>
      When <操作>
      Then 操作成功
      And <狀態驗證>
```

---

## Rule 命名與原子化

### 命名句型

每條 Rule 的名稱必須遵循：

```
Rule: <類型前綴> - <主詞> 必須/應 <單一條件>
```

- **類型前綴**：`前置（狀態）`、`前置（參數）`、`後置（回應）`、`後置（狀態）`
- **主詞**：一個明確的實體屬性或系統狀態（如「商品庫存」「加入數量」「訂單總額」）
- **動詞**：前置用「必須」（約束），後置用「應」（預期結果）
- **單一條件**：一個可驗證的具體斷言（如「大於 0」「等於單價乘以數量」「新增一筆商品項目」）

**正確：**
```
Rule: 前置（狀態）- 商品庫存必須大於 0
Rule: 前置（參數）- 加入數量必須大於 0
Rule: 後置（狀態）- 購物車應新增一筆商品項目
```

**錯誤（違反原子化）：**
```
Rule: 前置（狀態）- 商品庫存必須大於 0 且商品狀態必須為上架中
```
→ 兩個主詞、兩個條件，應拆為兩條 Rule。

### 原子化判定

句型本身即為原子化的檢驗標準：
- 陳述句中出現「且」「和」「並且」→ 包含多個條件，拆分為多條 Rule。
- 陳述句中出現「或」→ 多選一條件難以分離，保留在同一條 Rule。
- 混合前置與後置 → 拆分。

### 必要參數規則（必備 + 允許合併）

每個 Feature **至少**必須有一條「前置（參數）」Rule 驗證必要參數，否則就要特別詢問用戶來澄清。此為不可跳過的最低要求。

所有「缺少必要參數」的檢查「可以考慮」合併為單一 Rule，使用 Scenario Outline 涵蓋各缺少情境：

```gherkin
Rule: 前置（參數）- 必要參數必須提供

  Scenario Outline: 缺少 <缺少參數> 時操作失敗
    Given 系統中有以下用戶：
      | userId | name  |
      | 1      | Alice |
    And 系統中有以下商品：
      | productId | name | price | stock |
      | 1         | 蘋果 | 50    | 10    |
    When 用戶 "Alice" 將商品 <商品ID> 加入購物車，數量 <數量>
    Then 操作失敗

    Examples:
      | 缺少參數 | 商品ID | 數量 |
      | 商品 ID  |        | 1    |
      | 數量     | 1      |      |
```

此為原子化的常見例外：多個缺少參數的情境共享同一驗證模式（必要參數缺少 → 失敗），合併可減少冗餘。

其他具有**領域特定約束**的參數規則（如「數量必須大於 0」「數量不可超過庫存」）仍各自獨立為原子 Rule。

---

## 資料驅動原則

每個 Step 必須指定具體、可驗證的資料，禁止模糊描述。

**錯誤示範：**
```gherkin
Given 系統中有一個用戶
When 用戶更新課程進度
Then 進度已更新
```

**正確示範：**
```gherkin
Given 系統中有以下用戶：
  | name  | email          | level | exp |
  | Alice | alice@test.com | 1     | 0   |
When 用戶 "Alice" 更新課程 1 的影片進度為 80%
Then 操作成功
And 課程 1 的進度應為：
  | lessonId | progress | status |
  | 1        | 80       | 進行中 |
```

**規則：**
- Given：使用 datatable 提供所有相關屬性的具體值。
- When：明確指定用戶名稱/ID、資源 ID、參數值。
- Then：使用 datatable 驗證具體的預期值，禁止模糊描述如「已改變」。
- **禁止在 datatable 中使用 JSON 字串。** 複雜資料應拆分為多個 Given/And 步驟，各自使用獨立的 datatable。

---

## Given 設定方式（Practice Choices）

Given 有兩種方式建立前置狀態，Command 與 Query 類型的 Feature 皆適用。

### 選擇 A：直接設定 Aggregate State

```gherkin
Given 訂單 "ORDER-123" 的狀態為：
  | orderId   | status | totalAmount |
  | ORDER-123 | 已付款  | 1500        |
```

適用時機：Aggregate 的不變條件（Invariant）簡單、手動設值不易出錯。

### 選擇 B：透過 Commands 設定

```gherkin
Given 用戶 "Alice" 建立訂單 "ORDER-123"，購買課程 1
And 用戶 "Alice" 完成訂單 "ORDER-123" 的付款，金額 1500 元
```

適用時機：Aggregate 有複雜的 Invariant（如「總金額 = Σ品項金額 + 運費 - 折扣」），手動設值容易違反約束。透過 Commands 讓系統自動計算與守護 Invariant。

### 選擇判定

| 條件 | 建議 |
|------|------|
| Invariant 簡單（如 `0 ≤ progress ≤ 100`） | 選擇 A |
| Invariant 複雜（跨屬性計算、狀態流轉） | 選擇 B |
| 建立路徑需要 5 個以上 Commands | 選擇 A |
| 測試重點包含前置條件的正確性 | 選擇 B |

**推薦混合使用**：簡單的 Aggregate 用選擇 A，複雜的用選擇 B。

```gherkin
Given 商品的狀態為：                                        # 選擇 A（簡單）
  | productId | name    | price | stock |
  | PROD-001  | MacBook | 45000 | 10    |
And 用戶 "Alice" 建立訂單 "ORDER-123"，購買商品 PROD-001    # 選擇 B（複雜）
And 用戶 "Alice" 完成訂單 "ORDER-123" 的付款，金額 45000 元  # 選擇 B（複雜）
```

---

## Key 識別規則

每個步驟（Given / When / Then）中引用的 Aggregate 或 Actor，必須附帶可識別身份的 **Key** 屬性。

### Key 選擇原則

- **Actor（用戶、客戶等）**：優先使用 name（如 `"Alice"`），而非 ID（如 `"CUST-8f7a2b"`）。更易讀、更接近自然語言。
- **其他 Aggregate**：視情境選擇最具辨識度的屬性（如訂單用 `"ORDER-123"`、商品用 `"MacBook"`）。

### 引號規則

- **字串值用雙引號**：`"Alice"`、`"ORDER-123"`
- **數字值不用引號**：`1`、`80`

此規則配合 Cucumber expression 解析：引號內為字串參數，裸數字為數值參數。

### 複合 Key

當 Aggregate 的身份由多個屬性組成（如課程進度 = userId + lessonId），使用自然語言連接詞隱含複合 Key：

| 連接詞 | 範例 | 複合 Key |
|--------|------|----------|
| 在 | `用戶 "Alice" 在課程 1 的進度為 70%` | userId + lessonId |
| 對 | `用戶 "Alice" 對訂單 "ORDER-123" 的評價為 5 星` | userId + orderId |
| 於 | `商品 "MacBook" 於商店 "台北店" 的庫存為 10` | productId + storeId |

白話文怎麼講，就怎麼寫。**所有 Feature File 之間的句型應保持一致。**

---

## When 步驟格式

| 類型 | 格式 | 範例 |
|------|------|------|
| Command | `用戶 "<key>" <動詞＋參數>` | `When 用戶 "Alice" 更新課程 1 的影片進度為 80%` |
| Query | `用戶 "<key>" 查詢 <目標＋參數>` | `When 用戶 "Alice" 查詢課程 1 的進度` |

- **Command**：主動式動詞（「更新」「提交」「交付」「建立」「取消」）。
- **Query**：固定使用「查詢」（或「取得」）。

---

## 核心約束

**嚴格遵守用戶提供的資訊，不添加、不假設、不推測任何未明確說明的內容。**

---

## 完成條件

當所有功能的所有規則皆為 clear 狀態，輸出所有完成的 Feature File，告知用戶行為探索已完成。
