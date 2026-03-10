# Event Storming: Power Shop

> **系統**：Power Shop WordPress Plugin（WooCommerce 擴充後台）
> **最後更新**：2026-03
> **說明**：本文件以 Event Storming 方法描述 Power Shop 的業務流程，涵蓋 Actor、Aggregate、Command 與 Read Model。

---

## Actors

- **店舖管理者** [人]: 具有 WordPress `manage_woocommerce` 能力的後台使用者，涵蓋電商管理者、客服人員、商品管理人員、倉管人員等操作角色。

---

## Aggregates

### 訂單 (Order)

> WooCommerce 訂單實體（`wp_posts` post_type='shop_order'），紀錄完整的交易資訊，包含商品明細、地址、狀態與備註。

| 屬性 | 說明 |
|------|------|
| `id` | 訂單 ID (Post ID) |
| `number` | 訂單編號（如 `#1001`） |
| `status` | 訂單狀態（`pending` / `processing` / `on-hold` / `completed` / `cancelled` / `refunded` / `failed`） |
| `customer_id` | 顧客 ID（0 = 訪客訂單） |
| `billing` | 帳單地址物件 |
| `shipping` | 運送地址物件 |
| `line_items` | 訂單商品明細（OrderItem[]） |
| `total` | 訂單總金額 |
| `payment_method` | 付款方式代碼 |
| `date_created` | 建立時間（ISO 8601） |
| `date_modified` | 最後修改時間（ISO 8601） |

---

### 訂單備註 (OrderNote)

> 附屬於訂單的備註（`wp_comments` comment_type='order_note'），區分顧客可見與後台內部備註。

| 屬性 | 說明 |
|------|------|
| `id` | 備註 ID |
| `note` | 備註內容 |
| `customer_note` | 是否顧客可見（`true` = 顧客備註 / `false` = 內部備註） |
| `author` | 建立者名稱 |
| `date_created` | 建立時間 |

---

### 商品 (Product)

> WooCommerce 商品實體（`wp_posts` post_type='product'），支援 Simple / Variable / Subscription / External / Grouped 多種類型。

| 屬性 | 說明 |
|------|------|
| `id` | 商品 ID |
| `name` | 商品名稱 |
| `slug` | URL 別名 |
| `type` | 商品類型（`simple` / `variable` / `grouped` / `external` / `subscription` / `variable-subscription`） |
| `status` | 發布狀態（`publish` / `draft` / `trash`） |
| `description` | 完整描述（HTML） |
| `short_description` | 簡短描述（HTML） |
| `sku` | SKU（庫存管理單位） |
| `gtin` | GTIN（全球商品識別碼） |
| `regular_price` | 一般售價 |
| `sale_price` | 特價 |
| `date_on_sale_from` | 特價起始時間 |
| `date_on_sale_to` | 特價結束時間 |
| `manage_stock` | 是否啟用庫存管理 |
| `stock_quantity` | 庫存數量 |
| `stock_status` | 庫存狀態（`instock` / `outofstock` / `onbackorder`） |
| `backorders` | 缺貨處理（`no` / `notify` / `yes`） |
| `low_stock_amount` | 安全庫存警示值 |
| `images` | 圖片列表（第一張為主圖） |
| `categories` | 所屬分類 |
| `tags` | 標籤 |
| `attributes` | 規格屬性 |
| `variations` | 變體 ID 列表（Variable 商品） |
| `upsell_ids` | 追加銷售商品 ID |
| `cross_sell_ids` | 交叉銷售商品 ID |
| `grouped_products` | 分組商品 ID |
| `purchase_note` | 購買備註 |
| `menu_order` | 選單排序 |

---

### 商品變體 (ProductVariation)

> 隸屬於 Variable 商品的個別規格組合，擁有獨立的價格、SKU 與庫存設定。

| 屬性 | 說明 |
|------|------|
| `id` | 變體 ID |
| `parent_id` | 所屬商品 ID |
| `sku` | 變體 SKU |
| `regular_price` | 一般售價 |
| `sale_price` | 特價 |
| `status` | 狀態（`publish` / `private`） |
| `manage_stock` | 是否獨立管理庫存 |
| `stock_quantity` | 庫存數量 |
| `stock_status` | 庫存狀態 |
| `image` | 變體圖片 |
| `attributes` | 變體屬性值（如 `{ 顏色: 紅色 }`） |

