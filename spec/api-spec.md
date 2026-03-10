# API 規格文件

> **文件版本**：1.0
> **最後更新**：2025-03
> **Base URL**：`/wp-json/`

---

## 目錄

- [自有 API 端點](#自有-api-端點)
- [WooCommerce REST API（使用端點）](#woocommerce-rest-api使用端點)
- [WordPress REST API（使用端點）](#wordpress-rest-api使用端點)
- [認證機制](#認證機制)
- [錯誤碼規格](#錯誤碼規格)

---

## 自有 API 端點

### GET `/power-shop/reports/dashboard/stats`

**說明**：取得 Dashboard KPI 卡片所需的統計資料。

**Namespace**：`power-shop/v1`（完整路徑：`/wp-json/power-shop/reports/dashboard/stats`）

**權限要求**：`manage_woocommerce`

**Request**

| 參數名稱 | 類型 | 必填 | 說明 |
|---------|------|------|------|
| `period` | `string` | No | 統計期間，可選值：`today`、`week`、`month`、`year`（預設：`month`） |
| `date_from` | `string` | No | 自訂起始日期（ISO 8601，如 `2025-01-01`），與 `period` 互斥 |
| `date_to` | `string` | No | 自訂結束日期（ISO 8601，如 `2025-03-31`），與 `period` 互斥 |

**Response（200 OK）**

```json
{
  "current": {
    "revenue": 125000.00,
    "new_customers": 42,
    "pending_orders": 8,
    "processing_orders": 15
  },
  "previous": {
    "revenue": 108000.00,
    "new_customers": 35,
    "pending_orders": 5,
    "processing_orders": 20
  },
  "change": {
    "revenue_pct": 15.74,
    "new_customers_pct": 20.00,
    "pending_orders_pct": 60.00,
    "processing_orders_pct": -25.00
  },
  "generated_at": "2025-03-10T10:30:00+08:00"
}
```

**欄位說明**

| 欄位 | 類型 | 說明 |
|------|------|------|
| `current.revenue` | `float` | 當期總營收（已完成/處理中訂單的稅前金額） |
| `current.new_customers` | `integer` | 當期新註冊顧客數 |
| `current.pending_orders` | `integer` | 未付款訂單數（status = pending） |
| `current.processing_orders` | `integer` | 未出貨訂單數（status = processing） |
| `previous.*` | 同上 | 前一期（同等長度）的對應數值 |
| `change.*_pct` | `float` | 與前期比較的百分比變化（正數=成長，負數=衰退） |
| `generated_at` | `string` | 資料生成時間（ISO 8601，帶時區） |

**Error Response**

```json
{
  "code": "ps_unauthorized",
  "message": "您沒有存取此資源的權限",
  "data": {
    "status": 403
  }
}
```

---

## WooCommerce REST API（使用端點）

Power Shop 前端主要透過 WooCommerce REST API v3（`/wp-json/wc/v3/`）進行資料存取。以下列出已使用的端點。

### 訂單模組

| 方法 | 端點 | 說明 |
|------|------|------|
| `GET` | `/wc/v3/orders` | 取得訂單列表（支援分頁、搜尋、狀態篩選） |
| `GET` | `/wc/v3/orders/{id}` | 取得單一訂單詳情 |
| `POST` | `/wc/v3/orders` | 建立新訂單 |
| `PUT` | `/wc/v3/orders/{id}` | 更新訂單（地址、狀態、備註等） |
| `DELETE` | `/wc/v3/orders/{id}` | 刪除單一訂單 |
| `POST` | `/wc/v3/orders/batch` | 批量更新/刪除訂單 |
| `GET` | `/wc/v3/orders/{id}/notes` | 取得訂單備註列表 |
| `POST` | `/wc/v3/orders/{id}/notes` | 新增訂單備註 |
| `DELETE` | `/wc/v3/orders/{id}/notes/{note_id}` | 刪除訂單備註 |

**常用查詢參數（訂單列表）**

| 參數 | 類型 | 說明 |
|------|------|------|
| `page` | `integer` | 頁碼（預設 1） |
| `per_page` | `integer` | 每頁筆數（預設 10，最大 100） |
| `search` | `string` | 關鍵字搜尋 |
| `status` | `string` | 狀態篩選（`pending`、`processing`、`completed`、`cancelled` 等） |
| `orderby` | `string` | 排序欄位（`date`、`id`） |
| `order` | `string` | 排序方向（`asc`、`desc`） |

---

### 商品模組

| 方法 | 端點 | 說明 |
|------|------|------|
| `GET` | `/wc/v3/products` | 取得商品列表 |
| `GET` | `/wc/v3/products/{id}` | 取得單一商品詳情 |
| `POST` | `/wc/v3/products` | 建立新商品 |
| `PUT` | `/wc/v3/products/{id}` | 更新商品 |
| `DELETE` | `/wc/v3/products/{id}` | 刪除商品 |
| `POST` | `/wc/v3/products/batch` | 批量操作商品 |
| `GET` | `/wc/v3/products/{id}/variations` | 取得商品變體列表 |
| `POST` | `/wc/v3/products/{id}/variations` | 建立商品變體 |
| `PUT` | `/wc/v3/products/{id}/variations/{variation_id}` | 更新變體 |
| `DELETE` | `/wc/v3/products/{id}/variations/{variation_id}` | 刪除變體 |
| `POST` | `/wc/v3/products/{id}/variations/batch` | 批量操作變體 |
| `GET` | `/wc/v3/products/categories` | 取得商品分類列表 |
| `POST` | `/wc/v3/products/categories` | 建立商品分類 |
| `PUT` | `/wc/v3/products/categories/{id}` | 更新商品分類 |
| `DELETE` | `/wc/v3/products/categories/{id}` | 刪除商品分類 |
| `GET` | `/wc/v3/products/tags` | 取得商品標籤列表 |
| `POST` | `/wc/v3/products/tags` | 建立商品標籤 |
| `PUT` | `/wc/v3/products/tags/{id}` | 更新商品標籤 |
| `DELETE` | `/wc/v3/products/tags/{id}` | 刪除商品標籤 |
| `GET` | `/wc/v3/products/attributes` | 取得全域規格列表 |
| `POST` | `/wc/v3/products/attributes` | 建立全域規格 |
| `PUT` | `/wc/v3/products/attributes/{id}` | 更新全域規格 |
| `DELETE` | `/wc/v3/products/attributes/{id}` | 刪除全域規格 |
| `GET` | `/wc/v3/products/attributes/{id}/terms` | 取得規格選項值 |

---

### 顧客模組

| 方法 | 端點 | 說明 |
|------|------|------|
| `GET` | `/wc/v3/customers` | 取得顧客列表 |
| `GET` | `/wc/v3/customers/{id}` | 取得單一顧客詳情 |
| `PUT` | `/wc/v3/customers/{id}` | 更新顧客資料 |
| `DELETE` | `/wc/v3/customers/{id}` | 刪除顧客 |
| `POST` | `/wc/v3/customers/batch` | 批量操作顧客 |

---

### 報表模組

| 方法 | 端點 | 說明 |
|------|------|------|
| `GET` | `/wc/v3/reports/revenue/stats` | 營收統計報表 |
| `GET` | `/wc/v3/reports/products/stats` | 商品銷售報表 |
| `GET` | `/wc/v3/reports/customers/stats` | 顧客統計報表 |
| `GET` | `/wc/v3/reports/orders/stats` | 訂單統計報表 |

---

## WordPress REST API（使用端點）

| 方法 | 端點 | 說明 |
|------|------|------|
| `GET` | `/wp/v2/media` | 取得媒體庫列表 |
| `POST` | `/wp/v2/media` | 上傳媒體檔案 |
| `GET` | `/wp/v2/users/{id}` | 取得使用者資訊 |
| `PUT` | `/wp/v2/users/{id}` | 更新使用者資訊（含 User Meta） |

---

## 認證機制

### WP Cookie Authentication（後台頁面）

後台 React SPA 透過 WordPress 登入 Session Cookie 進行認證，所有 API 請求需帶上 `X-WP-Nonce` Header。

```http
GET /wp-json/wc/v3/orders HTTP/1.1
X-WP-Nonce: {nonce_value}
Cookie: wordpress_logged_in_{hash}={session_value}
```

**Nonce 取得方式**：透過 `wp_localize_script` 注入加密後的設定物件，前端解密後取得 Nonce 值。

### SimpleEncrypt 加密流程

```
PHP: encrypt({ nonce, rest_url, api_url })
  → base64-encoded encrypted string
  → wp_localize_script 注入至 window.powerShopConfig

JavaScript: decrypt(window.powerShopConfig)
  → { nonce, rest_url, api_url }
  → 設定 Refine.dev DataProvider
```

---

## 錯誤碼規格

### 自有 API 錯誤碼

| 錯誤碼 | HTTP 狀態 | 說明 |
|--------|----------|------|
| `ps_unauthorized` | 403 | 無存取權限（未登入或缺少能力） |
| `ps_invalid_params` | 400 | 請求參數無效 |
| `ps_date_range_exceeded` | 400 | 日期範圍超過上限（1 年） |
| `ps_internal_error` | 500 | 伺服器內部錯誤 |

### WooCommerce REST API 常見錯誤碼

| 錯誤碼 | HTTP 狀態 | 說明 |
|--------|----------|------|
| `woocommerce_rest_cannot_view` | 403 | 無查看權限 |
| `woocommerce_rest_invalid_id` | 404 | 資源不存在 |
| `woocommerce_rest_product_invalid_id` | 404 | 商品不存在 |
| `woocommerce_rest_order_invalid_id` | 404 | 訂單不存在 |

### 錯誤回應格式

所有 API 錯誤均遵循以下 JSON 結構：

```json
{
  "code": "error_code_slug",
  "message": "人類可讀的錯誤說明（繁體中文）",
  "data": {
    "status": 400,
    "params": {
      "date_from": "日期格式錯誤，請使用 YYYY-MM-DD"
    }
  }
}
```
