# 實體模型規格

> **文件版本**：1.0
> **最後更新**：2025-03
> **說明**：本文件描述 Power Shop 核心領域實體的欄位定義與關聯結構。資料主要儲存於 WordPress / WooCommerce 資料表，部分擴充欄位使用 Post Meta / User Meta。

---

## 目錄

- [核心實體關聯圖](#核心實體關聯圖)
- [Order（訂單）](#order訂單)
- [OrderNote（訂單備註）](#ordernote訂單備註)
- [Product（商品）](#product商品)
- [ProductVariation（商品變體）](#productvariation商品變體)
- [ProductAttribute（商品規格）](#productattribute商品規格)
- [ProductCategory（商品分類）](#productcategory商品分類)
- [ProductTag（商品標籤）](#producttag商品標籤)
- [Customer（顧客）](#customer顧客)
- [CustomerNote（顧客聯繫備註）](#customernote顧客聯繫備註)
- [DashboardStats（Dashboard 統計）](#dashboardstats-dashboard-統計)
- [RevenueReport（營收報表）](#revenuereport營收報表)

---

## 核心實體關聯圖

```
Order (1) ─────── (n) OrderItem
Order (1) ─────── (n) OrderNote
Order (n) ─────── (1) Customer

Product (1) ──────── (n) ProductVariation
Product (1) ──────── (n) ProductAttribute
Product (n) ──────── (n) ProductCategory   [many-to-many]
Product (n) ──────── (n) ProductTag        [many-to-many]
ProductAttribute (n)─(1) GlobalAttribute

Customer (1) ──────── (n) Order
Customer (1) ──────── (n) CustomerNote
Customer (1) ──────── (1) CartContent      [User Meta]
```

---

## Order（訂單）

> **對應 WooCommerce 資料表**：`wp_posts`（post_type = 'shop_order'）+ `wp_postmeta`

| 欄位名稱 | 類型 | 必填 | 說明 |
|---------|------|------|------|
| `id` | `integer` | ✓ | 訂單 ID（Post ID） |
| `number` | `string` | ✓ | 訂單編號（如 `#1001`） |
| `status` | `enum` | ✓ | 訂單狀態（見下方狀態列表） |
| `date_created` | `datetime` | ✓ | 訂單建立時間（ISO 8601） |
| `date_modified` | `datetime` | ✓ | 最後修改時間（ISO 8601） |
| `customer_id` | `integer` | ✗ | 顧客 ID（0 = 訪客訂單） |
| `customer_note` | `string` | ✗ | 顧客備註 |
| `currency` | `string` | ✓ | 貨幣代碼（如 `TWD`） |
| `total` | `string` | ✓ | 訂單總金額 |
| `subtotal` | `string` | ✓ | 商品小計（不含稅運） |
| `total_tax` | `string` | ✓ | 稅金總額 |
| `shipping_total` | `string` | ✓ | 運費 |
| `discount_total` | `string` | ✓ | 折扣金額 |
| `payment_method` | `string` | ✗ | 付款方式代碼 |
| `payment_method_title` | `string` | ✗ | 付款方式顯示名稱 |
| `transaction_id` | `string` | ✗ | 付款交易 ID |
| `billing` | `Address` | ✓ | 帳單地址物件 |
| `shipping` | `Address` | ✓ | 運送地址物件 |
| `line_items` | `OrderItem[]` | ✓ | 訂單商品明細 |
| `shipping_lines` | `ShippingLine[]` | ✗ | 運送方式 |
| `fee_lines` | `FeeLine[]` | ✗ | 附加費用 |
| `coupon_lines` | `CouponLine[]` | ✗ | 使用的優惠券 |
| `meta_data` | `MetaData[]` | ✗ | 自訂 Meta 資料 |

**訂單狀態（`status`）**

| 值 | 顯示名稱 | 說明 |
|----|---------|------|
| `pending` | 待付款 | 已建立但未付款 |
| `processing` | 處理中 | 已付款，待出貨 |
| `on-hold` | 保留中 | 等待進一步確認 |
| `completed` | 已完成 | 已出貨且完成 |
| `cancelled` | 已取消 | 已取消 |
| `refunded` | 已退款 | 已全額退款 |
| `failed` | 失敗 | 付款失敗 |

**Address 子物件**

| 欄位 | 類型 | 說明 |
|------|------|------|
| `first_name` | `string` | 名字 |
| `last_name` | `string` | 姓氏 |
| `company` | `string` | 公司名稱 |
| `address_1` | `string` | 地址第一行 |
| `address_2` | `string` | 地址第二行 |
| `city` | `string` | 城市 |
| `state` | `string` | 州/省/縣市 |
| `postcode` | `string` | 郵遞區號 |
| `country` | `string` | 國家代碼（ISO 3166-1 alpha-2） |
| `email` | `string` | Email（帳單地址限定） |
| `phone` | `string` | 電話 |

**OrderItem 子物件**

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | `integer` | 訂單商品項目 ID |
| `name` | `string` | 商品名稱（快照） |
| `product_id` | `integer` | 關聯商品 ID |
| `variation_id` | `integer` | 關聯變體 ID（若為變體商品） |
| `quantity` | `integer` | 數量 |
| `subtotal` | `string` | 小計 |
| `total` | `string` | 合計（含折扣） |
| `sku` | `string` | SKU 快照 |
| `meta_data` | `MetaData[]` | 變體屬性等 Meta |

---

## OrderNote（訂單備註）

> **對應 WooCommerce 資料表**：`wp_comments`（comment_type = 'order_note'）

| 欄位名稱 | 類型 | 必填 | 說明 |
|---------|------|------|------|
| `id` | `integer` | ✓ | 備註 ID |
| `author` | `string` | ✓ | 建立者名稱 |
| `date_created` | `datetime` | ✓ | 建立時間 |
| `note` | `string` | ✓ | 備註內容 |
| `customer_note` | `boolean` | ✓ | `true` = 顧客可見；`false` = 內部備註 |

---

## Product（商品）

> **對應 WooCommerce 資料表**：`wp_posts`（post_type = 'product'）+ `wp_postmeta`

| 欄位名稱 | 類型 | 必填 | 說明 |
|---------|------|------|------|
| `id` | `integer` | ✓ | 商品 ID |
| `name` | `string` | ✓ | 商品名稱 |
| `slug` | `string` | ✓ | URL 別名 |
| `type` | `enum` | ✓ | 商品類型（見下方） |
| `status` | `enum` | ✓ | 發布狀態（`publish`、`draft`、`trash`） |
| `description` | `string` | ✗ | 完整描述（HTML） |
| `short_description` | `string` | ✗ | 簡短描述（HTML） |
| `sku` | `string` | ✗ | SKU |
| `gtin` | `string` | ✗ | GTIN（Global Trade Item Number） |
| `regular_price` | `string` | ✗ | 一般售價 |
| `sale_price` | `string` | ✗ | 特價 |
| `date_on_sale_from` | `datetime` | ✗ | 特價起始時間 |
| `date_on_sale_to` | `datetime` | ✗ | 特價結束時間 |
| `manage_stock` | `boolean` | ✓ | 是否啟用庫存管理 |
| `stock_quantity` | `integer` | ✗ | 庫存數量（`manage_stock = true` 時有效） |
| `stock_status` | `enum` | ✓ | `instock`、`outofstock`、`onbackorder` |
| `backorders` | `enum` | ✓ | `no`、`notify`、`yes` |
| `low_stock_amount` | `integer` | ✗ | 安全庫存警示值 |
| `weight` | `string` | ✗ | 重量 |
| `dimensions` | `Dimensions` | ✗ | 尺寸（長/寬/高） |
| `images` | `Image[]` | ✗ | 圖片列表（第一張為主圖，其餘為相片庫） |
| `categories` | `ProductCategory[]` | ✗ | 所屬分類 |
| `tags` | `ProductTag[]` | ✗ | 標籤 |
| `attributes` | `ProductAttribute[]` | ✗ | 規格屬性 |
| `variations` | `integer[]` | ✗ | 變體 ID 列表（Variable 商品） |
| `upsell_ids` | `integer[]` | ✗ | 追加銷售商品 ID 列表 |
| `cross_sell_ids` | `integer[]` | ✗ | 交叉銷售商品 ID 列表 |
| `grouped_products` | `integer[]` | ✗ | 分組商品 ID 列表 |
| `purchase_note` | `string` | ✗ | 購買備註 |
| `menu_order` | `integer` | ✓ | 選單排序 |
| `external_url` | `string` | ✗ | 外部商品購買連結（External 類型） |
| `button_text` | `string` | ✗ | 外部商品按鈕文字 |
| `meta_data` | `MetaData[]` | ✗ | 自訂 Meta（含訂閱制設定） |

**商品類型（`type`）**

| 值 | 說明 |
|----|------|
| `simple` | 簡單商品 |
| `variable` | 變體商品 |
| `grouped` | 分組商品 |
| `external` | 外部商品 |
| `subscription` | 訂閱制商品（需 WC Subscriptions） |
| `variable-subscription` | 變體訂閱制商品 |

---

## ProductVariation（商品變體）

> **對應 WooCommerce 資料表**：`wp_posts`（post_type = 'product_variation'）+ `wp_postmeta`

| 欄位名稱 | 類型 | 必填 | 說明 |
|---------|------|------|------|
| `id` | `integer` | ✓ | 變體 ID |
| `parent_id` | `integer` | ✓ | 所屬商品 ID |
| `sku` | `string` | ✗ | 變體 SKU |
| `regular_price` | `string` | ✗ | 一般售價 |
| `sale_price` | `string` | ✗ | 特價 |
| `status` | `enum` | ✓ | `publish`、`private` |
| `manage_stock` | `boolean` | ✓ | 是否獨立管理庫存 |
| `stock_quantity` | `integer` | ✗ | 庫存數量 |
| `stock_status` | `enum` | ✓ | `instock`、`outofstock`、`onbackorder` |
| `image` | `Image` | ✗ | 變體圖片 |
| `attributes` | `VariationAttribute[]` | ✓ | 變體屬性值（如 `{ name: "顏色", option: "紅色" }`） |
| `meta_data` | `MetaData[]` | ✗ | 自訂 Meta |

---

## ProductAttribute（商品規格）

| 欄位名稱 | 類型 | 必填 | 說明 |
|---------|------|------|------|
| `id` | `integer` | ✗ | 全域屬性 ID（0 = 自訂屬性） |
| `name` | `string` | ✓ | 屬性名稱 |
| `position` | `integer` | ✓ | 排序位置（拖拉排序） |
| `visible` | `boolean` | ✓ | 是否顯示於商品頁面 |
| `variation` | `boolean` | ✓ | 是否用於建立變體 |
| `options` | `string[]` | ✓ | 屬性選項值列表 |

---

## ProductCategory（商品分類）

> **對應 WordPress 資料表**：`wp_terms` + `wp_term_taxonomy`（taxonomy = 'product_cat'）

| 欄位名稱 | 類型 | 必填 | 說明 |
|---------|------|------|------|
| `id` | `integer` | ✓ | 分類 ID |
| `name` | `string` | ✓ | 分類名稱 |
| `slug` | `string` | ✓ | URL 別名 |
| `parent` | `integer` | ✓ | 父分類 ID（0 = 頂層分類） |
| `description` | `string` | ✗ | 分類描述 |
| `image` | `Image` | ✗ | 分類縮圖 |
| `count` | `integer` | ✓ | 所屬商品數量 |
| `menu_order` | `integer` | ✓ | 排序位置（SortableTree 使用） |

---

## ProductTag（商品標籤）

> **對應 WordPress 資料表**：`wp_terms` + `wp_term_taxonomy`（taxonomy = 'product_tag'）

| 欄位名稱 | 類型 | 必填 | 說明 |
|---------|------|------|------|
| `id` | `integer` | ✓ | 標籤 ID |
| `name` | `string` | ✓ | 標籤名稱 |
| `slug` | `string` | ✓ | URL 別名 |
| `description` | `string` | ✗ | 標籤描述 |
| `count` | `integer` | ✓ | 所屬商品數量 |

---

## Customer（顧客）

> **對應 WordPress 資料表**：`wp_users` + `wp_usermeta`

| 欄位名稱 | 類型 | 必填 | 說明 |
|---------|------|------|------|
| `id` | `integer` | ✓ | 顧客 ID（WP User ID） |
| `email` | `string` | ✓ | Email 地址（唯一） |
| `first_name` | `string` | ✗ | 名字 |
| `last_name` | `string` | ✗ | 姓氏 |
| `username` | `string` | ✓ | WordPress 使用者名稱 |
| `role` | `string` | ✓ | WordPress 角色（如 `customer`） |
| `date_created` | `datetime` | ✓ | 帳號建立時間 |
| `date_modified` | `datetime` | ✓ | 資料最後修改時間 |
| `billing` | `Address` | ✗ | 預設帳單地址 |
| `shipping` | `Address` | ✗ | 預設運送地址 |
| `is_paying_customer` | `boolean` | ✓ | 是否曾付款下單 |
| `orders_count` | `integer` | ✓ | 訂單總數 |
| `total_spent` | `string` | ✓ | 總消費金額 |
| `last_order` | `LastOrder` | ✗ | 最近一筆訂單摘要 |
| `avatar_url` | `string` | ✗ | 頭像 URL |
| `meta_data` | `MetaData[]` | ✗ | User Meta 擴充資料 |

---

## CustomerNote（顧客聯繫備註）

> **對應 WordPress 資料表**：`wp_comments`（comment_type = 'customer_note'）或自訂 User Meta

| 欄位名稱 | 類型 | 必填 | 說明 |
|---------|------|------|------|
| `id` | `integer` | ✓ | 備註 ID |
| `customer_id` | `integer` | ✓ | 所屬顧客 ID |
| `author_id` | `integer` | ✓ | 建立者（WordPress User ID） |
| `author_name` | `string` | ✓ | 建立者顯示名稱 |
| `content` | `string` | ✓ | 備註內容 |
| `date_created` | `datetime` | ✓ | 建立時間 |

---

## DashboardStats（Dashboard 統計）

> **來源**：Power Shop 自有 API `/power-shop/reports/dashboard/stats`
> **非持久化實體**：每次請求動態計算，不存入資料庫

| 欄位名稱 | 類型 | 說明 |
|---------|------|------|
| `current.revenue` | `float` | 當期總營收 |
| `current.new_customers` | `integer` | 當期新註冊顧客數 |
| `current.pending_orders` | `integer` | 未付款訂單數 |
| `current.processing_orders` | `integer` | 未出貨訂單數 |
| `previous.*` | 同上 | 前一等長期間的對應數值 |
| `change.*_pct` | `float` | 環比變化百分比 |
| `generated_at` | `datetime` | 資料生成時間戳 |

---

## RevenueReport（營收報表）

> **來源**：WooCommerce REST API `/wc/v3/reports/revenue/stats`
> **非持久化實體**：動態計算，不存入資料庫

| 欄位名稱 | 類型 | 說明 |
|---------|------|------|
| `totals.gross_revenue` | `float` | 總營收（含退款前） |
| `totals.net_revenue` | `float` | 淨營收（扣除退款） |
| `totals.orders_count` | `integer` | 訂單數量 |
| `totals.avg_order_value` | `float` | 平均訂單金額 |
| `totals.num_items_sold` | `integer` | 售出商品總件數 |
| `totals.coupons` | `float` | 優惠券折扣總額 |
| `totals.refunds` | `float` | 退款總額 |
| `intervals` | `Interval[]` | 依區間分組的時序資料陣列 |
| `intervals[].interval` | `string` | 區間識別符（如 `2025-03`） |
| `intervals[].date_start` | `datetime` | 區間起始時間 |
| `intervals[].date_end` | `datetime` | 區間結束時間 |
| `intervals[].subtotals.*` | 同 totals | 該區間的細項統計數值 |
