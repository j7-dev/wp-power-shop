# Power Shop — API 端點速查

> 從 `specs/api/api.yml`（OpenAPI 3.0）提取。完整定義請參閱原始規格檔。

---

## 認證

所有端點使用 `X-WP-Nonce` header 搭配 WordPress Cookie 認證。

---

## 自有端點（`power-shop` namespace）

| Method | 路徑 | operationId | 說明 |
|--------|------|-------------|------|
| GET | `/power-shop/reports/dashboard/stats` | getDashboardStats | KPI 統計（營收、訂單數、新客數） |
| GET | `/power-shop/reports/dashboard/leaderboard` | getDashboardLeaderboard | 商品/顧客/分類排行榜 |
| GET | `/power-shop/reports/dashboard/trend` | getDashboardTrend | 營收趨勢圖表資料 |
| GET | `/power-shop/reports/revenue` | getRevenueReport | 多維度營收分析報表 |
| POST | `/power-shop/customers/{id}/notes` | createCustomerNote | 新增顧客聯繫備註 |
| GET | `/power-shop/customers/{id}/notes` | listCustomerNotes | 查詢顧客聯繫備註列表 |

### Dashboard 共用查詢參數

| 參數 | 型別 | 預設 | 說明 |
|------|------|------|------|
| `period` | string | `month` | `today`/`yesterday`/`week`/`month`/`year`/`custom` |
| `date_start` | date | - | period=custom 時使用 |
| `date_end` | date | - | period=custom 時使用 |

### Revenue 額外參數

| 參數 | 型別 | 預設 | 說明 |
|------|------|------|------|
| `interval` | string | `day` | `day`/`week`/`month` |
| `order_status` | array | - | 篩選訂單狀態（逗號分隔） |

---

## WooCommerce REST API（`wc/v3`）

| Method | 路徑 | operationId | 說明 |
|--------|------|-------------|------|
| GET | `/wc/v3/orders` | listOrders | 查詢訂單列表 |
| POST | `/wc/v3/orders` | createOrder | 建立訂單 |
| PUT | `/wc/v3/orders/{id}` | updateOrder | 更新訂單（狀態/地址） |
| POST | `/wc/v3/orders/batch` | batchDeleteOrders | 批量刪除訂單 |
| POST | `/wc/v3/orders/{id}/notes` | createOrderNote | 新增訂單備註 |
| GET | `/wc/v3/products` | listProducts | 查詢商品列表 |
| POST | `/wc/v3/products` | createProduct | 建立草稿商品 |
| PUT | `/wc/v3/products/{id}` | updateProduct | 儲存商品資料 |
| POST | `/wc/v3/products/{id}/variations/batch` | batchProductVariations | 批量管理商品變體 |
| GET | `/wc/v3/products/categories` | listProductCategories | 查詢商品分類列表 |
| POST | `/wc/v3/products/categories` | createProductCategory | 新增商品分類 |
| GET | `/wc/v3/customers` | listCustomers | 查詢顧客列表 |
| GET | `/wc/v3/customers/{id}` | getCustomer | 查詢顧客詳情 |
| PUT | `/wc/v3/customers/{id}` | updateCustomer | 編輯顧客資料 |

---

## WordPress REST API（`wp/v2`）

| Method | 路徑 | operationId | 說明 |
|--------|------|-------------|------|
| PUT | `/wp/v2/users/{id}` | updateUserMeta | 編輯顧客 UserMeta |

---

## 資料模型（Schema）

完整定義在 `specs/api/api.yml` 的 `components.schemas`：

| Schema | 說明 |
|--------|------|
| Order | 訂單 |
| OrderItem | 訂單商品項目 |
| OrderNote | 訂單備註 |
| Product | 商品 |
| ProductVariation | 商品變體 |
| ProductAttribute | 商品屬性 |
| ProductCategory | 商品分類 |
| Customer | 顧客 |
| CustomerNote | 顧客聯繫備註 |
| DashboardStats | KPI 統計 |
| DashboardLeaderboard | 排行榜 |
| DashboardTrend | 趨勢圖 |
| RevenueReport | 營收報表 |
| Address | 地址（帳單/配送） |
| Image | 圖片 |
| MetaData | Meta 資料 |
