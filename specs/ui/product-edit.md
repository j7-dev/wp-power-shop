# 商品編輯頁面

> 路由：`#/products/edit/:id`

## 頁面說明

多 Tab 頁面，用於編輯商品所有欄位資料。支援 Simple / Variable / Grouped / External 等商品類型。

## Tab 配置

### Tab 1: 描述

| 欄位 | 類型 | 說明 |
|------|------|------|
| name | Input | 商品名稱（必填） |
| slug | Input | URL 別名 |
| description | RichText | 完整描述（HTML） |
| short_description | RichText | 簡短描述（HTML） |

### Tab 2: 價格

| 欄位 | 類型 | 驗證規則 |
|------|------|---------|
| regular_price | InputNumber | >= 0 |
| sale_price | InputNumber | <= regular_price |
| date_on_sale_from | DatePicker | 有效日期 |
| date_on_sale_to | DatePicker | >= date_on_sale_from |

### Tab 3: 庫存

| 欄位 | 類型 | 條件 |
|------|------|------|
| sku | Input | 建議全站唯一 |
| gtin | Input | 全球商品識別碼 |
| manage_stock | Switch | - |
| stock_quantity | InputNumber | 僅 manage_stock=true 時顯示，>= 0 |
| stock_status | Select | instock / outofstock / onbackorder |
| backorders | Select | no / notify / yes |
| low_stock_amount | InputNumber | 安全庫存警示值 |

### Tab 4: 規格（Variable 商品）

| 功能 | 說明 |
|------|------|
| 新增屬性 | 名稱 + options（多選 Tag） |
| variation 標記 | 標記用於建立變體的屬性 |
| 自動生成變體 | 按鈕觸發笛卡兒積生成 |

### Tab 5: 進階

| 欄位 | 說明 |
|------|------|
| purchase_note | 購買後顯示給顧客的訊息 |
| menu_order | 選單排序位置 |
| external_url | External 商品外部連結（必填） |
| button_text | External 商品購買按鈕文字 |

### Tab 6: 關聯

| 欄位 | 類型 | 說明 |
|------|------|------|
| upsell_ids | Select (多選) | 追加銷售商品 |
| cross_sell_ids | Select (多選) | 交叉銷售商品 |
| grouped_products | Select (多選) | 群組子商品（Grouped 類型） |

## 資料來源

| 操作 | Feature 規格 |
|------|-------------|
| 儲存商品 | [save-product-data.feature](../features/product/save-product-data.feature) |
| 生成變體 | [generate-product-variations.feature](../features/product/generate-product-variations.feature) |