---

### 商品分類 (ProductCategory)

> WooCommerce 商品分類（`wp_terms` taxonomy='product_cat'），支援階層式父子結構與拖拉排序。

| 屬性 | 說明 |
|------|------|
| `id` | 分類 ID |
| `name` | 分類名稱 |
| `slug` | URL 別名 |
| `parent` | 父分類 ID（0 = 頂層分類） |
| `description` | 分類描述 |
| `image` | 分類縮圖 |
| `count` | 所屬商品數量 |
| `menu_order` | 排序位置（SortableTree 使用） |

---

### 顧客 (Customer)

> WordPress User + WooCommerce Customer（`wp_users` + `wp_usermeta`），包含聯絡資訊、地址、消費統計與 User Meta。

| 屬性 | 說明 |
|------|------|
| `id` | 顧客 ID（WP User ID） |
| `email` | Email 地址（唯一） |
| `first_name` | 名字 |
| `last_name` | 姓氏 |
| `username` | WordPress 使用者名稱 |
| `role` | WordPress 角色（如 `customer`） |
| `billing` | 預設帳單地址 |
| `shipping` | 預設運送地址 |
| `orders_count` | 訂單總數 |
| `total_spent` | 總消費金額 |
| `date_created` | 帳號建立時間 |
| `meta_data` | User Meta 擴充資料 |

---

### 顧客聯繫備註 (CustomerNote)

> 後台人員為顧客建立的聯繫記錄，以時間軸呈現，僅後台可見。

| 屬性 | 說明 |
|------|------|
| `id` | 備註 ID |
| `customer_id` | 所屬顧客 ID |
| `author_id` | 建立者（WordPress User ID） |
| `author_name` | 建立者顯示名稱 |
| `content` | 備註內容 |
| `date_created` | 建立時間 |

---

### Dashboard 統計 (DashboardStats)

> 非持久化統計實體，由 Power Shop 自有 API 動態計算，不存入資料庫。

| 屬性 | 說明 |
|------|------|
| `current.revenue` | 當期總營收 |
| `current.new_customers` | 當期新顧客數 |
| `current.pending_orders` | 未付款訂單數 |
| `current.processing_orders` | 未出貨訂單數 |
| `previous.*` | 前一等長期間的對應數值 |
| `change.*_pct` | 環比變化百分比 |
| `generated_at` | 資料生成時間戳 |

---

### 營收報表 (RevenueReport)

> 非持久化報表實體，由 WooCommerce REST API `/wc/v3/reports/revenue/stats` 動態計算。

| 屬性 | 說明 |
|------|------|
| `totals.gross_revenue` | 總營收（含退款前） |
| `totals.net_revenue` | 淨營收（扣除退款） |
| `totals.orders_count` | 訂單數量 |
| `totals.avg_order_value` | 平均訂單金額 |
| `totals.num_items_sold` | 售出商品總件數 |
| `totals.coupons` | 優惠券折扣總額 |
| `totals.refunds` | 退款總額 |
| `intervals` | 依時間區間分組的時序資料陣列 |

---

## Commands

### 建立草稿商品

- **Actor**: 店舖管理者
- **Aggregate**: 商品 (Product)
- **Predecessors**: 無
- **參數**: `name`（商品名稱）
- **Description**:
  - What: 以最少資訊（僅商品名稱）建立一筆狀態為 `draft` 的商品
  - Why: 讓管理人員先佔位後再慢慢填入完整資訊，提升上架前備稿效率
  - When: 管理人員在商品列表頁面點擊「快速建立」後輸入名稱並送出

#### Rules

- 前置（狀態）:
  - 無
- 前置（參數）:
  - `name` 不可為空字串
- 後置（狀態）:
  - 建立一筆 `status = draft` 的商品記錄
  - 新商品出現在商品列表頂端

---

### 儲存商品資料

