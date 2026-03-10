---
name: api-derivation
description: Mechanically map completed feature files to an OpenAPI 3.0 specification.
args:
  FEATURE_SPECS_DIR: ${SPECS_ROOT_DIR}/features
  API_SPECS_DIR: ${SPECS_ROOT_DIR}
input: ${FEATURE_SPECS_DIR}/*.feature
output: ${API_SPECS_DIR}/api.yml
---

# API 推導

---

## 執行流程

1. **批量處理所有 Feature File**，判定各自為 Command 或 Query。
2. **套用映射規則**（見下方），一次性生成所有 endpoint 定義，產出完整的 `api.yml` 草稿。
3. **將完整的 API 規格草稿呈現給用戶確認。** 不逐一確認每個 endpoint，而是整體展示後由用戶指出需修改的部分。
4. 用戶可調整 endpoint 路徑、HTTP method 或 schema 細節。修正視為 Sub-question（不計入提問額度）。
5. 確認後輸出 `${API_SPECS_DIR}/api.yml`。

---

## 映射規則

### Command → POST

- **路徑：** 從資源與操作推導（如 `POST /carts/items`）。
- **Summary：** 將 Feature 的 When 語句轉換為參數化模板。
  - 以型別佔位符取代具體值：`{string}`、`{int}`、`{float}`、`{bool}`
  - 範例：When `用戶 "Alice" 將商品 1 加入購物車，數量 2` → Summary: `用戶 {string} 將商品 {int} 加入購物車，數量 {int}`
- **requestBody schema：** 從 When 子句的參數推導。
- **Responses：**
  - `200`：從「後置（狀態）」Rule 的 Then 子句推導。
  - `400`：每個「前置（參數）」Rule 對應一個錯誤項。
  - `403`：每個「前置（狀態）」Rule 對應一個錯誤項。

### Query → GET

- **路徑：** 從資源推導（如 `GET /carts/{userId}`）。
- **Summary：** 與 Command 相同的轉換方式。
- **parameters：** 從 When 子句的參數推導。
- **Responses：**
  - `200`：從「後置（回應）」Rule 的 Then datatable 欄位推導 schema。
  - `403`：每個「前置（狀態）」Rule 對應一個錯誤項。
  - `404`：若查詢的特定資源可能不存在。

---

## 產出格式

標準 OpenAPI 3.0 YAML。每個 endpoint 包含：
- `summary`（參數化的 When 語句）
- `operationId`
- `requestBody` 或 `parameters`
- `responses` 及 schema 定義

---

## 核心約束

**API 規格中的每個元素必須可追溯至 Feature File 的 Rule。不添加任何現有產出物中不存在的 endpoint 或屬性。**

---

## 完成條件

當所有 endpoint 皆經確認，輸出完整的 `${API_SPECS_DIR}/api.yml`。
