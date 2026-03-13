# 商品列表頁面

> 路由：`#/products`

## 頁面說明

顯示所有商品的分頁列表，支援類型篩選、狀態篩選，提供快速建立草稿商品功能。

## 功能區塊

### 1. 操作列

| 元素 | 類型 | 說明 |
|------|------|------|
| 快速建立 | Button | 僅需輸入商品名稱，建立 status=draft 的商品 |

### 2. 篩選列

| 篩選器 | 類型 | 選項 |
|--------|------|------|
| 商品類型 | Select | simple / variable / grouped / external / subscription / variable-subscription |
| 發布狀態 | Select | publish / draft / trash |

### 3. 商品表格

| 欄位 | 寬度 | 說明 |
|------|------|------|
| 縮圖 | 60px | `images[0]` 或預設佔位圖 |
| 商品名稱 | auto | 可點擊進入編輯頁 |
| 類型 | 100px | Tag 顯示 |
| 狀態 | 80px | publish=綠 / draft=灰 / trash=紅 |
| SKU | 120px | - |
| 價格 | 120px | regular_price（含特價刪除線） |
| 庫存 | 100px | stock_status Tag |

- 預設排序：`id` DESC
- 分頁：10 / 25 / 50 筆/頁

## 資料來源

| 操作 | Feature 規格 |
|------|-------------|
| 查詢列表 | [query-product-list.feature](../features/product/query-product-list.feature) |
| 快速建立 | [create-draft-product.feature](../features/product/create-draft-product.feature) |