- **Actor**: 店舖管理者
- **Aggregate**: 商品 (Product), 商品變體 (ProductVariation)
- **Predecessors**: 建立草稿商品
- **參數**: `id`, `name`, `slug`, `type`, `status`, `description`, `short_description`, `sku`, `gtin`, `regular_price`, `sale_price`, `date_on_sale_from`, `date_on_sale_to`, `manage_stock`, `stock_quantity`, `backorders`, `low_stock_amount`, `images`, `categories`, `tags`, `attributes`, `upsell_ids`, `cross_sell_ids`, `grouped_products`, `purchase_note`, `menu_order`, `external_url`, `button_text`, `meta_data`
- **Description**:
  - What: 將商品編輯頁面所有 Tab（描述、價格、庫存、規格、進階、關聯）的資料儲存至 WooCommerce
  - Why: 讓管理人員更新商品的完整資訊，維護準確的商品上架資料
  - When: 管理人員在商品編輯頁面完成編輯後點擊「儲存」按鈕

#### Rules

- 前置（狀態）:
  - 商品 `id` 必須存在
- 前置（參數）:
  - `name` 不可為空
  - `regular_price` 若填寫則必須為非負數
  - `sale_price` 若填寫則必須 ≤ `regular_price`
  - `date_on_sale_from` 若填寫則必須為有效日期
  - `date_on_sale_to` 若填寫則必須 ≥ `date_on_sale_from`
  - `stock_quantity` 若 `manage_stock = true` 則必須為非負整數
- 後置（狀態）:
  - 商品所有欄位更新完成
  - 若 `stock_quantity` 歸零且 `backorders = 'no'`，`stock_status` 自動更新為 `outofstock`

---

### 自動生成商品變體

- **Actor**: 店舖管理者
- **Aggregate**: 商品變體 (ProductVariation), 商品 (Product)
- **Predecessors**: 儲存商品資料
- **參數**: `product_id`
- **Description**:
  - What: 根據商品規格 Tab 中標記為「用於建立變體」的屬性，自動生成所有可能的規格組合變體
  - Why: 減少管理人員手動逐一建立變體的工作量，確保不遺漏任何規格組合
  - When: 管理人員在 Variable 商品的「變體」Tab 點擊「自動生成所有變體」

#### Rules

- 前置（狀態）:
  - 商品類型必須為 `variable`
  - 商品至少需有一個屬性標記為 `variation = true`
  - 各屬性的 `options` 不可為空
- 前置（參數）:
  - `product_id` 必須存在且為 `variable` 商品
- 後置（狀態）:
  - 依屬性的笛卡兒積建立對應數量的變體（如 2 色 × 3 尺寸 = 6 個變體）
  - 已存在相同規格組合的變體不重複建立
  - 新建立的變體預設 `status = publish`，價格與庫存為空

---

### 新增商品分類

- **Actor**: 店舖管理者
- **Aggregate**: 商品分類 (ProductCategory)
- **Predecessors**: 無
- **參數**: `name`, `slug`, `parent`（父分類 ID，可選）, `description`（可選）, `image`（可選）
- **Description**:
  - What: 在 WooCommerce 建立一個新的商品分類節點，可指定父分類形成階層結構
  - Why: 讓管理人員維護清晰的商品分類體系，方便顧客瀏覽與商品歸類
  - When: 管理人員在分類管理頁面點擊「新增分類」並填寫資料送出

#### Rules

- 前置（狀態）:
  - 無
- 前置（參數）:
  - `name` 不可為空
  - `slug` 若填寫則必須在 `product_cat` 分類法中唯一（系統可自動從 `name` 生成）
  - `parent` 若填寫則必須為有效的分類 ID
- 後置（狀態）:
  - 建立新分類節點
  - 若有 `parent` 則成為其子分類
  - 分類樹即時更新

---

### 建立訂單

- **Actor**: 店舖管理者
- **Aggregate**: 訂單 (Order)
- **Predecessors**: 無
- **參數**: `customer_id`（可選）, `line_items`（商品ID+數量）, `billing`（Address）, `shipping`（Address，可選）, `payment_method`（可選）, `status`（可選，預設 `pending`）
- **Description**:
  - What: 在後台手動為指定顧客（或訪客）建立一筆新訂單
  - Why: 讓管理人員代替顧客下單，處理電話訂購或補單需求
  - When: 管理人員在訂單列表點擊「建立訂單」後填寫表單並提交

