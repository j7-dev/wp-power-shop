---
name: entity-derivation
description: Extract and consolidate entities, fields, types, constraints, and relationships from completed feature files and API spec into a formal DBML data model.
args:
  FEATURE_SPECS_DIR: ${SPECS_ROOT_DIR}/features
  API_SPECS_DIR: ${SPECS_ROOT_DIR}
  ENTITY_SPECS_DIR: ${SPECS_ROOT_DIR}
input: ${ES_SPEC_PATH} (Aggregates) + ${FEATURE_SPECS_DIR}/*.feature + ${API_SPECS_DIR}/api.yml
output: ${ENTITY_SPECS_DIR}/erm.dbml
---

# 實體推導

---

## 資料來源與優先順序

實體推導有三個資料來源，依優先順序處理：

1. **ES Aggregates**（`${ES_SPEC_PATH}`）→ 每個 Aggregate 直接對應一個 Table。Aggregate 的屬性表直接成為 Table 的欄位初始集合。此為實體清單的權威來源，確保 ES 階段定義的資料結構完整保留。
2. **Feature Files**（`${FEATURE_SPECS_DIR}/*.feature`）→ 從 datatable、step 中補充細節：具體型別、約束（如 `price > 0`）、列舉值（如 `CREATED / PAID`）。
3. **API Spec**（`${API_SPECS_DIR}/api.yml`）→ 補充 schema 層面的型別對應。

**ES Aggregates 確保不遺漏任何實體或屬性，Feature Files 確保每個屬性都有行為上的依據。兩者交叉驗證一致性。**

---

## 執行流程

### 草稿模式（ES Aggregates 存在時）

**當 `${ES_SPEC_PATH}` 中有 Aggregates 定義時，AI 先從 Aggregates 直接映射為 Tables 初版草稿。**

1. **每個 ES Aggregate → 一個 Table。** Aggregate 名稱為 Table 名稱，Aggregate 屬性表為初始欄位集合。
2. **標記不確定部分。** Aggregate 屬性僅提供名稱與說明，型別、約束、關聯等細節在此階段可能不明確，標記為待確認。
3. **產出 `erm.dbml` 草稿**，由協調器統一展示。
4. **延後澄清。** 不確定的型別、約束、關聯等，延後至 Feature Files 與 API Spec 完成後再補充。屆時以下方「澄清模式」處理。

### 澄清模式（Feature Files + API Spec 完成後）

1. **掃描所有 Feature File。** 蒐集出現在 Given datatable、When 參數、Then 驗證表格中的所有實體與屬性。
2. **與現有草稿合併。** 將 Feature File 中發現的屬性與 ES Aggregates 映射的初版交叉比對，補充型別、約束、列舉定義。
3. **識別列舉型別。** 將 Feature File 中出現的有限值集合（狀態、類型、方法等）提取為 `Enum` 定義，並將對應欄位型別設為該 Enum。
4. **僅澄清仍不明確的部分：**
   - 從上下文無法判斷的屬性型別
   - Feature Rule 中尚未表達的約束（如 `price > 0`）
   - 實體間的關聯（一對一、一對多、多對多）
5. **每次澄清後更新 `erm.dbml`**，展示更新內容，與用戶確認。

### 澄清規則

- 依照協調器定義的澄清循環進行。
- **不詢問 Feature File 中已明確的屬性。** 若 datatable 中出現 `| price | 50 |`，屬性名稱與型別（int）已顯而易見。
- 澄清重點聚焦於：模糊的型別、缺少的約束、實體間的關聯。

---

## DBML 格式

### Enum 定義

當屬性的值域為有限集合（如狀態、類型、方法），**必須定義為 `Enum`**，不可用 `varchar` + `note` 列舉替代。

```dbml
Enum <enum_name> {
  VALUE_A [note: '<中文說明>']
  VALUE_B [note: '<中文說明>']
}
```

- Enum 名稱使用 snake_case，與其所描述的概念對應（如 `order_status`、`coupon_type`）。
- 每個 Enum 值附帶 `[note: '...']` 提供中文對照。

### Table 定義

```dbml
// <實體說明>
Table <table_name> {
  <field_name> <type> [<attributes>]

  indexes {
    <field_name>
    (<field1>, <field2>) [unique]
  }

  Note: '''
  <實體用途>

  <僅保留 DBML 語法無法表達的約束>：
  - <跨屬性不變條件>
  - <狀態流轉規則>
  - <嵌套結構（如 JSON）的 schema 說明>
  '''
}
```

### 欄位屬性（Column Attributes）

以 `[attr1, attr2, ...]` 語法組合：

| 屬性 | 語法 | 說明 |
|---|---|---|
| 主鍵 | `primary key` | |
| 自動遞增 | `increment` | |
| 非空 | `not null` | |
| 可空 | `null` | |
| 唯一 | `unique` | |
| 預設值 | `default: <value>` | 字面值或 `` `now()` `` |
| 外鍵 | `ref: > <table.field>` | `>` 多對一, `<` 一對多, `-` 一對一 |
| 備註 | `note: '<說明>'` | 僅用於補充語義，不可替代 Enum |

### 欄位型別

| 型別 | 用途 |
|---|---|
| `integer` | 整數 |
| `varchar` / `varchar(N)` | 字串（可指定長度） |
| `decimal(M,N)` | 精確小數（金額等） |
| `timestamp` | 時間戳 |
| `json` | 結構化嵌套資料 |
| `boolean` | 布林值 |
| `<enum_name>` | 引用已定義的 Enum 型別 |

### Enum vs Note 判定原則

| 情境 | 做法 |
|---|---|
| 屬性值為有限集合（狀態、類型、方法） | 定義 `Enum`，欄位型別設為該 Enum |
| 跨屬性約束（如 `price > 0`） | 寫入 Table `Note` |
| 狀態流轉規則（如 CREATED → PAID） | 寫入 Table `Note` |
| JSON 欄位的內部結構說明 | 寫入 Table `Note` |
| 單純的中文欄位名稱對照 | 使用欄位 `note` 屬性 |

**原則：能用 DBML 結構（Enum、ref、index、attribute）表達的，就不放在 Note 裡。**

---

## 推導規則

- **實體清單以 ES Aggregates 為權威來源。** 若 `${ES_SPEC_PATH}` 中定義了 Aggregates，每個 Aggregate 直接對應一個 Table，不遺漏、不合併、不拆分。
- **每個屬性必須可追溯至 ES Aggregate 屬性表或 Feature File。** 優先採用 ES Aggregate 的屬性定義，再以 Feature File 的 datatable 補充細節。
- **實體名稱**來自 ES Aggregate 名稱（若存在），否則來自 Feature File 中使用的術語。
- **列舉型別**由 Feature File 中出現的有限值集合推導（如 datatable 中出現 `| status | CREATED |`、`| status | PAID |`，則推導出 `Enum order_status { CREATED; PAID; ... }`）。
- **約束**來自前置條件規則（如「前置（參數）- 數量必須大於 0」對應 `quantity > 0` 約束）。
- **關聯**由實體在情境中的共現方式推導（如 CartItem 同時引用 Cart 與 Product）。

---

## 核心約束

**僅將 Feature File 中包含的內容形式化，不添加推測性的屬性或實體。**

---

## 完成條件

當所有實體皆已定義完成並經用戶確認，輸出完整的 `${ENTITY_SPECS_DIR}/erm.dbml`。