#### Rules

- 前置（狀態）:
  - 無
- 前置（參數）:
  - `line_items` 不可為空，至少含一個商品
  - 每個 `line_item` 的 `product_id` 必須存在
  - `quantity` 必須為正整數
  - `billing` 地址為必填
  - `status` 若提供則必須為有效的 WooCommerce 訂單狀態值
- 後置（狀態）:
  - 建立新訂單，`status` 為指定值（預設 `pending`）
  - 若有 `customer_id` 則訂單關聯至該顧客

---

### 更新訂單狀態

- **Actor**: 店舖管理者
- **Aggregate**: 訂單 (Order)
- **Predecessors**: 無
- **參數**: `order_id`, `status`
- **Description**:
  - What: 將指定訂單的狀態變更為新的狀態值
  - Why: 讓客服人員追蹤訂單處理進度，並觸發 WooCommerce 對應的狀態轉換動作（如發送通知信）
  - When: 管理人員在訂單詳情頁面修改付款狀態或訂單狀態下拉選單

#### Rules

- 前置（狀態）:
  - `order_id` 必須存在
- 前置（參數）:
  - `status` 必須為有效的 WooCommerce 訂單狀態值（`pending` / `processing` / `on-hold` / `completed` / `cancelled` / `refunded` / `failed`）
- 後置（狀態）:
  - 訂單 `status` 更新
  - WooCommerce 觸發對應狀態轉換 Hook（如發送顧客通知信）
  - 訂單時間軸新增狀態變更記錄

---

### 編輯訂單地址

- **Actor**: 店舖管理者
- **Aggregate**: 訂單 (Order)
- **Predecessors**: 無
- **參數**: `order_id`, `address_type`（`billing` | `shipping`）, `first_name`, `last_name`, `company`, `address_1`, `address_2`, `city`, `state`, `postcode`, `country`, `email`（billing 限定）, `phone`
- **Description**:
  - What: 修改訂單的帳單地址或運送地址欄位
  - Why: 讓客服人員處理顧客填寫錯誤地址的情況，確保出貨資訊正確
  - When: 管理人員在訂單詳情頁面點擊地址區塊的「編輯」按鈕，修改後點擊「儲存」

#### Rules

- 前置（狀態）:
  - `order_id` 必須存在
- 前置（參數）:
  - `address_type` 必須為 `billing` 或 `shipping`
  - `country` 若填寫則必須為有效的 ISO 3166-1 alpha-2 國家代碼
- 後置（狀態）:
  - 訂單對應地址欄位更新完成

---

### 新增訂單備註

- **Actor**: 店舖管理者
- **Aggregate**: 訂單備註 (OrderNote), 訂單 (Order)
- **Predecessors**: 無
- **參數**: `order_id`, `note`（備註內容）, `customer_note`（boolean，預設 `false`）
- **Description**:
  - What: 在指定訂單新增一則備註，可選擇是否對顧客可見
  - Why: 讓客服人員記錄訂單處理進度或向顧客傳遞訊息
  - When: 管理人員在訂單詳情頁面的備註區塊輸入內容後點擊「新增備註」

#### Rules

- 前置（狀態）:
  - `order_id` 必須存在
- 前置（參數）:
  - `note` 不可為空
  - `customer_note` 必須為 boolean
- 後置（狀態）:
  - OrderNote 建立並關聯至 `order_id`，記錄 `author` 為當前登入使用者名稱
  - 備註出現在訂單時間軸最上方（最新優先）
  - 若 `customer_note = true`，顧客可在訂單詳情頁查看該備註

---

### 批量刪除訂單

- **Actor**: 店舖管理者
- **Aggregate**: 訂單 (Order)
- **Predecessors**: 無
- **參數**: `order_ids`（integer[]）
- **Description**:
  - What: 一次刪除多筆選取的訂單（force delete，不移至垃圾桶）
  - Why: 讓管理人員有效率地清理垃圾訂單或測試訂單，維護整潔的訂單資料庫
  - When: 管理人員在訂單列表勾選多筆訂單後點擊「批量刪除」，並通過確認對話框

#### Rules

- 前置（狀態）:
  - 所有 `order_ids` 必須存在
- 前置（參數）:
  - `order_ids` 不可為空陣列
  - 必須通過前端確認對話框（防止誤操作）
- 後置（狀態）:
  - 所有指定訂單從系統中刪除（WooCommerce force delete）

---

### 編輯顧客資料

- **Actor**: 店舖管理者
- **Aggregate**: 顧客 (Customer)
- **Predecessors**: 無
- **參數**: `customer_id`, `first_name`, `last_name`, `email`, `phone`, `billing`（Address，可選）, `shipping`（Address，可選）
- **Description**:
  - What: 更新顧客的基本聯絡資訊（姓名、Email、電話）與預設帳單/運送地址
  - Why: 讓客服人員維護正確的顧客資料，處理顧客更換聯絡資訊或地址的需求
  - When: 管理人員在顧客詳情頁面點擊編輯模式，修改欄位後點擊「儲存」

#### Rules

- 前置（狀態）:
  - `customer_id` 必須存在
- 前置（參數）:
  - `email` 若填寫則必須為有效的 Email 格式
  - `email` 必須在系統中唯一（不得與其他使用者重複）
- 後置（狀態）:
  - 顧客對應欄位更新（WooCommerce Customer 與 WP User 同步更新）

---

### 編輯顧客 UserMeta

- **Actor**: 店舖管理者
- **Aggregate**: 顧客 (Customer)
- **Predecessors**: 無
- **參數**: `customer_id`, `meta_key`, `meta_value`
- **Description**:
  - What: 直接修改顧客的 WordPress User Meta 特定鍵值
  - Why: 讓系統管理員能修正異常的顧客資料或調整系統內部標記（高風險操作）
  - When: 管理人員在顧客詳情頁的 User Meta 區塊點擊「編輯」，通過雙重確認警告後進行修改

#### Rules

- 前置（狀態）:
  - `customer_id` 必須存在
- 前置（參數）:
  - `meta_key` 不可為空
  - 必須通過前端雙重確認對話框（警示：直接修改 User Meta 可能影響系統行為）
- 後置（狀態）:
  - 指定的 User Meta 鍵值更新完成

---

### 新增顧客聯繫備註

- **Actor**: 店舖管理者
- **Aggregate**: 顧客聯繫備註 (CustomerNote), 顧客 (Customer)
- **Predecessors**: 無
- **參數**: `customer_id`, `content`（備註內容）
- **Description**:
  - What: 在顧客檔案新增一則聯繫記錄備註
  - Why: 讓客服人員記錄與顧客的溝通歷程，方便後續跟進
  - When: 管理人員在顧客詳情頁的「聯繫備註」區塊輸入內容後點擊「新增備註」

#### Rules

- 前置（狀態）:
  - `customer_id` 必須存在
- 前置（參數）:
  - `content` 不可為空
- 後置（狀態）:
  - CustomerNote 建立，關聯至 `customer_id`，`author_id` 記錄為當前登入者
  - 備註出現在顧客聯繫備註時間軸最上方（最新優先）

---

## Read Models

### 查詢 Dashboard KPI 統計

- **Actor**: 店舖管理者
- **Aggregates**: DashboardStats
- **回傳欄位**: `current.revenue`, `current.new_customers`, `current.pending_orders`, `current.processing_orders`, `previous.*`, `change.*_pct`, `generated_at`
- **Description**:
  - What: 查詢當期與前期的 KPI 數據（總營收、新顧客數、未付款訂單數、未出貨訂單數）及其環比變化百分比
  - Why: 讓管理者在進入後台時立即掌握今日/本期的業績狀況
  - When: 管理者進入 Dashboard 頁面時自動觸發，或手動切換查詢期間時重新載入

#### Rules

- 前置（狀態）:
  - 無
- 前置（參數）:
  - `period` 為 `today` / `week` / `month` / `year` 之一，或同時提供 `date_from` 與 `date_to`
  - `date_from` 與 `date_to` 若提供則必須為有效 ISO 8601 日期格式（`YYYY-MM-DD`）
  - `period` 與 `date_from`/`date_to` 互斥，不可同時使用
- 後置（回應）:
  - 回傳 `current`、`previous`、`change` 三個區塊的完整統計數據
  - 若查詢期間無資料，對應欄位回傳 `0`

---

### 查詢排行榜

- **Actor**: 店舖管理者
- **Aggregates**: 商品 (Product), 顧客 (Customer), 訂單 (Order)
- **回傳欄位**: `type`, `period`, `items[].id`, `items[].name`, `items[].count`, `items[].total`
- **Description**:
  - What: 查詢指定期間內的商品銷售排行榜或顧客消費排行榜（前 5 名）
  - Why: 讓管理者了解暢銷商品與高價值顧客，輔助庫存補貨與行銷決策
  - When: 管理者在 Dashboard 頁面查看排行榜，或調整日期範圍時自動更新

#### Rules

- 前置（狀態）:
  - 無
- 前置（參數）:
  - `type` 必須為 `product` 或 `customer`
  - 日期範圍（`date_from` / `date_to`）或 `period` 必須有效
- 後置（回應）:
  - 回傳最多前 5 名的排行資料
  - 依 `total`（金額）降冪排序
  - 若查詢期間無資料，回傳空陣列

---

### 查詢營收趨勢圖表

- **Actor**: 店舖管理者
- **Aggregates**: DashboardStats
- **回傳欄位**: `intervals[].interval`, `intervals[].date_start`, `intervals[].date_end`, `intervals[].subtotals.gross_revenue`, `intervals[].subtotals.orders_count`，以及去年同期對應數據
- **Description**:
  - What: 查詢指定期間的營收與訂單數趨勢資料，依選定時間區間（日/週/月/年）分組，包含去年同期比較
  - Why: 讓管理者透過視覺化圖表識別業績高峰與低谷，規劃行銷活動
  - When: 管理者在 Dashboard 查看趨勢圖表，或切換統計區間（日/週/月/年）時自動更新

#### Rules

- 前置（狀態）:
  - 無
- 前置（參數）:
  - `interval` 必須為 `day` / `week` / `month` / `year` 之一
  - 查詢期間（`date_from` / `date_to` 或 `period`）必須有效
- 後置（回應）:
  - 回傳依區間分組的時序資料陣列
  - 同時回傳去年同期資料供同期比較使用（圖表以灰色虛線呈現）

---

### 查詢訂單列表

- **Actor**: 店舖管理者
- **Aggregates**: 訂單 (Order)
- **回傳欄位**: `id`, `number`, `status`, `customer_id`, `customer_name`, `total`, `date_created`, `payment_method`，分頁資訊
- **Description**:
  - What: 查詢符合篩選條件的訂單列表，支援分頁、關鍵字搜尋、狀態篩選與排序
  - Why: 讓客服人員快速找到需要處理的訂單
  - When: 管理者進入訂單列表頁面，或套用搜尋/篩選條件時

#### Rules

- 前置（狀態）:
  - 無
- 前置（參數）:
  - `status` 若提供則必須為有效的 WooCommerce 訂單狀態
  - `per_page` 可選值為 `10` / `25` / `50`（最大 100）
  - `orderby` 必須為 `date` 或 `id`
  - `order` 必須為 `asc` 或 `desc`
- 後置（回應）:
  - 回傳符合條件的訂單列表
  - 回傳分頁資訊：`total`（總筆數）、`total_pages`（總頁數）

---

### 查詢商品列表

- **Actor**: 店舖管理者
- **Aggregates**: 商品 (Product)
- **回傳欄位**: `id`, `name`, `type`, `status`, `sku`, `regular_price`, `stock_status`, `stock_quantity`, `images[0]`，分頁資訊
- **Description**:
  - What: 查詢符合篩選條件的商品列表，支援分頁、商品類型篩選與發布狀態篩選
  - Why: 讓商品管理人員快速瀏覽與找到目標商品
  - When: 管理者進入商品列表頁面，或套用類型/狀態篩選條件時

#### Rules

- 前置（狀態）:
  - 無
- 前置（參數）:
  - `type` 若提供則必須為有效的商品類型（`simple` / `variable` / `grouped` / `external` / `subscription` / `variable-subscription`）
  - `status` 若提供則必須為 `publish` / `draft` / `trash`
  - `per_page` 可選值為 `10` / `25` / `50`
- 後置（回應）:
  - 回傳符合條件的商品列表
  - 預設依 `id` 降冪排序（最新建立的在前）
  - 回傳分頁資訊：`total`、`total_pages`

---

### 查詢顧客列表

- **Actor**: 店舖管理者
- **Aggregates**: 顧客 (Customer)
- **回傳欄位**: `id`, `first_name`, `last_name`, `email`, `orders_count`, `total_spent`, `date_created`, `last_order`，分頁資訊
- **Description**:
  - What: 查詢符合篩選條件的顧客列表，支援分頁、關鍵字搜尋（姓名/Email）與角色篩選
  - Why: 讓客服人員快速找到目標顧客
  - When: 管理者進入顧客列表頁面，或套用搜尋/篩選條件時

#### Rules

- 前置（狀態）:
  - 無
- 前置（參數）:
  - `per_page` 可選值為 `10` / `25` / `50`
  - `role` 若提供則必須為有效的 WordPress 角色名稱（如 `customer`）
- 後置（回應）:
  - 回傳符合條件的顧客列表
  - 回傳分頁資訊：`total`、`total_pages`

---

### 查詢顧客詳情

- **Actor**: 店舖管理者
- **Aggregates**: 顧客 (Customer), 顧客聯繫備註 (CustomerNote), 訂單 (Order)
- **回傳欄位**: 顧客完整欄位（含 `meta_data`）、聯繫備註列表、近期訂單列表（最多 10 筆）、購物車內容
- **Description**:
  - What: 查詢單一顧客的完整資料，包含基本資訊、地址、User Meta、購物車內容、近期訂單與聯繫備註
  - Why: 讓客服人員全面了解顧客背景，提供個人化服務
  - When: 管理者在顧客列表點擊顧客名稱進入詳情頁時

#### Rules

- 前置（狀態）:
  - `customer_id` 必須存在
- 前置（參數）:
  - `customer_id` 為必填
- 後置（回應）:
  - 回傳顧客完整資料（含帳單/運送地址、User Meta）
  - 聯繫備註依 `date_created` 降冪排序
  - 近期訂單依 `date_created` 降冪排序，最多返回 10 筆
  - 購物車內容若為空則回傳空陣列

---

### 查詢營收分析

- **Actor**: 店舖管理者
- **Aggregates**: 營收報表 (RevenueReport)
- **回傳欄位**: `totals.gross_revenue`, `totals.net_revenue`, `totals.orders_count`, `totals.avg_order_value`, `totals.num_items_sold`, `intervals[]`，以及去年同期對應數據與 YoY%
- **Description**:
  - What: 查詢指定日期範圍與統計區間的多維度營收分析資料，包含當期與去年同期的詳細比較
  - Why: 讓管理者評估行銷活動效果，找出業績低迷原因，進行年增率（YoY）分析
  - When: 管理者進入「營收分析」頁面，或調整日期範圍、統計區間、商品篩選器時

#### Rules

- 前置（狀態）:
  - 無
- 前置（參數）:
  - `date_from` 與 `date_to` 為必填，且必須為有效 ISO 8601 日期
  - 日期範圍不得超過 1 年（超出時系統顯示警告，結束日期自動調整為起始日期 + 1 年）
  - `interval` 必須為 `day` / `week` / `month` 之一
  - `product_ids` 若提供則必須為有效的商品 ID 陣列（可多選）
- 後置（回應）:
  - 回傳當期與去年同期的完整時序資料（`intervals[]`）
  - 每個指標包含 YoY% 增長率（正增長為綠色，負增長為紅色）
  - 若去年同期無資料，YoY% 標示為 `null`（前端顯示 `N/A`）
